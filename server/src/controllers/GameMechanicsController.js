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
const GameMechanicsService_1 = __importDefault(require("../services/GameMechanicsService"));
class GameMechanicsController {
    /**
     * Get user's game profile
     */
    getUserGameProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    return res.status(401).json({ message: 'Unauthorized' });
                }
                const profile = yield GameMechanicsService_1.default.getUserGameProfile(userId);
                return res.status(200).json(profile);
            }
            catch (error) {
                console.error('Error getting game profile:', error);
                return res.status(500).json({ message: 'Failed to get game profile' });
            }
        });
    }
    /**
     * Get user's badges
     */
    getUserBadges(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    return res.status(401).json({ message: 'Unauthorized' });
                }
                const badges = yield GameMechanicsService_1.default.getUserBadges(userId);
                return res.status(200).json(badges);
            }
            catch (error) {
                console.error('Error getting user badges:', error);
                return res.status(500).json({ message: 'Failed to get badges' });
            }
        });
    }
    /**
     * Get user's challenges
     */
    getUserChallenges(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    return res.status(401).json({ message: 'Unauthorized' });
                }
                const challenges = yield GameMechanicsService_1.default.getUserChallenges(userId);
                return res.status(200).json(challenges);
            }
            catch (error) {
                console.error('Error getting user challenges:', error);
                return res.status(500).json({ message: 'Failed to get challenges' });
            }
        });
    }
    /**
     * Update user's daily streak
     */
    updateDailyStreak(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    return res.status(401).json({ message: 'Unauthorized' });
                }
                const streak = yield GameMechanicsService_1.default.updateDailyStreak(userId);
                return res.status(200).json({ streak });
            }
            catch (error) {
                console.error('Error updating daily streak:', error);
                return res.status(500).json({ message: 'Failed to update streak' });
            }
        });
    }
    /**
     * Record a topic exploration
     */
    recordTopicExploration(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    return res.status(401).json({ message: 'Unauthorized' });
                }
                const { topic } = req.body;
                if (!topic) {
                    return res.status(400).json({ message: 'Topic is required' });
                }
                yield GameMechanicsService_1.default.recordTopicExploration(userId, topic);
                return res.status(200).json({ message: 'Topic exploration recorded' });
            }
            catch (error) {
                console.error('Error recording topic exploration:', error);
                return res.status(500).json({ message: 'Failed to record topic exploration' });
            }
        });
    }
}
exports.default = new GameMechanicsController();
