import { createContext, useContext, useState, useEffect } from 'react';
import { isLoggedIn, getCurrentUser } from '../api/auth';

// Create the auth context
const AuthContext = createContext(null);

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Check for existing token on mount with validation
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        
        // Use the improved validation from auth.js
        if (isLoggedIn()) {
          const userData = getCurrentUser();
          if (userData) {
            setIsAuthenticated(true);
            setUser(userData);
          } else {
            // Invalid user data
            handleLogout();
          }
        } else {
          // No valid token
          handleLogout(false);
        }
      } catch (error) {
        console.error('Auth context initialization error:', error);
        setAuthError('Failed to initialize authentication');
        handleLogout(false);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  // Login function with validation
  const login = (userData, token) => {
    if (!userData || !token) {
      setAuthError('Invalid login data');
      return;
    }
    
    try {
      // Validate the token structure first
      const parts = token.split('.');
      if (parts.length !== 3) {
        setAuthError('Invalid token format');
        return;
      }
      
      // Validate token payload (try to decode base64)
      try {
        const payload = JSON.parse(atob(parts[1]));
        if (!payload.id) {
          console.warn('Token missing required ID field:', payload);
          setAuthError('Invalid token structure');
          return;
        }
      } catch (e) {
        console.error('Token payload validation error:', e);
        setAuthError('Token validation failed');
        return;
      }
      
      // Clear any existing data first
      localStorage.clear();
      
      // Store new auth data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('authTimestamp', Date.now().toString());
      
      setIsAuthenticated(true);
      setUser(userData);
      setAuthError(null);
    } catch (error) {
      console.error('Login error:', error);
      setAuthError('Failed to save authentication data');
      handleLogout(false);
    }
  };

  // Improved logout function that clears all localStorage
  const handleLogout = (redirect = true) => {
    // Clear all localStorage to prevent stale data
    localStorage.clear();
    
    // Reset auth state
    setIsAuthenticated(false);
    setUser(null);
    
    // Optionally redirect to login page
    if (redirect) {
      window.location.href = '/';
    }
  };

  // Context value
  const value = {
    isAuthenticated,
    user,
    loading,
    error: authError,
    login,
    logout: handleLogout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}