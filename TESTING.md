# Cosmic Classroom Testing Guide

## Overview

This project uses a comprehensive testing setup with automated tests for both the client (React) and server (Node.js/TypeScript) components.

## Testing Stack

### Server Testing
- **Jest**: Test runner and assertion library
- **Supertest**: HTTP assertion library for API testing
- **ts-jest**: TypeScript support for Jest
- **jest-mock-extended**: Enhanced mocking for TypeScript

### Client Testing
- **Vitest**: Fast, Vite-native test runner
- **React Testing Library**: Component testing utilities
- **MSW (Mock Service Worker)**: API mocking
- **@testing-library/user-event**: User interaction simulation

## Running Tests

### Server Tests

```bash
cd server

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run only unit tests
npm run test:unit

# Run only integration tests
npm run test:integration
```

### Client Tests

```bash
cd client

# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests once (CI mode)
npm run test:run
```

## Test Structure

### Server Test Structure
```
server/
├── src/
│   ├── __tests__/
│   │   ├── controllers/
│   │   │   └── authController.test.ts
│   │   ├── services/
│   │   │   ├── openaiService.test.ts
│   │   │   └── GameMechanicsService.test.ts
│   │   ├── middlewares/
│   │   └── integration/
│   │       └── auth.integration.test.ts
│   └── test/
│       ├── setup.ts
│       └── helpers.ts
```

### Client Test Structure
```
client/
├── src/
│   ├── __tests__/
│   │   ├── components/
│   │   │   └── CosmicQA.test.jsx
│   │   ├── pages/
│   │   │   └── SignIn.test.jsx
│   │   ├── contexts/
│   │   │   └── AuthContext.test.jsx
│   │   └── api/
│   └── test/
│       ├── setup.js
│       ├── utils.jsx
│       └── mocks/
│           ├── handlers.js
│           └── server.js
```

## Writing Tests

### Server Unit Test Example

```typescript
import { processQuestion } from '../../services/openaiService';

describe('OpenAIService', () => {
  it('should process question successfully', async () => {
    const result = await processQuestion('What is JavaScript?', 'technology');
    expect(result).toContain('JavaScript');
  });
});
```

### Server Integration Test Example

```typescript
import request from 'supertest';
import app from '../../app';

describe('POST /api/auth/login', () => {
  it('should login with valid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'Password123!'
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });
});
```

### Client Component Test Example

```jsx
import { render, screen, waitFor } from '../../test/utils';
import userEvent from '@testing-library/user-event';
import { SignIn } from '../../pages/sign-in';

describe('SignIn Page', () => {
  it('should handle successful login', async () => {
    const user = userEvent.setup();
    render(<SignIn />);

    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'Password123!');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });
});
```

## Coverage Requirements

Both server and client have coverage thresholds configured:

- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%
- **Statements**: 70%

## CI/CD Integration

Tests run automatically on:
- Push to master, main, or develop branches
- Pull requests to these branches

The CI pipeline includes:
1. Server tests with PostgreSQL database
2. Client tests
3. Linting and TypeScript checking
4. Build verification

## Best Practices

1. **Test Isolation**: Each test should be independent and not rely on other tests
2. **Mock External Dependencies**: Use mocks for APIs, databases, and external services
3. **Test User Behavior**: Focus on testing what users do, not implementation details
4. **Use Descriptive Test Names**: Test names should clearly describe what is being tested
5. **Keep Tests Simple**: Each test should verify one specific behavior
6. **Use Test Utilities**: Leverage helper functions and custom render methods

## Debugging Tests

### Server Tests
```bash
# Run specific test file
npm test -- authController.test.ts

# Run tests matching pattern
npm test -- --testNamePattern="should login"

# Debug with Node inspector
node --inspect-brk ./node_modules/.bin/jest --runInBand
```

### Client Tests
```bash
# Run specific test file
npm test SignIn.test.jsx

# Run tests with UI for debugging
npm run test:ui

# Run tests matching pattern
npm test -- -t "should handle successful login"
```

## Environment Variables for Testing

### Server Test Environment
```env
NODE_ENV=test
DB_HOST=localhost
DB_NAME=cosmic_classroom_test
DB_USER=postgres
DB_PASSWORD=postgres
DB_PORT=5432
JWT_SECRET=test-jwt-secret
OPENAI_API_KEY=test-api-key
```

### Client Test Environment
Tests use MSW to mock API responses, so no special environment variables are needed.

## Troubleshooting

### Common Issues

1. **Database Connection Errors**: Ensure PostgreSQL is running for integration tests
2. **Port Conflicts**: Make sure ports 3000 and 5432 are available
3. **Module Resolution**: Check that all imports use correct paths
4. **Async Test Timeouts**: Increase timeout for slow operations using `jest.setTimeout()`

### Getting Help

If you encounter issues:
1. Check test output for specific error messages
2. Review test logs in CI/CD pipeline
3. Ensure all dependencies are installed with `npm install`
4. Clear cache with `npm test -- --clearCache` (Jest) or `npm test -- --clearScreen` (Vitest)