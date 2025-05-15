/**
 * Authentication API service
 */

// Use the Vite proxy or environment variable
const API_URL = '/api';

// Test server connectivity - do this at most once per session
const testServerConnection = async () => {
  // Check if we already tested the connection this session
  if (sessionStorage.getItem('server_connection_tested')) {
    return sessionStorage.getItem('server_connected') === 'true';
  }
  
  // Check if the server is rate limiting us
  if (localStorage.getItem('is_rate_limited') === 'true') {
    console.log('Rate limiting in effect, skipping connection test');
    return true; // Assume it's working to avoid more calls
  }
  
  try {
    console.log('Testing server connection...');
    sessionStorage.setItem('server_connection_tested', 'true');
    
    // Set a timeout for the request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    const response = await fetch(`${API_URL}/status`, {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    // Check for rate limiting
    if (response.status === 429) {
      console.warn('Rate limited during connection test, backing off');
      localStorage.setItem('is_rate_limited', 'true');
      setTimeout(() => {
        localStorage.setItem('is_rate_limited', 'false');
      }, 120000); // Relax after 2 minutes
      sessionStorage.setItem('server_connected', 'true'); // Assume it's ok
      return true;
    }
    
    if (!response.ok) {
      console.warn(`Server status check failed with status ${response.status}, but continuing`);
      sessionStorage.setItem('server_connected', 'false');
      return false;
    }
    
    try {
      const data = await response.json();
      console.log('Server connection successful:', data);
      sessionStorage.setItem('server_connected', 'true');
      return true;
    } catch (e) {
      console.warn('Server returned invalid JSON, but continuing');
      sessionStorage.setItem('server_connected', 'false');
      return false;
    }
  } catch (error) {
    const errorMessage = error.name === 'AbortError' 
      ? 'Server connection timed out'
      : error.message;
    console.warn(`Server connection failed (${errorMessage}), but continuing`);
    sessionStorage.setItem('server_connected', 'false');
    return false;
  }
};

// Only run the test if we haven't tried yet this session
if (!sessionStorage.getItem('server_connection_tested')) {
  testServerConnection().catch(err => {
    console.warn('Server connection test failed but continuing', err);
    sessionStorage.setItem('server_connected', 'false');
  });
}

console.log("Using API URL:", API_URL);

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise} - Response from API
 */
export const register = async (userData) => {
  try {
    console.log('Registering with API URL:', `${API_URL}/auth/register`);
    console.log('User data:', userData);
    
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      // Enhanced error handling
      const error = new Error(data.message || 'Failed to register');
      
      // Add any validation errors to the error object
      if (data.errors) {
        error.errors = data.errors;
      }
      
      throw error;
    }

    // Store token in localStorage for future requests
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
    }

    return data;
  } catch (error) {
    console.error('Register error:', error);
    throw error;
  }
};

/**
 * Login an existing user
 * @param {Object} credentials - Login credentials
 * @returns {Promise} - Response from API
 */
export const login = async (credentials) => {
  try {
    // First remove any old data from localStorage (complete cleanup)
    localStorage.clear();
    
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      // Enhanced error handling
      const error = new Error(data.message || 'Failed to login');
      
      // Add any validation errors to the error object
      if (data.errors) {
        error.errors = data.errors;
      }
      
      throw error;
    }

    // Validate token before storing
    if (data.token) {
      // Check token format (header.payload.signature)
      const parts = data.token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid token format received from server');
      }
      
      try {
        // Decode payload to check for expected fields
        const payload = JSON.parse(atob(parts[1]));
        if (!payload.id) {
          console.warn('Token payload missing required fields', payload);
          throw new Error('Invalid token structure');
        }
        
        // Store authentication data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data));
        localStorage.setItem('authTimestamp', Date.now().toString()); // Add timestamp for session tracking
      } catch (e) {
        console.error('Token validation error:', e);
        throw new Error('Token validation failed');
      }
    } else {
      throw new Error('No token received from server');
    }

    return data;
  } catch (error) {
    console.error('Login error:', error);
    // Clean up partial data on error
    localStorage.clear();
    throw error;
  }
};

/**
 * Get current user's profile
 * @returns {Promise} - Response from API or null if not authenticated
 */
