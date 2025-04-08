"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsMiddleware = void 0;
const cors_1 = __importDefault(require("cors"));
const env_1 = require("../config/env");
/**
 * Configure CORS for development and production environments
 */
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, curl, Postman)
        if (!origin) {
            callback(null, true);
            return;
        }
        // List of allowed origins
        const allowedOrigins = [
            'http://localhost:5173',
            'http://127.0.0.1:5173',
            'http://client:5173', // Docker service name
            'http://localhost:3000',
        ];
        // Always allow in development mode
        if (env_1.ENV.NODE_ENV === 'development') {
            callback(null, true);
            return;
        }
        // Check if the request origin is allowed
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204
};
/**
 * CORS middleware for routes
 */
exports.corsMiddleware = (0, cors_1.default)(corsOptions);
/**
 * Enable CORS for specific routes
 */
exports.default = exports.corsMiddleware;
