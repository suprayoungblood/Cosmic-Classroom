import express from 'express';
import rateLimit from 'express-rate-limit';
import { ENV } from './config/env';
import sequelize from './models';
import questionRoutes from './routes/questionRoutes';
import topicRoutes from './routes/topicRoutes';
import authRoutes from './routes/auth/authRoutes';
import gameMechanicsRoutes from './routes/gameMechanicsRoutes';
import errorHandler from './middlewares/errorHandler';
import corsMiddleware from './middlewares/corsMiddleware';
import path from 'path';

// Initialize Express app
const app = express();

// Enable CORS with custom options
app.use(corsMiddleware);

// JSON parsing middleware
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Import the seed function
import { seedDatabase } from './seeders/seedData';

// Initialize database connection with retry logic
const initializeDatabase = async () => {
  let retries = 5;
  while (retries) {
    try {
      // In development mode, sync the database models
      if (ENV.NODE_ENV === 'development') {
        await sequelize.sync({ alter: true });
        console.log('Database synced successfully');
        
        // Seed the database with initial data
        await seedDatabase();
      } else {
        // In production, just authenticate to check the connection
        await sequelize.authenticate();
        console.log('Database connection established successfully');
      }
      
      // If we get here, the connection was successful
      break;
    } catch (error) {
      retries -= 1;
      console.error(`Unable to connect to the database. Retries left: ${retries}`);
      if (retries === 0) {
        console.error('Database connection failed after multiple attempts:', error);
        // Continue without database instead of exiting
        console.warn('Continuing without database - only basic question answering will be available');
        return false;
      }
      // Wait for 5 seconds before retrying
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
  return true;
};

// Add a simple status check route
app.get('/api/status', (req, res) => {
  try {
    res.json({ status: 'OK', message: 'Server is running', timestamp: new Date() });
  } catch (error) {
    console.error('Error in status route:', error);
    res.status(500).json({ status: 'ERROR', message: 'Server error', timestamp: new Date() });
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', questionRoutes);
app.use('/api', topicRoutes);
app.use('/api', gameMechanicsRoutes);

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = ENV.PORT || 3000;

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
} catch (err) {
  console.error('Unexpected error during startup:', err);
  // Start server even if there was an error
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} (in recovery mode)`);
  });
}

// Keep the process running and handle graceful shutdowns
process.on('SIGINT', async () => {
  console.log('Server shutting down');
  try {
    await sequelize.close();
    console.log('Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
});