export const getProfile = async () => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      console.warn('Not authenticated when getting profile');
      return null;
    }

    // Add delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 300));

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
      const response = await fetch(`${API_URL}/auth/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      // Handle empty response
      const text = await response.text();
      if (!text) {
        console.warn('Empty response from profile API');
        return null;
      }
      
      // Try to parse JSON safely
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error('Error parsing profile response:', e);
        return null;
      }

      if (!response.ok) {
        console.warn(`Error from profile API: ${data.message || 'Unknown error'}`);
        
        // If token is invalid or expired, clear it
        if (response.status === 401) {
          console.log('Token is invalid - clearing localStorage');
          // Don't clear localStorage yet, just return null
          // localStorage.clear();
          return null;
        }
        
        return null;
      }

      return data;
    } catch (fetchError) {
      clearTimeout(timeoutId);
      console.error('Fetch error in get profile:', fetchError);
      return null;
    }
  } catch (error) {
    console.error('Get profile error:', error);
    return null;
  }
};

/**
 * Update user's profile
 * @param {Object} profileData - Updated profile data
 * @returns {Promise} - Response from API
 */
export const updateProfile = async (profileData) => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_URL}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update profile');
    }

    // Update stored user data
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const updatedUser = { ...currentUser, ...data };
    localStorage.setItem('user', JSON.stringify(updatedUser));

    return data;
  } catch (error) {
    console.error('Update profile error:', error);
    throw error;
  }
};

/**
 * Logout the current user and clear all localStorage items
 * @param {boolean} redirect - Whether to redirect to home page after logout
 */
export const logout = (redirect = true) => {
  // Clear all localStorage completely
  try {
    localStorage.clear();
    sessionStorage.clear(); // Also clear session storage for complete cleanup
    
    // Optional: Add a logout timestamp to track sessions
    try {
      localStorage.setItem('lastLogout', Date.now().toString());
    } catch (e) {
      // Ignore errors setting this item
    }
    
    // Force page reload to clear any in-memory state and trigger a fresh login
    if (redirect) {
      console.log('Logging out and redirecting...');
      window.location.href = '/';
    }
  } catch (error) {
    console.error('Error during logout:', error);
    // If clearing localStorage fails, try a hard redirect
    if (redirect) {
      window.location.href = '/?force_logout=1';
    }
  }
};

/**
 * Check if user is logged in with valid token format
 * @returns {Boolean} - True if user is logged in with valid token
 */
export const isLoggedIn = () => {
  // Special case: demo mode (bypass token validation)
  if (localStorage.getItem('demo_mode') === 'true' && localStorage.getItem('demo_user')) {
    console.log('Demo mode active, bypassing token validation');
    return true;
  }
  
  const token = localStorage.getItem('token');
  if (!token) return false;
  
  // If token is our special demo token, consider it valid
  if (token === 'DEMO_MODE_NO_API') {
    return true;
  }
  
  // Basic validation to make sure token has 3 parts separated by dots (header.payload.signature)
  const parts = token.split('.');
  if (parts.length !== 3) {
    console.warn('Invalid token format detected, clearing invalid token');
    localStorage.removeItem('token');
    return false;
  }
  
  try {
    // Verify payload format and expiration
    const payload = JSON.parse(atob(parts[1]));
    
    // Check required fields
    if (!payload.id) {
      console.warn('Token payload missing user ID');
      localStorage.removeItem('token');
      return false;
    }
    
    // Check token expiration
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      console.warn('Token expired');
      localStorage.removeItem('token');
      return false;
    }
    
    return true;
  } catch (e) {
    console.error('Token validation error in isLoggedIn:', e);
    localStorage.removeItem('token');
    return false;
  }
};

/**
 * Get current user data from localStorage with validation
 * @returns {Object|null} - User data or null if not logged in
 */
export const getCurrentUser = () => {
  // Check for demo mode first
  if (localStorage.getItem('demo_mode') === 'true') {
    const demoUserStr = localStorage.getItem('demo_user');
    if (demoUserStr) {
      try {
        return JSON.parse(demoUserStr);
      } catch (e) {
        console.error('Error parsing demo user data:', e);
      }
    }
  }
  
  // First verify token is valid
  if (!isLoggedIn()) return null;
  
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  
  try {
    const userData = JSON.parse(userStr);
    
    // Basic validation of user data
    if (!userData || !userData.id) {
      console.warn('Invalid user data stored, clearing local storage');
      localStorage.clear();
      return null;
    }
    
    return userData;
  } catch (e) {
    console.error('Error parsing user data:', e);
    // Clear all invalid data
    localStorage.clear();
    return null;
  }
};