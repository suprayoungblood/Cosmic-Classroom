/**
 * Questions API service
 */

// Use the Vite proxy like other services
const API_URL = '/api';

/**
 * Ask a question (public endpoint)
 * @param {string} question - The space-related question
 * @returns {Promise} - Response from API
 */
export const askQuestion = async (question) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch(`${API_URL}/ask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    // Handle empty responses
    try {
      const text = await response.text();
      if (!text) {
        return { 
          answer: "I'm sorry, I couldn't connect to our space knowledge database. Please try again later.",
        };
      }
      
      const data = JSON.parse(text);
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to get answer');
      }
      
      return data;
    } catch (parseError) {
      console.error('Error parsing response:', parseError);
      return { 
        answer: "I received an unexpected response. Here's some information about space: Space is a nearly perfect vacuum, but it's not completely empty. It contains a low density of particles, primarily hydrogen and helium, as well as electromagnetic radiation, magnetic fields, and neutrinos."
      };
    }
  } catch (error) {
    console.error('Ask question error:', error);
    // Return a fallback response instead of throwing
    return { 
      answer: "I'm sorry, I couldn't process your question right now. The universe contains billions of galaxies, each with billions of stars. Our Milky Way galaxy is just one among countless others in the vast cosmos.",
      error: error.message
    };
  }
};

/**
 * Ask a question as an authenticated user
 * @param {string} question - The space-related question
 * @returns {Promise} - Response from API
 */
export const askAuthenticatedQuestion = async (question) => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      console.log('Not authenticated, falling back to public question API');
      // Fall back to the public API
      return askQuestion(question);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    try {
      const response = await fetch(`${API_URL}/ask/authenticated`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      // Handle response (even if not OK)
      const text = await response.text();
      
      if (!text) {
        console.log('Empty response from authenticated API, falling back');
        // Fall back to the public API
        return askQuestion(question);
      }
      
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.warn('Invalid JSON response:', e);
        return {
          answer: "I received an unexpected response format. The universe is vast and contains countless celestial objects including stars, planets, galaxies, nebulae, and black holes. Our solar system is just a tiny part of the Milky Way galaxy.",
          gameData: null
        };
      }
      
      // For any error response, log but return a friendly message
      if (!response.ok) {
        console.warn('API returned error but providing fallback: ', data.message || 'Unknown error');
        
        // For 401 specifically, try the public API
        if (response.status === 401) {
          console.log('Authentication failed, falling back to public question API');
          return askQuestion(question);
        }
        
        // For other errors, provide a good fallback response
        return {
          answer: "I encountered some difficulty processing your question, but I can tell you that space exploration has revealed fascinating details about our cosmic neighborhood. The James Webb Space Telescope is currently providing unprecedented views of distant galaxies and planetary systems.",
          gameData: null
        };
      }
      
      return data;
    } catch (fetchError) {
      clearTimeout(timeoutId);
      console.warn('Fetch error in authenticated question:', fetchError);
      // Try the public API if fetch fails
      return askQuestion(question);
    }
  } catch (error) {
    console.error('Ask authenticated question error:', error);
    // Fall back to the public API as a last resort
    return askQuestion(question);
  }
};

/**
 * Get question history for authenticated user
 * @returns {Promise} - Response from API or fallback data
 */
export const getQuestionHistory = async () => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      console.warn('Not authenticated - returning empty question history');
      return []; // Return empty array instead of throwing
    }

    // Add a short delay to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 300));

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    try {
      const response = await fetch(`${API_URL}/questions/history`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      // First try to get the response text
      const text = await response.text();
      
      // Handle empty responses
      if (!text) {
        console.warn('Empty response from history API');
        return []; // Return empty array for empty responses
      }
      
      // Try to parse the JSON
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error('Error parsing question history JSON:', e);
        return []; // Return empty array for parse errors
      }

      // Check for error responses but don't throw
      if (!response.ok) {
        console.warn('Question history API returned error:', data.message || 'Unknown error');
        return []; // Return empty array for API errors
      }

      return data;
    } catch (fetchError) {
      clearTimeout(timeoutId);
      console.error('Fetch error in question history:', fetchError);
      return []; // Return empty array for fetch errors
    }
  } catch (error) {
    console.error('Get question history error:', error);
    return []; // Return empty array for any other errors
  }
};