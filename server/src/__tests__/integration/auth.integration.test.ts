import request from 'supertest';
import express from 'express';
import { sequelize } from '../../config/database';
import { User } from '../../models';
import authRoutes from '../../routes/auth/authRoutes';
import errorHandler from '../../middlewares/errorHandler';
import cors from 'cors';
import bcrypt from 'bcryptjs';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use(errorHandler);

describe('Auth API Integration Tests', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterEach(async () => {
    await User.destroy({ where: {}, truncate: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'Password123!',
          role: 'student'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'User registered successfully');
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toMatchObject({
        username: 'testuser',
        email: 'test@example.com',
        role: 'student'
      });
      expect(response.body.user).not.toHaveProperty('password');

      // Verify user was created in database
      const user = await User.findOne({ where: { email: 'test@example.com' } });
      expect(user).toBeTruthy();
      expect(user?.username).toBe('testuser');
    });

    it('should not register user with existing email', async () => {
      // Create existing user
      await User.create({
        username: 'existing',
        email: 'existing@example.com',
        password: await bcrypt.hash('Password123!', 10),
        role: 'student'
      });

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'newuser',
          email: 'existing@example.com',
          password: 'Password123!',
          role: 'student'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'User already exists');
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser'
          // Missing email and password
        });

      expect(response.status).toBe(500);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create test user
      await User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: await bcrypt.hash('Password123!', 10),
        role: 'student'
      });
    });

    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'Password123!'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Login successful');
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toMatchObject({
        username: 'testuser',
        email: 'test@example.com',
        role: 'student'
      });
    });

    it('should handle demo login', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'demo',
          password: 'demo'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Demo login successful');
      expect(response.body.user).toMatchObject({
        id: 'demo-user',
        username: 'Demo User',
        email: 'demo@cosmicclassroom.com',
        role: 'student',
        isDemo: true
      });
      expect(response.body).toHaveProperty('token');
    });

    it('should reject invalid password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'WrongPassword'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Invalid email or password');
    });

    it('should reject non-existent user', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'Password123!'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Invalid email or password');
    });
  });

  describe('GET /api/auth/profile', () => {
    let authToken: string;
    let userId: number;

    beforeEach(async () => {
      // Create and login user to get token
      const user = await User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: await bcrypt.hash('Password123!', 10),
        role: 'student'
      });
      userId = user.id;

      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'Password123!'
        });

      authToken = loginResponse.body.token;
    });

    it('should get user profile with valid token', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.user).toMatchObject({
        id: userId,
        username: 'testuser',
        email: 'test@example.com',
        role: 'student'
      });
      expect(response.body.user).not.toHaveProperty('password');
    });

    it('should reject request without token', async () => {
      const response = await request(app)
        .get('/api/auth/profile');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'No token, authorization denied');
    });

    it('should reject request with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Token is not valid');
    });
  });

  describe('PUT /api/auth/profile', () => {
    let authToken: string;

    beforeEach(async () => {
      // Create and login user to get token
      await User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: await bcrypt.hash('Password123!', 10),
        role: 'student'
      });

      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'Password123!'
        });

      authToken = loginResponse.body.token;
    });

    it('should update user profile', async () => {
      const response = await request(app)
        .put('/api/auth/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          username: 'updateduser',
          email: 'updated@example.com'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Profile updated successfully');
      expect(response.body.user).toMatchObject({
        username: 'updateduser',
        email: 'updated@example.com'
      });

      // Verify update in database
      const user = await User.findOne({ where: { email: 'updated@example.com' } });
      expect(user?.username).toBe('updateduser');
    });

    it('should update password', async () => {
      const response = await request(app)
        .put('/api/auth/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          password: 'NewPassword123!'
        });

      expect(response.status).toBe(200);

      // Verify can login with new password
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'NewPassword123!'
        });

      expect(loginResponse.status).toBe(200);
    });
  });
});