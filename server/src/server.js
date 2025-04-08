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
const express_1 = __importDefault(require("express"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const env_1 = require("./config/env");
const models_1 = __importDefault(require("./models"));
const questionRoutes_1 = __importDefault(require("./routes/questionRoutes"));
const topicRoutes_1 = __importDefault(require("./routes/topicRoutes"));
const authRoutes_1 = __importDefault(require("./routes/auth/authRoutes"));
const gameMechanicsRoutes_1 = __importDefault(require("./routes/gameMechanicsRoutes"));
const errorHandler_1 = __importDefault(require("./middlewares/errorHandler"));
const corsMiddleware_1 = __importDefault(require("./middlewares/corsMiddleware"));
// Initialize Express app
const app = (0, express_1.default)();
// Enable CORS with custom options
app.use(corsMiddleware_1.default);
// JSON parsing middleware
app.use(express_1.default.json());
// Rate limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);
// Import the seed function
const seedData_1 = require("./seeders/seedData");
// Initialize database connection with retry logic
const initializeDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    let retries = 5;
    while (retries) {
        try {
            // In development mode, sync the database models
            if (env_1.ENV.NODE_ENV === 'development') {
                yield models_1.default.sync({ alter: true });
                console.log('Database synced successfully');
                // Seed the database with initial data
                yield (0, seedData_1.seedDatabase)();
            }
            else {
                // In production, just authenticate to check the connection
                yield models_1.default.authenticate();
                console.log('Database connection established successfully');
            }
            // If we get here, the connection was successful
            break;
        }
        catch (error) {
            retries -= 1;
            console.error(`Unable to connect to the database. Retries left: ${retries}`);
            if (retries === 0) {
                console.error('Database connection failed after multiple attempts:', error);
                // Continue without database instead of exiting
                console.warn('Continuing without database - only basic question answering will be available');
                return false;
            }
            // Wait for 5 seconds before retrying
            yield new Promise(resolve => setTimeout(resolve, 5000));
        }
    }
    return true;
});
// Add a simple status check route
app.get('/api/status', (req, res) => {
    try {
        res.json({ status: 'OK', message: 'Server is running', timestamp: new Date() });
    }
    catch (error) {
        console.error('Error in status route:', error);
        res.status(500).json({ status: 'ERROR', message: 'Server error', timestamp: new Date() });
    }
});
// Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api', questionRoutes_1.default);
app.use('/api', topicRoutes_1.default);
app.use('/api', gameMechanicsRoutes_1.default);
// Error handling middleware
app.use(errorHandler_1.default);
// Start server
const PORT = env_1.ENV.PORT || 3000;
// Initialize database and start server
try {
    // Attempt to initialize database but don't wait for it
    initializeDatabase().then(() => {
        console.log('Database initialized successfully');
    }).catch(err => {
        console.error('Database initialization error (server will continue):', err);
    });
    // Start the server immediately regardless of database status
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT} (AI features will still work)`);
    });
}
catch (err) {
    console.error('Unexpected error during startup:', err);
    // Start server even if there was an error
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT} (in recovery mode)`);
    });
}
// Keep the process running and handle graceful shutdowns
process.on('SIGINT', () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Server shutting down');
    try {
        yield models_1.default.close();
        console.log('Database connection closed');
        process.exit(0);
    }
    catch (error) {
        console.error('Error during shutdown:', error);
        process.exit(1);
    }
}));
