import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SignIn } from '../../pages/sign-in';
import { render } from '../../test/utils';
import { server } from '../../test/mocks/server';
import { http, HttpResponse } from 'msw';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock the useAuth hook
vi.mock('../../contexts/AuthContext', () => ({
  AuthProvider: ({ children }) => children,
  useAuth: vi.fn(() => ({
    isAuthenticated: false,
    user: null,
    loading: false,
    error: null,
    login: vi.fn(),
    logout: vi.fn(),
  })),
}));

import { useAuth } from '../../contexts/AuthContext';

describe('SignIn Page', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    localStorage.clear();
    // Reset the mock to default state
    useAuth.mockReturnValue({
      isAuthenticated: false,
      user: null,
      loading: false,
      error: null,
      login: vi.fn(),
      logout: vi.fn(),
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render sign in form', () => {
    render(<SignIn />);

    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/your.email@example.com/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/••••••••/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByText(/student demo/i)).toBeInTheDocument();
  });

  it('should handle successful login', async () => {
    const user = userEvent.setup();
    const mockLogin = vi.fn();
    
    useAuth.mockReturnValue({
      isAuthenticated: false,
      user: null,
      loading: false,
      error: null,
      login: mockLogin,
      logout: vi.fn(),
    });

    render(<SignIn />);

    const emailInput = screen.getByPlaceholderText(/your.email@example.com/i);
    const passwordInput = screen.getByPlaceholderText(/••••••••/);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'Password123!');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { replace: true });
    });
  });

  it('should handle demo login for student', async () => {
    const user = userEvent.setup();
    const mockLogin = vi.fn();
    
    useAuth.mockReturnValue({
      isAuthenticated: false,
      user: null,
      loading: false,
      error: null,
      login: mockLogin,
      logout: vi.fn(),
    });

    render(<SignIn />);

    const demoButton = screen.getByRole('button', { name: /student demo/i });
    await user.click(demoButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
      expect(localStorage.getItem('demo_mode')).toBe('true');
    });
  });

  it('should handle demo login for educator', async () => {
    const user = userEvent.setup();
    const mockLogin = vi.fn();
    
    useAuth.mockReturnValue({
      isAuthenticated: false,
      user: null,
      loading: false,
      error: null,
      login: mockLogin,
      logout: vi.fn(),
    });

    render(<SignIn />);

    const demoButton = screen.getByRole('button', { name: /educator demo/i });
    await user.click(demoButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
      expect(localStorage.getItem('demo_mode')).toBe('true');
      const demoUser = JSON.parse(localStorage.getItem('demo_user'));
      expect(demoUser.role).toBe('educator');
    });
  });

  it('should handle demo login for admin', async () => {
    const user = userEvent.setup();
    const mockLogin = vi.fn();
    
    useAuth.mockReturnValue({
      isAuthenticated: false,
      user: null,
      loading: false,
      error: null,
      login: mockLogin,
      logout: vi.fn(),
    });

    render(<SignIn />);

    const demoButton = screen.getByRole('button', { name: /admin demo/i });
    await user.click(demoButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
      expect(localStorage.getItem('demo_mode')).toBe('true');
      const demoUser = JSON.parse(localStorage.getItem('demo_user'));
      expect(demoUser.role).toBe('admin');
    });
  });

  it('should display error message on failed login', async () => {
    const user = userEvent.setup();
    render(<SignIn />);

    const emailInput = screen.getByPlaceholderText(/your.email@example.com/i);
    const passwordInput = screen.getByPlaceholderText(/••••••••/);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'wrong@example.com');
    await user.type(passwordInput, 'wrongpassword');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument();
    });
  });

  it('should validate required fields', async () => {
    const user = userEvent.setup();
    render(<SignIn />);

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    // Try to submit empty form - HTML5 validation should prevent submission
    await user.click(submitButton);

    // The form should not submit, so navigate should not be called
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('should disable form during submission', async () => {
    const user = userEvent.setup();
    render(<SignIn />);

    const emailInput = screen.getByPlaceholderText(/your.email@example.com/i);
    const passwordInput = screen.getByPlaceholderText(/••••••••/);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'Password123!');

    // Slow down the response to check loading state
    server.use(
      http.get('/api/status', async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
        return HttpResponse.json({ status: 'OK' });
      }),
      http.post('/api/auth/login', async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
        return HttpResponse.json({
          message: 'Login successful',
          user: { id: 1, username: 'testuser', email: 'test@example.com', role: 'student' },
          token: 'mock-jwt-token',
        });
      })
    );

    await user.click(submitButton);

    // Check if button shows loading state
    expect(screen.getByText(/signing in.../i)).toBeInTheDocument();
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { replace: true });
    });
  });

  it('should navigate to sign up page', async () => {
    const user = userEvent.setup();
    render(<SignIn />);

    const signUpLink = screen.getByText(/create an account/i);
    await user.click(signUpLink);

    // Since we're using Link component, navigation won't use mockNavigate
    // but we can check if the link has the correct href
    expect(signUpLink.closest('a')).toHaveAttribute('href', '/sign-up');
  });

  it('should handle network errors', async () => {
    const user = userEvent.setup();
    server.use(
      http.get('/api/status', () => {
        return HttpResponse.error();
      })
    );

    render(<SignIn />);

    const emailInput = screen.getByPlaceholderText(/your.email@example.com/i);
    const passwordInput = screen.getByPlaceholderText(/••••••••/);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'Password123!');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/cannot connect to server/i)).toBeInTheDocument();
    });
  });

  it('should show forgot password link', () => {
    render(<SignIn />);
    
    const forgotPasswordLink = screen.getByText(/forgot password/i);
    expect(forgotPasswordLink).toBeInTheDocument();
    expect(forgotPasswordLink.closest('a')).toHaveAttribute('href', '#');
  });

  it('should redirect if already authenticated', async () => {
    useAuth.mockReturnValue({
      isAuthenticated: true,
      user: { id: 1, username: 'testuser', email: 'test@example.com', role: 'student' },
      loading: false,
      error: null,
      login: vi.fn(),
      logout: vi.fn(),
    });

    render(<SignIn />);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });
});