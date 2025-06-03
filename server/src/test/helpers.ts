import jwt from 'jsonwebtoken';
import { User } from '../models';
import env from '../config/env';

export const createTestUser = async (overrides = {}) => {
  const defaultUser = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'TestPassword123!',
    role: 'student',
    ...overrides
  };

  const user = await User.create(defaultUser);
  return user;
};

export const generateTestToken = (userId: number, role: string = 'student') => {
  return jwt.sign(
    { id: userId, role },
    env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

export const mockRequest = (data: any = {}) => {
  return {
    body: {},
    params: {},
    query: {},
    headers: {},
    user: null,
    ...data
  };
};

export const mockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.cookie = jest.fn().mockReturnValue(res);
  return res;
};

export const mockNext = jest.fn();