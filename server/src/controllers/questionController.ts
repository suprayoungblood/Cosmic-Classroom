import { Request, Response } from 'express';
import openaiService from '../services/openaiService';
import { QuestionHistory } from '../models/QuestionHistory';
import { User } from '../models/User';
import gameMechanicsService from '../services/GameMechanicsService';

export const askQuestion = async (req: Request, res: Response) => {
  try {
    console.log('Received question request:', req.body);
    const { question } = req.body;
    
    if (!question) {
      return res.status(400).json({ message: 'Question is required' });
    }
    
    try {
      const answer = await openaiService.getAnswerForQuestion(question);
      console.log('Answer generated successfully');
      res.json({ answer });
    } catch (aiError: any) {
      console.error('AI service error:', aiError);
      // Return 200 status with fallback answer instead of 500 error
      res.json({ 
        message: 'Error processing your question',
        answer: 'I apologize, but I am having trouble connecting to our space knowledge database. The universe is vast and contains billions of galaxies, each with billions of stars. Our solar system orbits a star called the Sun, which is one of countless stars in the Milky Way galaxy.',
        error: aiError?.message || 'Unknown error'
      });
    }
  } catch (error: any) {
    console.error('Error in askQuestion controller:', error);
    // Return 200 status with fallback answer instead of 500 error
    res.json({ 
      message: 'Error processing your question',
      answer: 'I apologize, but I am having trouble processing your question. Space exploration has revealed fascinating details about our cosmic neighborhood. The James Webb Space Telescope is currently providing unprecedented views of distant galaxies and planetary systems.',
      error: error?.message || 'Unknown error'
    });
  }
};

// Protected version - only for authenticated users
export const askAuthenticatedQuestion = async (req: Request, res: Response) => {
  try {
    console.log('Received authenticated question request');
    // User is already authenticated via middleware
    const { question, topic } = req.body;
    const user = req.user as User;
    
    if (!question) {
      return res.status(400).json({ message: 'Question is required' });
    }
    
    try {
      const answer = await openaiService.getAnswerForQuestion(question);
      console.log('Answer generated successfully for authenticated user');
      
      try {
        // Save the question and answer to the user's history
        await QuestionHistory.create({
          userId: user.id,
          question,
          answer,
          ...(topic ? { topic } : {})
        });
        
        // Update game mechanics - record question asked
        await gameMechanicsService.recordQuestion(user.id, question, topic);
        
        // If topic is provided, record topic exploration too
        if (topic) {
          await gameMechanicsService.recordTopicExploration(user.id, topic);
        }
        
        // Get updated game data to return to client
        const gameProfile = await gameMechanicsService.getUserGameProfile(user.id);
        
        res.json({ 
          answer,
          gameData: {
            xp: gameProfile.xp,
            level: gameProfile.level,
            levelProgress: gameProfile.levelProgress,
            questionsAsked: gameProfile.questionsAsked,
            dailyStreak: gameProfile.dailyStreak,
            newBadges: gameProfile.earnedBadges.filter((b: {isNew: boolean}) => b.isNew)
          }
        });
      } catch (dbError: any) {
        // Still return the answer if database operations fail
        console.error('Database error in askAuthenticatedQuestion:', dbError);
        res.json({ 
          answer,
          gameData: null,
          message: 'Answer provided but user data could not be updated',
          error: dbError?.message || 'Unknown database error'
        });
      }
    } catch (aiError: any) {
      console.error('AI service error in askAuthenticatedQuestion:', aiError);
      // Return 200 status with fallback answer instead of 500 error
      res.json({ 
        message: 'Error processing your question',
        answer: 'I apologize, but I am having trouble connecting to our space knowledge database. The universe is vast and contains billions of galaxies, each with billions of stars. Our solar system orbits a star called the Sun, which is one of countless stars in the Milky Way galaxy.',
        gameData: null,
        error: aiError?.message || 'Unknown AI service error'
      });
    }
  } catch (error: any) {
    console.error('Error in askAuthenticatedQuestion controller:', error);
    // Return 200 status with fallback answer instead of 500 error
    res.json({ 
      message: 'Error processing your question', 
      answer: 'I apologize, but I am having trouble processing your question. Space exploration has revealed fascinating details about our cosmic neighborhood. The James Webb Space Telescope is currently providing unprecedented views of distant galaxies and planetary systems.',
      gameData: null,
      error: error?.message || 'Unknown controller error'
    });
  }
};

// Get user's question history
export const getQuestionHistory = async (req: Request, res: Response) => {
  try {
    const user = req.user as User;
    
    const history = await QuestionHistory.findAll({
      where: { userId: user.id },
      order: [['createdAt', 'DESC']],
      limit: 20
    });
      
    res.json(history);
  } catch (error) {
    console.error('Error fetching question history:', error);
    res.status(500).json({ message: 'Error fetching question history' });
  }
};