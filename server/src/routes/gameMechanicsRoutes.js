"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const GameMechanicsController_1 = __importDefault(require("../controllers/GameMechanicsController"));
const authMiddleware_1 = require("../middlewares/auth/authMiddleware");
const router = (0, express_1.Router)();
// Get user's game profile with fallback
router.get('/game/profile', (req, res) => {
    try {
        // First try with authentication
        (0, authMiddleware_1.authenticate)(req, res, () => {
            try {
                GameMechanicsController_1.default.getUserGameProfile(req, res);
            }
            catch (error) {
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
    }
    catch (error) {
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
        (0, authMiddleware_1.authenticate)(req, res, () => {
            try {
                GameMechanicsController_1.default.updateDailyStreak(req, res);
            }
            catch (error) {
                console.error('Error in streak route:', error);
                // Return fallback data
                res.json({ streak: 1 });
            }
        });
    }
    catch (error) {
        console.error('Authentication error in streak route:', error);
        // Return fallback data
        res.json({ streak: 1 });
    }
});
// Routes for authenticated users - with traditional auth middleware
router.use(authMiddleware_1.authenticate);
// Get user's badges
router.get('/game/badges', GameMechanicsController_1.default.getUserBadges);
// Get user's challenges
router.get('/game/challenges', GameMechanicsController_1.default.getUserChallenges);
// Record topic exploration
router.post('/game/explore', GameMechanicsController_1.default.recordTopicExploration);
exports.default = router;
