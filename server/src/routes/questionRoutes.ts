import express from 'express';
import { 
  askQuestion, 
  askAuthenticatedQuestion, 
  getQuestionHistory 
} from '../controllers/questionController';
import { authenticate } from '../middlewares/auth/authMiddleware';

const router = express.Router();

// Public route - available to all users (limited via rate limiter)
router.post('/ask', askQuestion);

// Protected routes with fallback for authenticated users
router.post('/ask/authenticated', (req, res) => {
  try {
    authenticate(req, res, () => {
      try {
        askAuthenticatedQuestion(req, res);
      } catch (error) {
        console.error('Error in authenticated question route:', error);
        // Fall back to regular question handler
        askQuestion(req, res);
      }
    });
  } catch (error) {
    console.error('Authentication error in question route:', error);
    // Fall back to regular question handler if authentication fails
    askQuestion(req, res);
  }
});

// Question history - requires authentication
router.get('/questions/history', authenticate, getQuestionHistory);

export default router;