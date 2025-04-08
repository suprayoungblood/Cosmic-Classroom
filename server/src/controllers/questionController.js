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
exports.getQuestionHistory = exports.askAuthenticatedQuestion = exports.askQuestion = void 0;
const openaiService_1 = __importDefault(require("../services/openaiService"));
const QuestionHistory_1 = require("../models/QuestionHistory");
const GameMechanicsService_1 = __importDefault(require("../services/GameMechanicsService"));
const askQuestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Received question request:', req.body);
        const { question } = req.body;
        if (!question) {
            return res.status(400).json({ message: 'Question is required' });
        }
        try {
            const answer = yield openaiService_1.default.getAnswerForQuestion(question);
            console.log('Answer generated successfully');
            res.json({ answer });
        }
        catch (aiError) {
            console.error('AI service error:', aiError);
            // Return 200 status with fallback answer instead of 500 error
            res.json({
                message: 'Error processing your question',
                answer: 'I apologize, but I am having trouble connecting to our space knowledge database. The universe is vast and contains billions of galaxies, each with billions of stars. Our solar system orbits a star called the Sun, which is one of countless stars in the Milky Way galaxy.',
                error: (aiError === null || aiError === void 0 ? void 0 : aiError.message) || 'Unknown error'
            });
        }
    }
    catch (error) {
        console.error('Error in askQuestion controller:', error);
        // Return 200 status with fallback answer instead of 500 error
        res.json({
            message: 'Error processing your question',
            answer: 'I apologize, but I am having trouble processing your question. Space exploration has revealed fascinating details about our cosmic neighborhood. The James Webb Space Telescope is currently providing unprecedented views of distant galaxies and planetary systems.',
            error: (error === null || error === void 0 ? void 0 : error.message) || 'Unknown error'
        });
    }
});
exports.askQuestion = askQuestion;
// Protected version - only for authenticated users
const askAuthenticatedQuestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Received authenticated question request');
        // User is already authenticated via middleware
        const { question, topic } = req.body;
        const user = req.user;
        if (!question) {
            return res.status(400).json({ message: 'Question is required' });
        }
        try {
            const answer = yield openaiService_1.default.getAnswerForQuestion(question);
            console.log('Answer generated successfully for authenticated user');
            try {
                // Save the question and answer to the user's history
                yield QuestionHistory_1.QuestionHistory.create(Object.assign({ userId: user.id, question,
                    answer }, (topic ? { topic } : {})));
                // Update game mechanics - record question asked
                yield GameMechanicsService_1.default.recordQuestion(user.id, question, topic);
                // If topic is provided, record topic exploration too
                if (topic) {
                    yield GameMechanicsService_1.default.recordTopicExploration(user.id, topic);
                }
                // Get updated game data to return to client
                const gameProfile = yield GameMechanicsService_1.default.getUserGameProfile(user.id);
                res.json({
                    answer,
                    gameData: {
                        xp: gameProfile.xp,
                        level: gameProfile.level,
                        levelProgress: gameProfile.levelProgress,
                        questionsAsked: gameProfile.questionsAsked,
                        dailyStreak: gameProfile.dailyStreak,
                        newBadges: gameProfile.earnedBadges.filter((b) => b.isNew)
                    }
                });
            }
            catch (dbError) {
                // Still return the answer if database operations fail
                console.error('Database error in askAuthenticatedQuestion:', dbError);
                res.json({
                    answer,
                    gameData: null,
                    message: 'Answer provided but user data could not be updated',
                    error: (dbError === null || dbError === void 0 ? void 0 : dbError.message) || 'Unknown database error'
                });
            }
        }
        catch (aiError) {
            console.error('AI service error in askAuthenticatedQuestion:', aiError);
            // Return 200 status with fallback answer instead of 500 error
            res.json({
                message: 'Error processing your question',
                answer: 'I apologize, but I am having trouble connecting to our space knowledge database. The universe is vast and contains billions of galaxies, each with billions of stars. Our solar system orbits a star called the Sun, which is one of countless stars in the Milky Way galaxy.',
                gameData: null,
                error: (aiError === null || aiError === void 0 ? void 0 : aiError.message) || 'Unknown AI service error'
            });
        }
    }
    catch (error) {
        console.error('Error in askAuthenticatedQuestion controller:', error);
        // Return 200 status with fallback answer instead of 500 error
        res.json({
            message: 'Error processing your question',
            answer: 'I apologize, but I am having trouble processing your question. Space exploration has revealed fascinating details about our cosmic neighborhood. The James Webb Space Telescope is currently providing unprecedented views of distant galaxies and planetary systems.',
            gameData: null,
            error: (error === null || error === void 0 ? void 0 : error.message) || 'Unknown controller error'
        });
    }
});
exports.askAuthenticatedQuestion = askAuthenticatedQuestion;
// Get user's question history
const getQuestionHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const history = yield QuestionHistory_1.QuestionHistory.findAll({
            where: { userId: user.id },
            order: [['createdAt', 'DESC']],
            limit: 20
        });
        res.json(history);
    }
    catch (error) {
        console.error('Error fetching question history:', error);
        res.status(500).json({ message: 'Error fetching question history' });
    }
});
exports.getQuestionHistory = getQuestionHistory;
