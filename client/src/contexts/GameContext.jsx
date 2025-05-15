import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import { getGameProfile, updateDailyStreak } from '../api/game';
import confetti from 'canvas-confetti';

// Create the game context
const GameContext = createContext(null);

// Custom hook to use the game context
export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}

export function GameProvider({ children }) {
  const { isAuthenticated, user } = useAuth();
  const [gameData, setGameData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newAchievements, setNewAchievements] = useState([]);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [xpAnimation, setXpAnimation] = useState({ show: false, amount: 0 });

  // Fetch game data when user logs in, with reduced frequency and enhanced rate limiting
  // Track if component is mounted to prevent state updates after unmount
  const isMountedRef = useRef(true);
  const requestCountRef = useRef(0);
  const maxRequestsPerMinute = 3; // Reduced max requests to avoid rate limiting
  const dataRefreshTimeoutRef = useRef(null);
  const lastRequestTimeRef = useRef(0); // Track time of last request

  useEffect(() => {
    // Set isMountedRef to true when component mounts
    isMountedRef.current = true;
    
    // Clean up function to prevent state updates after unmount
    return () => {
      isMountedRef.current = false;
      if (dataRefreshTimeoutRef.current) {
        clearTimeout(dataRefreshTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isAuthenticated && user) {
      // Reset request count periodically (every minute)
      const resetRequestCount = () => {
        requestCountRef.current = 0;
      };
      const resetInterval = setInterval(resetRequestCount, 60000);
      
      // Use a robust approach that prevents excessive API calls and manages state properly
      const loadGameData = async () => {
        try {
          // Only update state if component is still mounted
          if (isMountedRef.current) {
            setLoading(true);
            
            // Always set default data immediately to prevent UI flicker
            setDefaultGameData();
            
            // Check if demo mode is active - if so, skip API calls entirely
            if (localStorage.getItem('demo_mode') === 'true') {
              console.log('Demo mode active - using default game data without API calls');
              setLoading(false);
              return;
            }
            
            // Check if we're rate limited
            if (localStorage.getItem('is_rate_limited') === 'true') {
              console.log('Rate limiting in effect - using default data');
              setLoading(false);
              return;
            }
            
            // Check if we've made too many requests and delay if needed
            if (requestCountRef.current >= maxRequestsPerMinute) {
              console.log('Rate limiting ourselves to prevent 429 errors');
              setLoading(false);
              return;
            }
            
            // Count this request
            requestCountRef.current += 1;
            
            // Try to fetch game data (will use defaults internally if it fails)
            if (isMountedRef.current) {
              await fetchGameData();
            }
          }
        } catch (err) {
          console.error('Unexpected error in game data loading:', err);
          
          // Only update state if component is still mounted
          if (isMountedRef.current) {
            setDefaultGameData();
          }
        } finally {
          // Only update state if component is still mounted
          if (isMountedRef.current) {
            setLoading(false);
          }
        }
      };
      
      // Start the async process with a small delay to prevent immediate API call
      dataRefreshTimeoutRef.current = setTimeout(loadGameData, 2000);
      
      // Clean up on component unmount or when deps change
      return () => {
        clearInterval(resetInterval);
        if (dataRefreshTimeoutRef.current) {
          clearTimeout(dataRefreshTimeoutRef.current);
        }
      };
    } else {
      // Clear game data when user logs out
      setGameData(null);
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  // Set default game data for when API is unavailable
  const setDefaultGameData = () => {
    const defaultData = {
      level: 'Explorer',
      xp: 1200,
      levelProgress: 20,
      dailyStreak: 1,
      questionsAsked: 5,
      topicsExplored: 3,
      badges: [
        { 
          id: 1,
          name: "First Contact", 
          description: "Asked your first space question", 
          icon: "🚀", 
          earned: true,
          xp: 100
        },
        { 
          id: 2,
          name: "Deep Space Explorer", 
          description: "Explored black hole questions", 
          icon: "🌌", 
          earned: Math.random() > 0.5,
          xp: 250
        },
        { 
          id: 3,
          name: "Planetary Pioneer", 
          description: "Expert in planetary knowledge", 
          icon: "🪐", 
          earned: Math.random() > 0.3,
          xp: 250
        }
      ],
      nextLevel: 'Voyager',
      xpToNextLevel: 1200
    };
    
    setGameData(defaultData);
    setLoading(false);
  };

  const fetchGameData = async () => {
    try {
      setLoading(true);
      
      // Check if we're being rate limited
      if (localStorage.getItem('is_rate_limited') === 'true') {
        console.log('Currently rate limited, skipping API call and using default data');
        setDefaultGameData();
        return;
      }
      
      // If we've made too many API calls recently, use defaults instead
      if (requestCountRef.current > 2) {
        console.log(`Limiting API calls: ${requestCountRef.current} requests made recently`);
        setDefaultGameData();
        return;
      }
      
      // Enhanced rate limiting based on time between requests
      const now = Date.now();
      const timeSinceLastRequest = now - lastRequestTimeRef.current;
      const minTimeBetweenRequests = 15000; // Increased to 15 seconds to prevent rate limiting
      
      if (timeSinceLastRequest < minTimeBetweenRequests) {
        console.log(`Too soon for API call (${timeSinceLastRequest}ms), using default data`);
        setDefaultGameData();
        return;
      }
      
      // Set the timestamp of this request
      lastRequestTimeRef.current = Date.now();
      
      // Increment request counter
      requestCountRef.current += 1;
      
      // Only proceed if component is still mounted
      if (!isMountedRef.current) {
        console.log('Component unmounted during backoff, aborting request');
        return;
      }
      
      const data = await getGameProfile();
      
      // Only proceed if component is still mounted
      if (!isMountedRef.current) {
        console.log('Component unmounted after request, aborting state update');
        return;
      }
      
      if (!data) {
        console.warn('No data returned from API, using defaults');
        setDefaultGameData();
        return;
      }
      
      setGameData(data);
      
      // Check for any new achievements since last session
      checkNewAchievements(data);
    } catch (error) {
      console.error('Error fetching game data:', error);
      // Don't throw, just set default data
      if (isMountedRef.current) {
        setDefaultGameData();
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  };

  const updateUserStreak = async () => {
    try {
      // Add rate limiting with similar pattern to fetchGameData
      const now = Date.now();
      const timeSinceLastRequest = now - lastRequestTimeRef.current;
      const minTimeBetweenRequests = 5000; // 5 seconds minimum between different API requests
      
      if (timeSinceLastRequest < minTimeBetweenRequests) {
        const waitTime = minTimeBetweenRequests - timeSinceLastRequest;
        console.log(`Rate limiting streak update: waiting ${waitTime}ms`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
      
      // Update last request time
      lastRequestTimeRef.current = Date.now();
      
      // Check if component is still mounted before making request
      if (!isMountedRef.current) {
        console.log('Component unmounted before streak update, aborting');
        return;
      }
      
      // This won't throw due to internal handling in the API function
      const streak = await updateDailyStreak();
      
      // Update the streak in current game data if available
      if (isMountedRef.current && gameData && streak) {
        setGameData({
          ...gameData,
          dailyStreak: streak
        });
      }
    } catch (error) {
      // This should never execute due to error handling in updateDailyStreak
      console.error('Unexpected error in streak update:', error);
    }
  };

  const checkNewAchievements = (data) => {
    if (!data || !data.badges) {
      console.warn('No achievement data available to check');
      return;
    }
    
    // Get previously shown achievements from localStorage
    const shownAchievements = JSON.parse(localStorage.getItem('shownAchievements') || '[]');
    
    // Safely handle different data structures
    const earnedBadges = data.earnedBadges || data.badges || [];
    
    // Filter earned badges that haven't been shown yet
    const newBadges = earnedBadges.filter(badge => 
      badge.earned && !shownAchievements.includes(badge.id)
    );
    
    if (newBadges && newBadges.length > 0) {
      setNewAchievements(newBadges);
      
      // Store these as shown
      const updatedShown = [...shownAchievements, ...newBadges.map(b => b.id)];
      localStorage.setItem('shownAchievements', JSON.stringify(updatedShown));
      
      // Trigger confetti for new achievements
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (error) {
        console.warn('Failed to show confetti animation', error);
      }
    }
  };

  const awardXP = (amount) => {
    // Update local game data
    if (gameData) {
      const newXP = gameData.xp + amount;
      const oldLevel = gameData.level;
      
      // Check if this would cause a level up based on thresholds
      let newLevel = oldLevel;
      const levelThresholds = {
        'Novice': { min: 0, max: 999 },
        'Explorer': { min: 1000, max: 2399 },
        'Voyager': { min: 2400, max: 3999 },
        'Astronomer': { min: 4000, max: 5999 },
        'Scientist': { min: 6000, max: 8499 },
        'Astrophysicist': { min: 8500, max: 11999 },
        'Cosmic Master': { min: 12000, max: Infinity }
      };
      
      // Find new level based on XP
      for (const [level, threshold] of Object.entries(levelThresholds)) {
        if (newXP >= threshold.min && newXP <= threshold.max) {
          newLevel = level;
          break;
        }
      }
      
      // Calculate new level progress
      let levelProgress = 100;
      const currentLevelThreshold = levelThresholds[newLevel];
      if (currentLevelThreshold) {
        const xpInCurrentLevel = newXP - currentLevelThreshold.min;
        const xpRequiredForNextLevel = currentLevelThreshold.max - currentLevelThreshold.min + 1;
        levelProgress = Math.min(100, Math.floor((xpInCurrentLevel / xpRequiredForNextLevel) * 100));
      }
      
      // Update game data
      setGameData({
        ...gameData,
        xp: newXP,
        level: newLevel,
        levelProgress
      });
      
      // Check for level up
      if (newLevel !== oldLevel) {
        setShowLevelUp(true);
        // Launch confetti for level up
        confetti({
          particleCount: 200,
          spread: 100,
          origin: { y: 0.6 },
          colors: ['#FFD700', '#C0C0C0', '#6366F1']
        });
        
        // Hide level up notification after 5 seconds
        setTimeout(() => {
          setShowLevelUp(false);
        }, 5000);
      }
      
      // Show XP animation
      setXpAnimation({ show: true, amount });
      
      // Hide XP animation after 3 seconds
      setTimeout(() => {
        setXpAnimation({ show: false, amount: 0 });
      }, 3000);
    }
  };

  // Dismiss achievement notifications
  const dismissAchievements = () => {
    setNewAchievements([]);
  };

  // Game context value
  const value = {
    gameData,
    loading,
    newAchievements,
    dismissAchievements,
    refreshGameData: fetchGameData,
    awardXP,
    xpAnimation,
    showLevelUp,
    setShowLevelUp
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}