import express from 'express';
import { body } from 'express-validator';
import { register, login, getProfile, updateProfile } from '../../controllers/auth/authController';
import { authenticate } from '../../middlewares/auth/authMiddleware';

const router = express.Router();

// Register route with validation
router.post(
  '/register',
  [
    body('username')
      .trim()
      .isLength({ min: 3, max: 30 })
      .withMessage('Username must be between 3 and 30 characters'),
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    body('firstName')
      .optional()
      .trim()
      .isLength({ max: 50 })
      .withMessage('First name cannot exceed 50 characters'),
    body('lastName')
      .optional()
      .trim()
      .isLength({ max: 50 })
      .withMessage('Last name cannot exceed 50 characters')
  ],
  register
);

// Login route with validation
router.post(
  '/login',
  [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
    body('password')
      .not()
      .isEmpty()
      .withMessage('Password is required')
  ],
  login
);

// Protected route - get profile
router.get('/profile', authenticate, getProfile);

// Protected route - update profile
router.put(
  '/profile',
  authenticate,
  [
    body('firstName')
      .optional()
      .trim()
      .isLength({ max: 50 })
      .withMessage('First name cannot exceed 50 characters'),
    body('lastName')
      .optional()
      .trim()
      .isLength({ max: 50 })
      .withMessage('Last name cannot exceed 50 characters'),
    body('interests')
      .optional()
      .isArray()
      .withMessage('Interests must be an array'),
    body('profilePicture')
      .optional()
      .isURL()
      .withMessage('Profile picture must be a valid URL')
  ],
  updateProfile
);

export default router;