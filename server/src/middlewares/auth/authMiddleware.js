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
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../../config/env");
const User_1 = require("../../models/User");

// Use ENV.JWT_SECRET directly to ensure consistency with other parts of the application
// This matches how tokens are generated in authController.js/ts
const JWT_SECRET = env_1.ENV.JWT_SECRET;

// Enhanced authentication middleware with better error handling and token validation
const authenticate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Log key information for debugging (in development only)
        if (env_1.ENV.NODE_ENV === 'development') {
            console.log(`Auth request for path: ${req.path}`);
        }

        // Check if this is a game route which should have bypass logic
        const isGameRoute = req.path.startsWith('/game/');
        
        // Get token from header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            // For game routes, allow unauthenticated access
            if (isGameRoute) {
                req.isAuthenticated = false; // Mark as unauthenticated but allowed
                return next();
            }
            return res.status(401).json({ message: 'Authentication required' });
        }
        
        const token = authHeader.split(' ')[1];
        if (!token) {
            // For game routes, allow unauthenticated access
            if (isGameRoute) {
                req.isAuthenticated = false; // Mark as unauthenticated but allowed
                return next();
            }
            return res.status(401).json({ message: 'No token provided' });
        }

        // Basic validation of token format
        const tokenParts = token.split('.');
        if (tokenParts.length !== 3) {
            if (isGameRoute) {
                req.isAuthenticated = false;
                return next();
            }
            return res.status(401).json({ message: 'Invalid token format' });
        }
        
        // Verify token using consistent JWT_SECRET
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        
        // Find user by id
        const user = yield User_1.User.findByPk(decoded.id);
        if (!user) {
            // For game routes, allow unauthenticated access
            if (isGameRoute) {
                req.isAuthenticated = false;
                return next();
            }
            return res.status(401).json({ message: 'User not found' });
        }
        
        // Attach user to request
        req.user = user;
        req.isAuthenticated = true;
        next();
    }
    catch (error) {
        // Log detailed error for debugging
        console.error('Auth middleware error:', error);
        
        // Don't return error status for game routes - they'll handle fallbacks
        if (req.path.startsWith('/game/')) {
            req.isAuthenticated = false;
            return next();
        }
        
        // Provide more detailed error messages based on error type
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        } else if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        } else {
            return res.status(401).json({ message: 'Authentication failed' });
        }
    }
});
exports.authenticate = authenticate;
