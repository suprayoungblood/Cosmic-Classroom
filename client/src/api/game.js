/**
 * Game Mechanics API service
 */

// Use the same API URL format as auth.js for consistency
const API_URL = '/api';

/**
 * Default game profile data
 * This helps ensure we have consistent data across the application
 */
const defaultGameProfile = {
  level: 'Explorer',
  xp: 1200,
  levelProgress: 20,
  dailyStreak: 1,
  questionsAsked: 5,
  topicsExplored: 3,
  badges: [
    { id: 1, name: 'First Contact', icon: '🚀', description: 'Asked your first space question', earned: true },
    { id: 2, name: 'Planetary Pioneer', icon: '🪐', description: 'Expert in planetary knowledge', earned: true }
  ],
  earnedBadges: [
    { id: 1, name: 'First Contact', icon: '🚀', description: 'Asked your first space question', earned: true }
  ],
  nextLevel: 'Voyager',
  xpToNextLevel: 1200
};

// Track API calls to implement client-side rate limiting
const lastApiCallTime = {
  getGameProfile: 0
};

/**
 * Get user's game profile with robust error handling and rate limiting
 * @returns {Promise} - Game profile data
 */
export const getGameProfile = async () => {
  try {
    // Check if we're getting rate limited by checking localStorage flag
    const isRateLimited = localStorage.getItem('is_rate_limited') === 'true';
    if (isRateLimited) {
      console.log('Currently rate limited, returning default profile without API call');
      return { ...defaultGameProfile };
    }
    
    // Check if we've called this API recently (within 10 seconds - increased to prevent rate limiting)
    const now = Date.now();
    const timeSinceLastCall = now - lastApiCallTime.getGameProfile;
    
    if (timeSinceLastCall < 10000) {
      console.log(`Rate limiting getGameProfile (called ${timeSinceLastCall}ms ago)`);
      // Wait at least 10 seconds between calls
      return { ...defaultGameProfile }; // Just return default data instead of waiting
    }
    
    // Update last call time
    lastApiCallTime.getGameProfile = Date.now();
    
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('No auth token - returning default game profile');
      return { ...defaultGameProfile };
    }

    // Skip API call if we had a recent 429 error
    if (localStorage.getItem('last_429_error')) {
      const lastErrorTime = parseInt(localStorage.getItem('last_429_error'), 10);
      const timeElapsed = Date.now() - lastErrorTime;
      // If last rate limit error was less than 2 minutes ago, just use default data
      if (timeElapsed < 120000) {
        console.log(`Using default data - rate limited ${Math.round(timeElapsed/1000)}s ago`);
        return { ...defaultGameProfile };
      }
    }
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // Increase timeout to 10 seconds for reliable operation

    try {
      const response = await fetch(`${API_URL}/game/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      // Handle potential empty response
      const text = await response.text();
      if (!text) {
        console.log('Empty response from game profile API, using defaults');
        return { ...defaultGameProfile };
      }

      // Check for rate limiting before attempting to parse
      if (text.includes('Too many requests') || response.status === 429) {
        console.warn('Rate limited by server:', text);
        // Store timestamp of last rate limit error
        localStorage.setItem('last_429_error', Date.now().toString());
        // Set rate limited flag for 2 minutes
        localStorage.setItem('is_rate_limited', 'true');
        setTimeout(() => {
          localStorage.setItem('is_rate_limited', 'false');
        }, 120000);
        return { ...defaultGameProfile };
      }
      
      // Check for unauthorized response (invalid token)
      if (response.status === 401) {
        console.warn('Unauthorized access to game profile');
        return { ...defaultGameProfile };
      }

      // Try to parse the JSON response
      try {
        const data = JSON.parse(text);
        
        // If we get valid data but non-200 status, log but return default
        if (!response.ok) {
          console.warn(`Server returned ${response.status} status:`, data);
          return { ...defaultGameProfile };
        }
        
        // Make sure the data has the expected structure
        const validatedData = {
          ...defaultGameProfile,
          ...data,
          // Ensure necessary fields exist even if they weren't in the response
          badges: data.badges || defaultGameProfile.badges,
          earnedBadges: data.earnedBadges || data.badges || defaultGameProfile.earnedBadges
        };
        
        return validatedData;
      } catch (parseError) {
        console.error('Error parsing game profile JSON:', parseError);
        return { ...defaultGameProfile };
      }
    } catch (fetchError) {
      clearTimeout(timeoutId);
      console.error('Fetch error in game profile:', fetchError);
      
      // If request was aborted due to timeout, add a delay before returning
      if (fetchError.name === 'AbortError') {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      return { ...defaultGameProfile };
    }
  } catch (error) {
    console.error('Unexpected error in getGameProfile:', error);
    return { ...defaultGameProfile };
  }
};

/**
 * Get user's badges
 * @returns {Promise} - User badges
 */
export const getUserBadges = async () => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_URL}/game/badges`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to get badges');
    }

    return data;
  } catch (error) {
    console.error('Get badges error:', error);
    throw error;
  }
};

/**
 * Get user's challenges
 * @returns {Promise} - User challenges
 */
export const getUserChallenges = async () => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_URL}/game/challenges`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to get challenges');
    }

    return data;
  } catch (error) {
    console.error('Get challenges error:', error);
    throw error;
  }
};

/**
 * Update daily streak
 * @returns {Promise} - Updated streak value
 */
export const updateDailyStreak = async () => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('Not authenticated');
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

    const response = await fetch(`${API_URL}/game/streak`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    // Handle potential empty response
    const text = await response.text();
    if (!text) {
      // Return default value silently
      return 1;
    }
    
    // Parse JSON safely
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error('Error parsing streak response:', e);
      return 1;
    }

    // Handle unauthorized or other errors gracefully
    if (!response.ok) {
      console.log('Streak update status:', response.status, 'with data:', data);
      // Don't throw, just return default streak
      return 1;
    }

    return data.streak;
  } catch (error) {
    console.error('Update streak error:', error);
    // Return a default value
    return 1;
  }
};

/**
 * Record topic exploration
 * @param {string} topic - The topic being explored
 * @returns {Promise} - Success message
 */
export const recordTopicExploration = async (topic) => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_URL}/game/explore`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ topic }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to record topic exploration');
    }

    return data;
  } catch (error) {
    console.error('Record topic exploration error:', error);
    throw error;
  }
};