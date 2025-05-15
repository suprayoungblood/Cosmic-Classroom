import { Router } from 'express';
import gameMechanicsController from '../controllers/GameMechanicsController';
import { authenticate } from '../middlewares/auth/authMiddleware';

const router = Router();

// Get user's game profile with fallback and rate limiting
const profileRequestCounts = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minute in milliseconds  
const RATE_LIMIT_MAX = 10; // Maximum requests per minute

router.get('/game/profile', (req, res) => {
  // Get client IP for rate limiting
  const clientIp = req.ip || 'unknown';
  
  // Check rate limit
  const now = Date.now();
  const clientRequests = profileRequestCounts.get(clientIp) || [];
  
  // Filter out requests older than the window
  const recentRequests = clientRequests.filter(timestamp => now - timestamp < RATE_LIMIT_WINDOW);
  
  // If too many requests, send 429 Too Many Requests
  if (recentRequests.length >= RATE_LIMIT_MAX) {
    console.warn(`Rate limit exceeded for ${clientIp}`);
    return res.status(429).send('Too many requests, please try again later.');
  }
  
  // Update request count
  profileRequestCounts.set(clientIp, [...recentRequests, now]);
  
  try {
    // First try with authentication
    authenticate(req, res, () => {
      try {
        gameMechanicsController.getUserGameProfile(req, res);
      } catch (error) {
        console.error('Error in game profile route:', error);
        // Return fallback data
        res.json({
          level: 'Explorer',
          xp: 1200,
          levelProgress: 20,
          dailyStreak: 1,
          questionsAsked: 5,
          topicsExplored: 3,
          badges: [
            { id: 'first_question', name: 'First Contact', icon: '🚀', description: 'Asked your first space question', earned: true },
            { id: 'planets_expert', name: 'Planetary Pioneer', icon: '🪐', description: 'Expert in planetary knowledge', earned: true }
          ],
          earnedBadges: [
            { id: 'first_question', name: 'First Contact', icon: '🚀', description: 'Asked your first space question', earned: true }
          ],
          nextLevel: 'Voyager',
          xpToNextLevel: 1200
        });
      }
    });
  } catch (error) {
    console.error('Authentication error in game profile route:', error);
    // Return fallback data
    res.json({
      level: 'Explorer',
      xp: 1200,
      levelProgress: 20,
      dailyStreak: 1,
      questionsAsked: 5,
      topicsExplored: 3,
      badges: [
        { id: 'first_question', name: 'First Contact', icon: '🚀', description: 'Asked your first space question', earned: true },
        { id: 'planets_expert', name: 'Planetary Pioneer', icon: '🪐', description: 'Expert in planetary knowledge', earned: true }
      ],
      earnedBadges: [
        { id: 'first_question', name: 'First Contact', icon: '🚀', description: 'Asked your first space question', earned: true }
      ],
      nextLevel: 'Voyager',
      xpToNextLevel: 1200
    });
  }
});

// Update user's daily streak with fallback
router.post('/game/streak', (req, res) => {
  try {
    authenticate(req, res, () => {
      try {
        gameMechanicsController.updateDailyStreak(req, res);
      } catch (error) {
        console.error('Error in streak route:', error);
        // Return fallback data
        res.json({ streak: 1 });
      }
    });
  } catch (error) {
    console.error('Authentication error in streak route:', error);
    // Return fallback data
    res.json({ streak: 1 });
  }
});

// Routes for authenticated users - with traditional auth middleware
router.use(authenticate);

// Get user's badges
router.get('/game/badges', gameMechanicsController.getUserBadges);

// Get user's challenges
router.get('/game/challenges', gameMechanicsController.getUserChallenges);

// Record topic exploration
router.post('/game/explore', gameMechanicsController.recordTopicExploration);

export default router;