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
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../models/User");
class GameMechanicsService {
    constructor() {
        // Level thresholds for XP
        // Define type for the level thresholds
        this.levelThresholds = {
            'Novice': { min: 0, max: 999, stars: 1 },
            'Explorer': { min: 1000, max: 2399, stars: 2 },
            'Voyager': { min: 2400, max: 3999, stars: 3 },
            'Astronomer': { min: 4000, max: 5999, stars: 4 },
            'Scientist': { min: 6000, max: 8499, stars: 5 },
            'Astrophysicist': { min: 8500, max: 11999, stars: 6 },
            'Cosmic Master': { min: 12000, max: Infinity, stars: 7 }
        };
        // Predefined challenges
        this.challenges = [
            {
                id: 101,
                title: 'First Contact',
                description: 'Ask your first space question',
                reward: 100,
                type: 'achievement',
                criteria: { type: 'questions', count: 1 }
            },
            {
                id: 102,
                title: 'Question Enthusiast',
                description: 'Ask 10 questions about space',
                reward: 200,
                type: 'achievement',
                criteria: { type: 'questions', count: 10 }
            },
            {
                id: 103,
                title: 'Dedicated Explorer',
                description: 'Log in for 7 consecutive days',
                reward: 350,
                type: 'achievement',
                criteria: { type: 'streak', count: 7 }
            },
            {
                id: 104,
                title: 'Knowledge Seeker',
                description: 'Explore 5 different space topics',
                reward: 250,
                type: 'achievement',
                criteria: { type: 'topics', count: 5 }
            },
            {
                id: 201,
                title: 'Daily Questions',
                description: 'Ask 3 questions today',
                reward: 90,
                type: 'daily',
                criteria: { type: 'questions', count: 3 }
            },
            {
                id: 202,
                title: 'New Topic Explorer',
                description: 'Explore a new space topic today',
                reward: 120,
                type: 'daily',
                criteria: { type: 'topics', count: 1 }
            },
            {
                id: 301,
                title: 'Weekly Dedication',
                description: 'Log in for 5 days this week',
                reward: 300,
                type: 'weekly',
                criteria: { type: 'login', count: 5 }
            },
            {
                id: 302,
                title: 'Deep Dive',
                description: 'Ask 15 questions this week',
                reward: 400,
                type: 'weekly',
                criteria: { type: 'questions', count: 15 }
            }
        ];
        // Badge definitions
        this.badges = [
            { id: 'first_question', name: 'First Contact', icon: '🚀', description: 'Asked your first space question' },
            { id: 'planets_expert', name: 'Planetary Pioneer', icon: '🪐', description: 'Expert in planetary knowledge' },
            { id: 'black_holes', name: 'Deep Space Explorer', icon: '🌌', description: 'Explored black hole questions' },
            { id: 'stars', name: 'Star Gazer', icon: '⭐', description: 'Unlocked stellar information' },
            { id: 'learning_modules', name: 'Cosmic Scholar', icon: '📚', description: 'Completed 5 learning modules' },
            { id: 'question_master', name: 'Question Master', icon: '❓', description: 'Asked 50+ questions' },
            { id: 'streak_7', name: 'Streak Champion', icon: '🔥', description: 'Maintained a 7-day learning streak' },
            { id: 'master', name: 'Galaxy Brain', icon: '🧠', description: 'Mastered cosmic knowledge' }
        ];
    }
    /**
     * Update user's daily streak
     * Resets streak if more than 24 hours since last update
     */
    updateDailyStreak(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.User.findByPk(userId);
            if (!user)
                throw new Error('User not found');
            const now = new Date();
            const lastUpdate = user.streakUpdatedAt || user.lastActive || user.createdAt;
            const hoursSinceLastUpdate = (now.getTime() - new Date(lastUpdate).getTime()) / (1000 * 60 * 60);
            // If more than 36 hours since last update, reset streak
            // This gives users a 12-hour grace period after their usual time
            if (hoursSinceLastUpdate > 36) {
                user.dailyStreak = 1; // Reset to 1 for today's login
            }
            // If between 18-36 hours, increment streak (normal daily login)
            else if (hoursSinceLastUpdate > 18) {
                user.dailyStreak += 1;
            }
            // If less than 18 hours, don't change streak (already logged in today)
            user.streakUpdatedAt = now;
            user.lastActive = now;
            yield user.save();
            // Check for streak-based achievements
            yield this.checkAndAwardBadges(userId);
            yield this.checkChallenges(userId);
            return user.dailyStreak;
        });
    }
    /**
     * Update user's question count and XP
     */
    recordQuestion(userId, questionText, topic) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.User.findByPk(userId);
            if (!user)
                throw new Error('User not found');
            // Update question count
            user.questionsAsked = (user.questionsAsked || 0) + 1;
            // Award XP for asking a question
            const questionXP = 30;
            user.xp = (user.xp || 0) + questionXP;
            // Check if this updates the user's level
            const newLevel = this.calculateLevel(user.xp);
            if (newLevel !== user.level) {
                user.level = newLevel;
            }
            user.lastActive = new Date();
            yield user.save();
            // Check for question-based challenges and badges
            yield this.checkAndAwardBadges(userId);
            yield this.checkChallenges(userId);
        });
    }
    /**
     * Record a topic exploration
     */
    recordTopicExploration(userId, topic) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.User.findByPk(userId);
            if (!user)
                throw new Error('User not found');
            // Update topics explored count
            user.topicsExplored = (user.topicsExplored || 0) + 1;
            // Award XP for exploring a topic
            const topicXP = 50;
            user.xp = (user.xp || 0) + topicXP;
            // If the user doesn't have this interest, add it
            if (user.interests && !user.interests.includes(topic)) {
                user.interests = [...user.interests, topic];
            }
            // Check if this updates the user's level
            const newLevel = this.calculateLevel(user.xp);
            if (newLevel !== user.level) {
                user.level = newLevel;
            }
            user.lastActive = new Date();
            yield user.save();
            // Check for topic-based challenges and badges
            yield this.checkAndAwardBadges(userId);
            yield this.checkChallenges(userId);
        });
    }
    /**
     * Award XP to a user
     */
    awardXP(userId, amount, reason) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.User.findByPk(userId);
            if (!user)
                throw new Error('User not found');
            user.xp = (user.xp || 0) + amount;
            // Check if this updates the user's level
            const newLevel = this.calculateLevel(user.xp);
            if (newLevel !== user.level) {
                user.level = newLevel;
            }
            yield user.save();
        });
    }
    /**
     * Calculate user level based on XP
     */
    calculateLevel(xp) {
        for (const [level, threshold] of Object.entries(this.levelThresholds)) {
            if (xp >= threshold.min && xp <= threshold.max) {
                return level;
            }
        }
        return 'Novice'; // Default fallback
    }
    /**
     * Get next level info
     */
    getNextLevelInfo(currentLevel) {
        const levels = Object.keys(this.levelThresholds);
        const currentIndex = levels.indexOf(currentLevel);
        if (currentIndex === -1 || currentIndex === levels.length - 1) {
            return null; // Either invalid level or already at max level
        }
        const nextLevel = levels[currentIndex + 1];
        // Safe lookup with type checking
        if (nextLevel && this.levelThresholds[nextLevel]) {
            return {
                name: nextLevel,
                xpRequired: this.levelThresholds[nextLevel].min
            };
        }
        return null;
    }
    /**
     * Check and award badges
     */
    checkAndAwardBadges(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.User.findByPk(userId);
            if (!user)
                throw new Error('User not found');
            const newBadges = [];
            const currentBadges = user.badges || [];
            // First question badge
            if (user.questionsAsked >= 1 && !currentBadges.includes('first_question')) {
                newBadges.push('first_question');
            }
            // Question master badge
            if (user.questionsAsked >= 50 && !currentBadges.includes('question_master')) {
                newBadges.push('question_master');
            }
            // Streak champion badge
            if (user.dailyStreak >= 7 && !currentBadges.includes('streak_7')) {
                newBadges.push('streak_7');
            }
            // Topic-based badges
            if (user.interests) {
                if (user.interests.some(i => i.toLowerCase().includes('planet')) && !currentBadges.includes('planets_expert')) {
                    newBadges.push('planets_expert');
                }
                if (user.interests.some(i => i.toLowerCase().includes('black hole')) && !currentBadges.includes('black_holes')) {
                    newBadges.push('black_holes');
                }
                if (user.interests.some(i => i.toLowerCase().includes('star')) && !currentBadges.includes('stars')) {
                    newBadges.push('stars');
                }
            }
            // Cosmic scholar badge
            if (user.topicsExplored >= 5 && !currentBadges.includes('learning_modules')) {
                newBadges.push('learning_modules');
            }
            // Master badge - requires high XP and multiple other badges
            if (user.xp >= 10000 && currentBadges.length >= 5 && !currentBadges.includes('master')) {
                newBadges.push('master');
            }
            // If there are new badges, award them and grant XP
            if (newBadges.length > 0) {
                user.badges = [...currentBadges, ...newBadges];
                // Award 200 XP per badge
                const badgeXP = newBadges.length * 200;
                user.xp = (user.xp || 0) + badgeXP;
                // Check if this updates the user's level
                const newLevel = this.calculateLevel(user.xp);
                if (newLevel !== user.level) {
                    user.level = newLevel;
                }
                yield user.save();
            }
            return newBadges;
        });
    }
    /**
     * Check and complete eligible challenges
     */
    checkChallenges(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.User.findByPk(userId);
            if (!user)
                throw new Error('User not found');
            const completedChallenges = user.completedChallenges || [];
            const newCompletedChallenges = [];
            for (const challenge of this.challenges) {
                // Skip already completed challenges
                if (completedChallenges.includes(challenge.id))
                    continue;
                let completed = false;
                // Check if challenge criteria are met
                switch (challenge.criteria.type) {
                    case 'questions':
                        completed = (user.questionsAsked || 0) >= challenge.criteria.count;
                        break;
                    case 'topics':
                        completed = (user.topicsExplored || 0) >= challenge.criteria.count;
                        break;
                    case 'streak':
                        completed = (user.dailyStreak || 0) >= challenge.criteria.count;
                        break;
                    case 'login':
                        // Weekly login challenges would need additional tracking logic
                        break;
                    case 'specific':
                        // Specific challenges like answering questions about a particular topic
                        if (challenge.criteria.specific && user.interests) {
                            completed = user.interests.includes(challenge.criteria.specific);
                        }
                        break;
                }
                if (completed) {
                    newCompletedChallenges.push(challenge);
                    completedChallenges.push(challenge.id);
                    // Award XP for completing the challenge
                    user.xp = (user.xp || 0) + challenge.reward;
                }
            }
            if (newCompletedChallenges.length > 0) {
                user.completedChallenges = completedChallenges;
                // Check if this updates the user's level
                const newLevel = this.calculateLevel(user.xp);
                if (newLevel !== user.level) {
                    user.level = newLevel;
                }
                yield user.save();
            }
            return newCompletedChallenges;
        });
    }
    /**
     * Get all challenges with progress for a user
     */
    getUserChallenges(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.User.findByPk(userId);
            if (!user)
                throw new Error('User not found');
            const completedChallenges = user.completedChallenges || [];
            return this.challenges.map(challenge => {
                let progress = 0;
                // Calculate progress based on criteria type
                switch (challenge.criteria.type) {
                    case 'questions':
                        progress = Math.min(user.questionsAsked || 0, challenge.criteria.count);
                        break;
                    case 'topics':
                        progress = Math.min(user.topicsExplored || 0, challenge.criteria.count);
                        break;
                    case 'streak':
                        progress = Math.min(user.dailyStreak || 0, challenge.criteria.count);
                        break;
                    case 'login':
                        // Would need additional tracking
                        progress = 0;
                        break;
                    case 'specific':
                        if (challenge.criteria.specific && user.interests) {
                            progress = user.interests.includes(challenge.criteria.specific) ? 1 : 0;
                        }
                        break;
                }
                return Object.assign(Object.assign({}, challenge), { progress, total: challenge.criteria.count, completed: completedChallenges.includes(challenge.id) });
            });
        });
    }
    /**
     * Get user badges with details
     */
    getUserBadges(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.User.findByPk(userId);
            if (!user)
                throw new Error('User not found');
            const userBadges = user.badges || [];
            return this.badges.map(badge => (Object.assign(Object.assign({}, badge), { earned: userBadges.includes(badge.id) })));
        });
    }
    /**
     * Get user's game profile
     */
    getUserGameProfile(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const user = yield User_1.User.findByPk(userId);
            if (!user)
                throw new Error('User not found');
            const nextLevel = this.getNextLevelInfo(user.level || 'Novice');
            const badges = yield this.getUserBadges(userId);
            const challenges = yield this.getUserChallenges(userId);
            // Group challenges by type
            const dailyChallenges = challenges.filter(c => c.type === 'daily');
            const weeklyChallenges = challenges.filter(c => c.type === 'weekly');
            const achievements = challenges.filter(c => c.type === 'achievement');
            // Calculate progress to next level
            let levelProgress = 100;
            if (nextLevel) {
                const levelKey = (user.level || 'Novice');
                const currentLevelMin = this.levelThresholds[levelKey].min;
                const xpInCurrentLevel = (user.xp || 0) - currentLevelMin;
                const xpRequiredForNextLevel = nextLevel.xpRequired - currentLevelMin;
                levelProgress = Math.min(100, Math.floor((xpInCurrentLevel / xpRequiredForNextLevel) * 100));
            }
            return {
                level: user.level || 'Novice',
                xp: user.xp || 0,
                nextLevel: nextLevel === null || nextLevel === void 0 ? void 0 : nextLevel.name,
                xpToNextLevel: nextLevel ? nextLevel.xpRequired - (user.xp || 0) : 0,
                levelProgress,
                dailyStreak: user.dailyStreak || 0,
                questionsAsked: user.questionsAsked || 0,
                topicsExplored: user.topicsExplored || 0,
                badges,
                earnedBadges: badges.filter(b => b.earned),
                challenges: {
                    daily: dailyChallenges,
                    weekly: weeklyChallenges,
                    achievements
                },
                stats: {
                    completedChallenges: ((_a = user.completedChallenges) === null || _a === void 0 ? void 0 : _a.length) || 0,
                    earnedBadges: badges.filter(b => b.earned).length
                }
            };
        });
    }
}
exports.default = new GameMechanicsService();
