import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import { User, UserAttributes } from '../../models/User';
import { ENV } from '../../config/env';
import sequelize from '../../models/index';
import { Op } from 'sequelize';

// Generate JWT token
const generateToken = (id: number): string => {
  return jwt.sign({ id }, ENV.JWT_SECRET, {
    expiresIn: '7d'
  });
};

// Register new user
export const register = async (req: Request, res: Response) => {
  try {
    console.log('Register request received:', req.body);
    
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { 
      username, 
      email, 
      password, 
      firstName, 
      lastName, 
      role = 'student', 
      age, 
      interests = ['space'] 
    } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ 
      where: { 
        [Op.or]: [{ email }, { username }] 
      } 
    });
    
    console.log('Checking if user exists:', { email, username });
    console.log('Existing user:', existingUser ? 'Found' : 'Not found');
    
    if (existingUser) {
      return res.status(400).json({ 
        message: 'User already exists with this email or username' 
      });
    }
    
    console.log('Creating new user with data:', {
      username,
      email,
      firstName,
      lastName,
      role,
      age,
      interests
    });
    
    // Create new user
    const user = await User.create({
      username,
      email,
      password,
      firstName,
      lastName,
      role,
      age,
      interests
    });
    
    console.log('User created successfully with ID:', user.id);
    
    // Generate token
    const token = generateToken(user.id);
    
    // Add role to the response
    res.status(201).json({
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      profilePicture: user.profilePicture,
      interests: user.interests,
      role: req.body.role || 'student', // Add the role from request
      token
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    
    // Check for Sequelize validation errors
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const validationErrors = error.errors.map((err: any) => ({
        field: err.path,
        message: err.message
      }));
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: validationErrors 
      });
    }
    
    // Handle other specific errors
    if (error.message.includes('duplicate key') || error.message.includes('unique constraint')) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }
    
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// User login
export const login = async (req: Request, res: Response) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Compare passwords
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Generate token
    const token = generateToken(user.id);
    
    // Return user data
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      profilePicture: user.profilePicture,
      interests: user.interests,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// Get user profile
export const getProfile = async (req: Request, res: Response) => {
  try {
    // User is attached by auth middleware
    const user = req.user as User;
    
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      profilePicture: user.profilePicture,
      interests: user.interests
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error fetching profile' });
  }
};

// Update user profile
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const user = req.user as User;
    const { firstName, lastName, interests, profilePicture } = req.body;
    
    // Update fields
    await user.update({
      firstName: firstName || user.firstName,
      lastName: lastName || user.lastName, 
      interests: interests || user.interests,
      profilePicture: profilePicture || user.profilePicture
    });
    
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      profilePicture: user.profilePicture,
      interests: user.interests
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error updating profile' });
  }
};