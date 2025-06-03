import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { vi } from 'vitest';

// Mock GameProvider to avoid dependencies
vi.mock('../contexts/GameContext', () => ({
  GameProvider: ({ children }) => children,
  useGame: () => ({
    gameData: null,
    loading: false,
    error: null,
    updateGameData: vi.fn(),
    triggerConfetti: vi.fn(),
  }),
}));

// Custom render function that includes providers
export function renderWithProviders(ui, options = {}) {
  const {
    ...renderOptions
  } = options;

  function Wrapper({ children }) {
    return (
      <BrowserRouter>
        <AuthProvider>
          {children}
        </AuthProvider>
      </BrowserRouter>
    );
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

// Re-export everything
export * from '@testing-library/react';
export { renderWithProviders as render };