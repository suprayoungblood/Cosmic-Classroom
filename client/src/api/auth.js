/**
 * Authentication API service
 */

// Use the Vite proxy or environment variable
const API_URL = '/api';

// Test server connectivity
const testServerConnection = async () => {
  try {
    console.log('Testing server connection...');
    
    // Set a timeout for the request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    const response = await fetch(`${API_URL}/status`, {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.warn(`Server status check failed with status ${response.status}, but continuing`);
      return false;
    }
    
    try {
      const data = await response.json();
      console.log('Server connection successful:', data);
      return true;
    } catch (e) {
      console.warn('Server returned invalid JSON, but continuing');
      return false;
    }
  } catch (error) {
    const errorMessage = error.name === 'AbortError' 
      ? 'Server connection timed out'
      : error.message;
    console.warn(`Server connection failed (${errorMessage}), but continuing`);
    return false;
  }
};

// Run the test on load but don't block other operations
testServerConnection().catch(err => {
  console.warn('Server connection test failed but continuing', err);
});

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

    // Store token in localStorage for future requests
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
    }

    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

/**
 * Get current user's profile
 * @returns {Promise} - Response from API
 */
export const getProfile = async () => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_URL}/auth/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to get profile');
    }

    return data;
  } catch (error) {
    console.error('Get profile error:', error);
    throw error;
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
 * Logout the current user
 */
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

/**
 * Check if user is logged in
 * @returns {Boolean} - True if user is logged in
 */
export const isLoggedIn = () => {
  return !!localStorage.getItem('token');
};

/**
 * Get current user data from localStorage
 * @returns {Object|null} - User data or null if not logged in
 */
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch (e) {
    console.error('Error parsing user data:', e);
    return null;
  }
};