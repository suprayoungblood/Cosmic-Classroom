"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.getProfile = exports.login = exports.register = void 0;
const express_validator_1 = require("express-validator");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../../models/User");
const env_1 = require("../../config/env");
const sequelize_1 = require("sequelize");
// Generate JWT token
const generateToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, env_1.ENV.JWT_SECRET, {
        expiresIn: '7d'
    });
};
// Register new user
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Register request received:', req.body);
        // Validate request
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            console.log('Validation errors:', errors.array());
            return res.status(400).json({ errors: errors.array() });
        }
        const { username, email, password, firstName, lastName, role = 'student', age, interests = ['space'] } = req.body;
        // Check if user already exists
        const existingUser = yield User_1.User.findOne({
            where: {
                [sequelize_1.Op.or]: [{ email }, { username }]
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
        const user = yield User_1.User.create({
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
    }
    catch (error) {
        console.error('Registration error:', error);
        // Check for Sequelize validation errors
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const validationErrors = error.errors.map((err) => ({
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
});
exports.register = register;
// User login
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate request
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { email, password } = req.body;
        // Find user by email
        const user = yield User_1.User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        // Compare passwords
        const isMatch = yield user.comparePassword(password);
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
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
});
exports.login = login;
// Get user profile
const getProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // User is attached by auth middleware
        const user = req.user;
        res.json({
            id: user.id,
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            profilePicture: user.profilePicture,
            interests: user.interests
        });
    }
    catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'Server error fetching profile' });
    }
});
exports.getProfile = getProfile;
// Update user profile
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const user = req.user;
        const { firstName, lastName, interests, profilePicture } = req.body;
        // Update fields
        yield user.update({
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
    }
    catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Server error updating profile' });
    }
});
exports.updateProfile = updateProfile;
