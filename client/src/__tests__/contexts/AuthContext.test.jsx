import { describe, it, expect, beforeEach, vi, beforeAll, afterEach, afterAll } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../../contexts/AuthContext';

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  function wrapper({ children }) {
    return <AuthProvider>{children}</AuthProvider>;
  }

  describe('Initial State', () => {
    it('should provide initial auth state', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      // Wait for initial loading to complete
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });

    it('should load user from localStorage on mount', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        role: 'student',
      };
      const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6InN0dWRlbnQifQ.signature';

      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('authTimestamp', Date.now().toString());

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
        expect(result.current.user).toEqual(mockUser);
        expect(result.current.isAuthenticated).toBe(true);
      });
    });
  });

  describe('Login', () => {
    it('should login successfully with valid data', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        role: 'student',
      };
      const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6InN0dWRlbnQifQ.signature';

      act(() => {
        result.current.login(mockUser, mockToken);
      });

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toEqual(mockUser);
      expect(localStorage.getItem('token')).toBe(mockToken);
      expect(localStorage.getItem('user')).toBe(JSON.stringify(mockUser));
    });

    it('should handle demo mode login', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const demoUser = {
        id: 'demo-user',
        username: 'Demo User',
        email: 'demo@cosmicclassroom.com',
        role: 'student',
        isDemo: true,
      };

      // Mock console.log to verify demo mode message
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      act(() => {
        result.current.login(demoUser, 'DEMO_MODE_NO_API');
      });

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toEqual(demoUser);
      expect(localStorage.getItem('demo_mode')).toBe('true');

      consoleLogSpy.mockRestore();
    });

    it('should not login with invalid token format', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        role: 'student',
      };

      act(() => {
        result.current.login(mockUser, 'invalid-token');
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
      expect(result.current.error).toBe('Invalid token format');
    });

    it('should not login with missing data', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      act(() => {
        result.current.login(null, 'token');
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
      expect(result.current.error).toBe('Invalid login data');
    });
  });

  describe('Logout', () => {
    it('should logout and clear user data', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // First login
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        role: 'student',
      };
      const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6InN0dWRlbnQifQ.signature';

      act(() => {
        result.current.login(mockUser, mockToken);
      });

      expect(result.current.isAuthenticated).toBe(true);

      // Mock window.location.href
      delete window.location;
      window.location = { href: '' };

      // Then logout without redirect
      act(() => {
        result.current.logout(false);
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
    });

    it('should redirect on logout by default', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Mock window.location.href
      delete window.location;
      window.location = { href: '' };

      act(() => {
        result.current.logout();
      });

      expect(window.location.href).toBe('/');
    });
  });

  describe('Token Validation', () => {
    it('should validate token payload structure', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        role: 'student',
      };
      
      // Token without id in payload
      const invalidToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic3R1ZGVudCJ9.signature';

      // Mock console.warn to avoid noise in tests
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      act(() => {
        result.current.login(mockUser, invalidToken);
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.error).toBe('Invalid token structure');

      consoleWarnSpy.mockRestore();
    });

    it('should handle malformed token payload', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        role: 'student',
      };
      
      // Token with invalid base64 payload
      const malformedToken = 'header.invalid-base64.signature';

      // Mock console.error to avoid noise in tests
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      act(() => {
        result.current.login(mockUser, malformedToken);
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.error).toBe('Token validation failed');

      consoleErrorSpy.mockRestore();
    });
  });

  describe('Error Handling', () => {
    it('should clear error on successful login', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // First cause an error
      act(() => {
        result.current.login(null, 'token');
      });

      expect(result.current.error).toBe('Invalid login data');

      // Then login successfully
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        role: 'student',
      };
      const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6InN0dWRlbnQifQ.signature';

      act(() => {
        result.current.login(mockUser, mockToken);
      });

      expect(result.current.error).toBeNull();
      expect(result.current.isAuthenticated).toBe(true);
    });
  });

  describe('useAuth Hook', () => {
    it('should throw error when used outside AuthProvider', () => {
      // Mock console.error to avoid noise in tests
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        renderHook(() => useAuth());
      }).toThrow('useAuth must be used within an AuthProvider');

      consoleErrorSpy.mockRestore();
    });
  });
});