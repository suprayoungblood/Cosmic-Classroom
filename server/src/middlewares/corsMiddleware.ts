import cors from 'cors';
import { ENV } from '../config/env';

/**
 * Configure CORS for development and production environments
 */
const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) {
      callback(null, true);
      return;
    }

    // List of allowed origins
    const allowedOrigins = [
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://client:5173',  // Docker service name
      'http://localhost:3000',
    ];

    // Always allow in development mode
    if (ENV.NODE_ENV === 'development') {
      callback(null, true);
      return;
    }

    // Check if the request origin is allowed
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
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
export const corsMiddleware = cors(corsOptions);

/**
 * Enable CORS for specific routes
 */
export default corsMiddleware;