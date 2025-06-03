import { GameMechanicsService } from '../../services/GameMechanicsService';
import { User } from '../../models';

jest.mock('../../models');

describe('GameMechanicsService', () => {
  let gameService: GameMechanicsService;
  let mockUser: any;

  beforeEach(() => {
    jest.clearAllMocks();
    gameService = new GameMechanicsService();
    
    mockUser = {
      id: 1,
      username: 'testuser',
      experience: 100,
      level: 1,
      badges: [],
      dailyStreak: 0,
      lastQuestionDate: null,
      questionsToday: 0,
      totalQuestionsAsked: 5,
      save: jest.fn().mockResolvedValue(true),
      update: jest.fn().mockResolvedValue(true)
    };
  });

  describe('calculateXPForQuestion', () => {
    it('should calculate base XP for a question', () => {
      const xp = gameService.calculateXPForQuestion('science', 'easy');
      expect(xp).toBe(10);
    });

    it('should calculate XP with difficulty bonus', () => {
      const xpMedium = gameService.calculateXPForQuestion('math', 'medium');
      expect(xpMedium).toBe(15);

      const xpHard = gameService.calculateXPForQuestion('science', 'hard');
      expect(xpHard).toBe(20);
    });

    it('should apply topic bonus for STEM subjects', () => {
      const xpScience = gameService.calculateXPForQuestion('science', 'easy');
      expect(xpScience).toBe(10);

      const xpTech = gameService.calculateXPForQuestion('technology', 'easy');
      expect(xpTech).toBe(10);

      const xpMath = gameService.calculateXPForQuestion('math', 'easy');
      expect(xpMath).toBe(10);
    });
  });

  describe('calculateLevel', () => {
    it('should calculate correct level based on XP', () => {
      expect(gameService.calculateLevel(0)).toBe(1);
      expect(gameService.calculateLevel(50)).toBe(1);
      expect(gameService.calculateLevel(100)).toBe(2);
      expect(gameService.calculateLevel(250)).toBe(3);
      expect(gameService.calculateLevel(500)).toBe(4);
      expect(gameService.calculateLevel(1000)).toBe(5);
    });
  });

  describe('checkAndAwardBadges', () => {
    it('should award First Question badge', async () => {
      mockUser.totalQuestionsAsked = 1;
      mockUser.badges = [];

      const badges = await gameService.checkAndAwardBadges(mockUser);

      expect(badges).toContain('First Question');
      expect(mockUser.badges).toContain('First Question');
    });

    it('should award Curious Mind badge for 10 questions', async () => {
      mockUser.totalQuestionsAsked = 10;
      mockUser.badges = [];

      const badges = await gameService.checkAndAwardBadges(mockUser);

      expect(badges).toContain('Curious Mind');
    });

    it('should award Knowledge Seeker badge for 50 questions', async () => {
      mockUser.totalQuestionsAsked = 50;
      mockUser.badges = [];

      const badges = await gameService.checkAndAwardBadges(mockUser);

      expect(badges).toContain('Knowledge Seeker');
    });

    it('should award Week Warrior badge for 7-day streak', async () => {
      mockUser.dailyStreak = 7;
      mockUser.badges = [];

      const badges = await gameService.checkAndAwardBadges(mockUser);

      expect(badges).toContain('Week Warrior');
    });

    it('should award Month Master badge for 30-day streak', async () => {
      mockUser.dailyStreak = 30;
      mockUser.badges = [];

      const badges = await gameService.checkAndAwardBadges(mockUser);

      expect(badges).toContain('Month Master');
    });

    it('should not award duplicate badges', async () => {
      mockUser.totalQuestionsAsked = 10;
      mockUser.badges = ['Curious Mind'];

      const badges = await gameService.checkAndAwardBadges(mockUser);

      expect(badges).toHaveLength(0);
      expect(mockUser.badges).toHaveLength(1);
    });

    it('should award multiple badges at once', async () => {
      mockUser.totalQuestionsAsked = 10;
      mockUser.dailyStreak = 7;
      mockUser.badges = [];

      const badges = await gameService.checkAndAwardBadges(mockUser);

      expect(badges).toContain('Curious Mind');
      expect(badges).toContain('Week Warrior');
      expect(badges).toHaveLength(2);
    });
  });

  describe('updateDailyStreak', () => {
    it('should start a new streak', async () => {
      mockUser.lastQuestionDate = null;
      mockUser.dailyStreak = 0;

      await gameService.updateDailyStreak(mockUser);

      expect(mockUser.dailyStreak).toBe(1);
      expect(mockUser.lastQuestionDate).toBeInstanceOf(Date);
    });

    it('should continue streak on consecutive days', async () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      mockUser.lastQuestionDate = yesterday;
      mockUser.dailyStreak = 5;

      await gameService.updateDailyStreak(mockUser);

      expect(mockUser.dailyStreak).toBe(6);
    });

    it('should not increment streak on same day', async () => {
      mockUser.lastQuestionDate = new Date();
      mockUser.dailyStreak = 5;

      await gameService.updateDailyStreak(mockUser);

      expect(mockUser.dailyStreak).toBe(5);
    });

    it('should reset streak after missing days', async () => {
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
      mockUser.lastQuestionDate = twoDaysAgo;
      mockUser.dailyStreak = 10;

      await gameService.updateDailyStreak(mockUser);

      expect(mockUser.dailyStreak).toBe(1);
    });
  });

  describe('processQuestionReward', () => {
    beforeEach(() => {
      (User.findByPk as jest.Mock).mockResolvedValue(mockUser);
    });

    it('should process complete question reward', async () => {
      const result = await gameService.processQuestionReward(1, 'science', 'medium');

      expect(User.findByPk).toHaveBeenCalledWith(1);
      expect(mockUser.experience).toBe(115); // 100 + 15 (medium difficulty)
      expect(mockUser.level).toBe(2);
      expect(mockUser.questionsToday).toBe(1);
      expect(mockUser.totalQuestionsAsked).toBe(6);
      expect(mockUser.dailyStreak).toBe(1);
      expect(mockUser.save).toHaveBeenCalled();

      expect(result).toEqual({
        xpEarned: 15,
        newLevel: 2,
        leveledUp: true,
        newBadges: expect.any(Array),
        totalXP: 115,
        dailyStreak: 1
      });
    });

    it('should handle user not found', async () => {
      (User.findByPk as jest.Mock).mockResolvedValue(null);

      await expect(gameService.processQuestionReward(999, 'math', 'easy'))
        .rejects.toThrow('User not found');
    });

    it('should not level up if XP threshold not met', async () => {
      mockUser.experience = 50;
      mockUser.level = 1;

      const result = await gameService.processQuestionReward(1, 'science', 'easy');

      expect(result.leveledUp).toBe(false);
      expect(result.newLevel).toBe(1);
      expect(mockUser.level).toBe(1);
    });
  });

  describe('getDailyChallenges', () => {
    it('should return daily challenges for a user', async () => {
      (User.findByPk as jest.Mock).mockResolvedValue(mockUser);

      const challenges = await gameService.getDailyChallenges(1);

      expect(challenges).toHaveLength(3);
      expect(challenges[0]).toHaveProperty('id');
      expect(challenges[0]).toHaveProperty('title');
      expect(challenges[0]).toHaveProperty('description');
      expect(challenges[0]).toHaveProperty('xpReward');
      expect(challenges[0]).toHaveProperty('progress');
      expect(challenges[0]).toHaveProperty('target');
      expect(challenges[0]).toHaveProperty('completed');
    });

    it('should track progress for question challenges', async () => {
      mockUser.questionsToday = 3;
      (User.findByPk as jest.Mock).mockResolvedValue(mockUser);

      const challenges = await gameService.getDailyChallenges(1);
      const questionChallenge = challenges.find(c => c.title === 'Daily Explorer');

      expect(questionChallenge?.progress).toBe(3);
      expect(questionChallenge?.completed).toBe(false);
    });

    it('should mark challenge as completed when target reached', async () => {
      mockUser.questionsToday = 5;
      (User.findByPk as jest.Mock).mockResolvedValue(mockUser);

      const challenges = await gameService.getDailyChallenges(1);
      const questionChallenge = challenges.find(c => c.title === 'Daily Explorer');

      expect(questionChallenge?.progress).toBe(5);
      expect(questionChallenge?.completed).toBe(true);
    });

    it('should handle user not found', async () => {
      (User.findByPk as jest.Mock).mockResolvedValue(null);

      await expect(gameService.getDailyChallenges(999))
        .rejects.toThrow('User not found');
    });
  });

  describe('getLeaderboard', () => {
    it('should return top 10 users by experience', async () => {
      const mockUsers = Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        username: `user${i + 1}`,
        experience: (10 - i) * 100,
        level: Math.floor((10 - i) / 2) + 1,
        badges: []
      }));

      (User.findAll as jest.Mock).mockResolvedValue(mockUsers);

      const leaderboard = await gameService.getLeaderboard();

      expect(User.findAll).toHaveBeenCalledWith({
        attributes: ['id', 'username', 'experience', 'level', 'badges'],
        order: [['experience', 'DESC']],
        limit: 10
      });

      expect(leaderboard).toHaveLength(10);
      expect(leaderboard[0].experience).toBe(1000);
      expect(leaderboard[9].experience).toBe(100);
    });

    it('should return empty array when no users exist', async () => {
      (User.findAll as jest.Mock).mockResolvedValue([]);

      const leaderboard = await gameService.getLeaderboard();

      expect(leaderboard).toHaveLength(0);
    });
  });
});