import { Request, Response } from 'express';
import gameMechanicsService from '../services/GameMechanicsService';

class GameMechanicsController {
  /**
   * Get user's game profile
   */
  async getUserGameProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const profile = await gameMechanicsService.getUserGameProfile(userId);
      return res.status(200).json(profile);
    } catch (error) {
      console.error('Error getting game profile:', error);
      return res.status(500).json({ message: 'Failed to get game profile' });
    }
  }

  /**
   * Get user's badges
   */
  async getUserBadges(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const badges = await gameMechanicsService.getUserBadges(userId);
      return res.status(200).json(badges);
    } catch (error) {
      console.error('Error getting user badges:', error);
      return res.status(500).json({ message: 'Failed to get badges' });
    }
  }

  /**
   * Get user's challenges
   */
  async getUserChallenges(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const challenges = await gameMechanicsService.getUserChallenges(userId);
      return res.status(200).json(challenges);
    } catch (error) {
      console.error('Error getting user challenges:', error);
      return res.status(500).json({ message: 'Failed to get challenges' });
    }
  }

  /**
   * Update user's daily streak
   */
  async updateDailyStreak(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const streak = await gameMechanicsService.updateDailyStreak(userId);
      return res.status(200).json({ streak });
    } catch (error) {
      console.error('Error updating daily streak:', error);
      return res.status(500).json({ message: 'Failed to update streak' });
    }
  }

  /**
   * Record a topic exploration
   */
  async recordTopicExploration(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const { topic } = req.body;
      if (!topic) {
        return res.status(400).json({ message: 'Topic is required' });
      }

      await gameMechanicsService.recordTopicExploration(userId, topic);
      return res.status(200).json({ message: 'Topic exploration recorded' });
    } catch (error) {
      console.error('Error recording topic exploration:', error);
      return res.status(500).json({ message: 'Failed to record topic exploration' });
    }
  }
}

export default new GameMechanicsController();