"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const questionController_1 = require("../controllers/questionController");
const authMiddleware_1 = require("../middlewares/auth/authMiddleware");
const router = express_1.default.Router();
// Public route - available to all users (limited via rate limiter)
router.post('/ask', questionController_1.askQuestion);
// Protected routes with fallback for authenticated users
router.post('/ask/authenticated', (req, res) => {
    try {
        (0, authMiddleware_1.authenticate)(req, res, () => {
            try {
                (0, questionController_1.askAuthenticatedQuestion)(req, res);
            }
            catch (error) {
                console.error('Error in authenticated question route:', error);
                // Fall back to regular question handler
                (0, questionController_1.askQuestion)(req, res);
            }
        });
    }
    catch (error) {
        console.error('Authentication error in question route:', error);
        // Fall back to regular question handler if authentication fails
        (0, questionController_1.askQuestion)(req, res);
    }
});
// Question history - requires authentication
router.get('/questions/history', authMiddleware_1.authenticate, questionController_1.getQuestionHistory);
exports.default = router;
