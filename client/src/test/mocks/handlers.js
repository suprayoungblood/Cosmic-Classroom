import { http, HttpResponse } from 'msw';

export const handlers = [
  // Auth endpoints
  http.post('/api/auth/register', async ({ request }) => {
    const body = await request.json();
    
    if (body.email === 'existing@example.com') {
      return HttpResponse.json(
        { message: 'User already exists' },
        { status: 400 }
      );
    }

    return HttpResponse.json({
      message: 'User registered successfully',
      user: {
        id: 1,
        username: body.username,
        email: body.email,
        role: body.role || 'student',
      },
      token: 'mock-jwt-token',
    }, { status: 201 });
  }),

  http.post('/api/auth/login', async ({ request }) => {
    const body = await request.json();

    if (body.email === 'demo' && body.password === 'demo') {
      return HttpResponse.json({
        message: 'Demo login successful',
        user: {
          id: 'demo-user',
          username: 'Demo User',
          email: 'demo@cosmicclassroom.com',
          role: 'student',
          isDemo: true,
        },
        token: 'demo-jwt-token',
      });
    }

    if (body.email === 'test@example.com' && body.password === 'Password123!') {
      return HttpResponse.json({
        message: 'Login successful',
        user: {
          id: 1,
          username: 'testuser',
          email: 'test@example.com',
          role: 'student',
        },
        token: 'mock-jwt-token',
      });
    }

    return HttpResponse.json(
      { message: 'Invalid email or password' },
      { status: 401 }
    );
  }),

  http.get('/api/auth/profile', ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json(
        { message: 'No token, authorization denied' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    if (token === 'demo-jwt-token') {
      return HttpResponse.json({
        user: {
          id: 'demo-user',
          username: 'Demo User',
          email: 'demo@cosmicclassroom.com',
          role: 'student',
          isDemo: true,
          experience: 0,
          level: 1,
          badges: ['New Explorer'],
          dailyStreak: 1,
        },
      });
    }

    if (token === 'mock-jwt-token') {
      return HttpResponse.json({
        user: {
          id: 1,
          username: 'testuser',
          email: 'test@example.com',
          role: 'student',
          experience: 150,
          level: 2,
          badges: ['First Question', 'Curious Mind'],
          dailyStreak: 5,
        },
      });
    }

    return HttpResponse.json(
      { message: 'Token is not valid' },
      { status: 401 }
    );
  }),

  // Question endpoints
  http.post('/api/questions/ask', async ({ request }) => {
    const body = await request.json();
    const authHeader = request.headers.get('Authorization');

    const response = {
      answer: `This is a mock answer about ${body.question}. In the context of ${body.topic}, this is an educational response.`,
      questionId: Math.floor(Math.random() * 1000),
    };

    if (authHeader && authHeader.includes('mock-jwt-token')) {
      response.xpEarned = 15;
      response.newLevel = 2;
      response.leveledUp = false;
      response.newBadges = [];
      response.totalXP = 165;
      response.dailyStreak = 5;
    }

    return HttpResponse.json(response);
  }),

  http.get('/api/questions/history', ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json(
        { message: 'No token, authorization denied' },
        { status: 401 }
      );
    }

    return HttpResponse.json({
      questions: [
        {
          id: 1,
          question: 'What is React?',
          answer: 'React is a JavaScript library for building user interfaces.',
          topic: 'technology',
          createdAt: new Date().toISOString(),
        },
        {
          id: 2,
          question: 'What is quantum computing?',
          answer: 'Quantum computing is a type of computation that uses quantum-mechanical phenomena.',
          topic: 'science',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
      ],
      total: 2,
    });
  }),

  // Game mechanics endpoints
  http.get('/api/game/challenges', ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json(
        { message: 'No token, authorization denied' },
        { status: 401 }
      );
    }

    return HttpResponse.json({
      challenges: [
        {
          id: 'daily-explorer',
          title: 'Daily Explorer',
          description: 'Ask 5 questions today',
          xpReward: 50,
          progress: 2,
          target: 5,
          completed: false,
        },
        {
          id: 'subject-specialist',
          title: 'Subject Specialist',
          description: 'Ask 3 science questions',
          xpReward: 30,
          progress: 1,
          target: 3,
          completed: false,
        },
      ],
    });
  }),

  http.get('/api/game/leaderboard', () => {
    return HttpResponse.json({
      leaderboard: [
        {
          id: 1,
          username: 'TopStudent',
          experience: 5000,
          level: 10,
          badges: ['First Question', 'Curious Mind', 'Knowledge Seeker', 'Week Warrior'],
        },
        {
          id: 2,
          username: 'SmartLearner',
          experience: 3500,
          level: 8,
          badges: ['First Question', 'Curious Mind', 'Week Warrior'],
        },
        {
          id: 3,
          username: 'testuser',
          experience: 150,
          level: 2,
          badges: ['First Question', 'Curious Mind'],
        },
      ],
    });
  }),

  // Topics endpoint
  http.get('/api/topics', () => {
    return HttpResponse.json({
      topics: [
        { id: 'science', name: 'Science', icon: '🔬' },
        { id: 'technology', name: 'Technology', icon: '💻' },
        { id: 'engineering', name: 'Engineering', icon: '⚙️' },
        { id: 'mathematics', name: 'Mathematics', icon: '🔢' },
        { id: 'space', name: 'Space', icon: '🚀' },
      ],
    });
  }),
];