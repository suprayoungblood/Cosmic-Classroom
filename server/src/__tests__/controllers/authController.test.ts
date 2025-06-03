import { register, login, getProfile, updateProfile } from '../../controllers/auth/authController';
import { User } from '../../models';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { mockRequest, mockResponse, mockNext } from '../../test/helpers';

jest.mock('../../models');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('AuthController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const req = mockRequest({
        body: {
          username: 'newuser',
          email: 'newuser@example.com',
          password: 'Password123!',
          role: 'student'
        }
      });
      const res = mockResponse();

      const hashedPassword = 'hashedPassword123';
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      
      const mockUser = {
        id: 1,
        username: 'newuser',
        email: 'newuser@example.com',
        role: 'student',
        toJSON: jest.fn().mockReturnValue({
          id: 1,
          username: 'newuser',
          email: 'newuser@example.com',
          role: 'student'
        })
      };
      
      (User.findOne as jest.Mock).mockResolvedValue(null);
      (User.create as jest.Mock).mockResolvedValue(mockUser);
      (jwt.sign as jest.Mock).mockReturnValue('mockToken');

      await register(req, res, mockNext);

      expect(User.findOne).toHaveBeenCalledWith({
        where: { email: 'newuser@example.com' }
      });
      expect(bcrypt.hash).toHaveBeenCalledWith('Password123!', 10);
      expect(User.create).toHaveBeenCalledWith({
        username: 'newuser',
        email: 'newuser@example.com',
        password: hashedPassword,
        role: 'student'
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User registered successfully',
        user: {
          id: 1,
          username: 'newuser',
          email: 'newuser@example.com',
          role: 'student'
        },
        token: 'mockToken'
      });
    });

    it('should return error if user already exists', async () => {
      const req = mockRequest({
        body: {
          username: 'existinguser',
          email: 'existing@example.com',
          password: 'Password123!',
          role: 'student'
        }
      });
      const res = mockResponse();

      (User.findOne as jest.Mock).mockResolvedValue({ id: 1 });

      await register(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User already exists'
      });
    });

    it('should handle registration errors', async () => {
      const req = mockRequest({
        body: {
          username: 'newuser',
          email: 'newuser@example.com',
          password: 'Password123!',
          role: 'student'
        }
      });
      const res = mockResponse();

      (User.findOne as jest.Mock).mockRejectedValue(new Error('Database error'));

      await register(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Server error'
      });
    });
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      const req = mockRequest({
        body: {
          email: 'user@example.com',
          password: 'Password123!'
        }
      });
      const res = mockResponse();

      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'user@example.com',
        password: 'hashedPassword',
        role: 'student',
        toJSON: jest.fn().mockReturnValue({
          id: 1,
          username: 'testuser',
          email: 'user@example.com',
          role: 'student'
        })
      };

      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue('mockToken');

      await login(req, res, mockNext);

      expect(User.findOne).toHaveBeenCalledWith({
        where: { email: 'user@example.com' }
      });
      expect(bcrypt.compare).toHaveBeenCalledWith('Password123!', 'hashedPassword');
      expect(res.json).toHaveBeenCalledWith({
        message: 'Login successful',
        user: {
          id: 1,
          username: 'testuser',
          email: 'user@example.com',
          role: 'student'
        },
        token: 'mockToken'
      });
    });

    it('should handle demo login', async () => {
      const req = mockRequest({
        body: {
          email: 'demo',
          password: 'demo'
        }
      });
      const res = mockResponse();

      (jwt.sign as jest.Mock).mockReturnValue('demoToken');

      await login(req, res, mockNext);

      expect(res.json).toHaveBeenCalledWith({
        message: 'Demo login successful',
        user: {
          id: 'demo-user',
          username: 'Demo User',
          email: 'demo@cosmicclassroom.com',
          role: 'student',
          isDemo: true
        },
        token: 'demoToken'
      });
    });

    it('should return error for invalid credentials', async () => {
      const req = mockRequest({
        body: {
          email: 'user@example.com',
          password: 'WrongPassword'
        }
      });
      const res = mockResponse();

      const mockUser = {
        password: 'hashedPassword'
      };

      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await login(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Invalid email or password'
      });
    });
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      const req = mockRequest({
        user: { id: 1 }
      });
      const res = mockResponse();

      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        role: 'student',
        createdAt: new Date(),
        toJSON: jest.fn().mockReturnValue({
          id: 1,
          username: 'testuser',
          email: 'test@example.com',
          role: 'student'
        })
      };

      (User.findByPk as jest.Mock).mockResolvedValue(mockUser);

      await getProfile(req, res, mockNext);

      expect(User.findByPk).toHaveBeenCalledWith(1, {
        attributes: { exclude: ['password'] }
      });
      expect(res.json).toHaveBeenCalledWith({
        user: {
          id: 1,
          username: 'testuser',
          email: 'test@example.com',
          role: 'student'
        }
      });
    });

    it('should return demo profile for demo user', async () => {
      const req = mockRequest({
        user: { id: 'demo-user', isDemo: true }
      });
      const res = mockResponse();

      await getProfile(req, res, mockNext);

      expect(res.json).toHaveBeenCalledWith({
        user: {
          id: 'demo-user',
          username: 'Demo User',
          email: 'demo@cosmicclassroom.com',
          role: 'student',
          isDemo: true,
          createdAt: expect.any(Date),
          experience: 0,
          level: 1,
          badges: ['New Explorer'],
          dailyStreak: 1,
          totalQuestionsAsked: 0,
          questionsToday: 0
        }
      });
    });
  });

  describe('updateProfile', () => {
    it('should update user profile successfully', async () => {
      const req = mockRequest({
        user: { id: 1 },
        body: {
          username: 'updateduser',
          email: 'updated@example.com'
        }
      });
      const res = mockResponse();

      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        update: jest.fn().mockResolvedValue(true),
        toJSON: jest.fn().mockReturnValue({
          id: 1,
          username: 'updateduser',
          email: 'updated@example.com',
          role: 'student'
        })
      };

      (User.findByPk as jest.Mock).mockResolvedValue(mockUser);

      await updateProfile(req, res, mockNext);

      expect(User.findByPk).toHaveBeenCalledWith(1);
      expect(mockUser.update).toHaveBeenCalledWith({
        username: 'updateduser',
        email: 'updated@example.com'
      });
      expect(res.json).toHaveBeenCalledWith({
        message: 'Profile updated successfully',
        user: {
          id: 1,
          username: 'updateduser',
          email: 'updated@example.com',
          role: 'student'
        }
      });
    });

    it('should handle password update', async () => {
      const req = mockRequest({
        user: { id: 1 },
        body: {
          username: 'testuser',
          password: 'NewPassword123!'
        }
      });
      const res = mockResponse();

      const mockUser = {
        id: 1,
        update: jest.fn().mockResolvedValue(true),
        toJSON: jest.fn().mockReturnValue({
          id: 1,
          username: 'testuser',
          email: 'test@example.com',
          role: 'student'
        })
      };

      (User.findByPk as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.hash as jest.Mock).mockResolvedValue('newHashedPassword');

      await updateProfile(req, res, mockNext);

      expect(bcrypt.hash).toHaveBeenCalledWith('NewPassword123!', 10);
      expect(mockUser.update).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'newHashedPassword'
      });
    });
  });
});