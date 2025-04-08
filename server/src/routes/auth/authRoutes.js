"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const authController_1 = require("../../controllers/auth/authController");
const authMiddleware_1 = require("../../middlewares/auth/authMiddleware");
const router = express_1.default.Router();
// Register route with validation
router.post('/register', [
    (0, express_validator_1.body)('username')
        .trim()
        .isLength({ min: 3, max: 30 })
        .withMessage('Username must be between 3 and 30 characters'),
    (0, express_validator_1.body)('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    (0, express_validator_1.body)('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    (0, express_validator_1.body)('firstName')
        .optional()
        .trim()
        .isLength({ max: 50 })
        .withMessage('First name cannot exceed 50 characters'),
    (0, express_validator_1.body)('lastName')
        .optional()
        .trim()
        .isLength({ max: 50 })
        .withMessage('Last name cannot exceed 50 characters')
], authController_1.register);
// Login route with validation
router.post('/login', [
    (0, express_validator_1.body)('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    (0, express_validator_1.body)('password')
        .not()
        .isEmpty()
        .withMessage('Password is required')
], authController_1.login);
// Protected route - get profile
router.get('/profile', authMiddleware_1.authenticate, authController_1.getProfile);
// Protected route - update profile
router.put('/profile', authMiddleware_1.authenticate, [
    (0, express_validator_1.body)('firstName')
        .optional()
        .trim()
        .isLength({ max: 50 })
        .withMessage('First name cannot exceed 50 characters'),
    (0, express_validator_1.body)('lastName')
        .optional()
        .trim()
        .isLength({ max: 50 })
        .withMessage('Last name cannot exceed 50 characters'),
    (0, express_validator_1.body)('interests')
        .optional()
        .isArray()
        .withMessage('Interests must be an array'),
    (0, express_validator_1.body)('profilePicture')
        .optional()
        .isURL()
        .withMessage('Profile picture must be a valid URL')
], authController_1.updateProfile);
exports.default = router;
