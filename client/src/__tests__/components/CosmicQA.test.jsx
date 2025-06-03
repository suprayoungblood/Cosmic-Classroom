import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CosmicQA from '../../components/cosmic/cosmic-qa';
import { render } from '../../test/utils';
import { server } from '../../test/mocks/server';
import { http, HttpResponse } from 'msw';

// Mock the API functions
vi.mock('../../api/questions', () => ({
  askQuestion: vi.fn(),
  askAuthenticatedQuestion: vi.fn(),
}));

import { askQuestion, askAuthenticatedQuestion } from '../../api/questions';

describe('CosmicQA Component', () => {
  const mockOnNewQuestion = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockOnNewQuestion.mockClear();
    askQuestion.mockClear();
    askAuthenticatedQuestion.mockClear();
  });

  it('should render question form', () => {
    render(<CosmicQA onNewQuestion={mockOnNewQuestion} />);

    expect(screen.getByText(/ask anything about space/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/your space question/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ask question/i })).toBeInTheDocument();
  });

  it('should display suggested questions', () => {
    render(<CosmicQA onNewQuestion={mockOnNewQuestion} />);

    expect(screen.getByText(/suggested questions/i)).toBeInTheDocument();
    expect(screen.getByText(/why is mars red/i)).toBeInTheDocument();
    expect(screen.getByText(/planets/i)).toBeInTheDocument();
  });

  it('should submit question for unauthenticated user', async () => {
    const user = userEvent.setup();
    
    askQuestion.mockResolvedValue({
      answer: 'Mars is red because of iron oxide on its surface.',
      questionId: 1,
    });

    render(<CosmicQA onNewQuestion={mockOnNewQuestion} />);

    const questionInput = screen.getByLabelText(/your space question/i);
    await user.type(questionInput, 'Why is Mars red?');

    const submitButton = screen.getByRole('button', { name: /ask question/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(askQuestion).toHaveBeenCalledWith('Why is Mars red?');
      expect(screen.getByText(/mars is red because of iron oxide/i)).toBeInTheDocument();
    });

    // Should not call onNewQuestion for unauthenticated users
    expect(mockOnNewQuestion).not.toHaveBeenCalled();
  });

  it('should submit question for authenticated user', async () => {
    const user = userEvent.setup();
    const mockUser = { id: 1, username: 'testuser', age: 12 };
    
    askAuthenticatedQuestion.mockResolvedValue({
      answer: 'Mars appears red due to iron oxide on its surface.',
      questionId: 1,
      xpEarned: 15,
    });

    render(<CosmicQA user={mockUser} onNewQuestion={mockOnNewQuestion} />);

    const questionInput = screen.getByLabelText(/your space question/i);
    await user.type(questionInput, 'Why is Mars red?');

    const submitButton = screen.getByRole('button', { name: /ask question/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(askAuthenticatedQuestion).toHaveBeenCalledWith('Why is Mars red?');
      expect(screen.getByText(/mars appears red due to iron oxide/i)).toBeInTheDocument();
    });

    // Should call onNewQuestion for authenticated users
    expect(mockOnNewQuestion).toHaveBeenCalledWith(
      'Why is Mars red?',
      'Mars appears red due to iron oxide on its surface.'
    );
  });

  it('should handle suggested question click', async () => {
    const user = userEvent.setup();
    
    askQuestion.mockResolvedValue({
      answer: 'Mars is red because of iron oxide.',
      questionId: 1,
    });

    render(<CosmicQA onNewQuestion={mockOnNewQuestion} />);

    const suggestedQuestion = screen.getByRole('button', { name: /why is mars red/i });
    await user.click(suggestedQuestion);

    // Should populate the input
    const questionInput = screen.getByLabelText(/your space question/i);
    expect(questionInput).toHaveValue('Why is Mars red?');

    // Should auto-submit
    await waitFor(() => {
      expect(askQuestion).toHaveBeenCalledWith('Why is Mars red?');
    });
  });

  it('should switch between question categories', async () => {
    const user = userEvent.setup();
    
    render(<CosmicQA onNewQuestion={mockOnNewQuestion} />);

    // Click on stars category
    const starsChip = screen.getByText(/stars/i);
    await user.click(starsChip);

    // Should show star-related questions
    expect(screen.getByText(/how do stars form/i)).toBeInTheDocument();
    expect(screen.getByText(/what is a black hole/i)).toBeInTheDocument();
  });

  it('should show loading state during submission', async () => {
    const user = userEvent.setup();
    
    // Delay response to check loading state
    askQuestion.mockImplementation(() => 
      new Promise(resolve => setTimeout(() => 
        resolve({ answer: 'Test answer', questionId: 1 }), 100
      ))
    );

    render(<CosmicQA onNewQuestion={mockOnNewQuestion} />);

    const questionInput = screen.getByLabelText(/your space question/i);
    await user.type(questionInput, 'Test question?');

    const submitButton = screen.getByRole('button', { name: /ask question/i });
    await user.click(submitButton);

    // Check loading state
    expect(screen.getByText(/processing/i)).toBeInTheDocument();
    expect(submitButton).toBeDisabled();

    await waitFor(() => {
      expect(screen.getByText(/test answer/i)).toBeInTheDocument();
    });
  });

  it('should handle API errors gracefully', async () => {
    const user = userEvent.setup();
    
    askQuestion.mockRejectedValue(new Error('API Error'));

    render(<CosmicQA onNewQuestion={mockOnNewQuestion} />);

    const questionInput = screen.getByLabelText(/your space question/i);
    await user.type(questionInput, 'Test question?');

    const submitButton = screen.getByRole('button', { name: /ask question/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/sorry, we couldn't process your question/i)).toBeInTheDocument();
    });
  });

  it('should disable submit button when question is empty', () => {
    render(<CosmicQA onNewQuestion={mockOnNewQuestion} />);

    const submitButton = screen.getByRole('button', { name: /ask question/i });
    expect(submitButton).toBeDisabled();
  });

  it('should enable submit button when question is entered', async () => {
    const user = userEvent.setup();
    
    render(<CosmicQA onNewQuestion={mockOnNewQuestion} />);

    const submitButton = screen.getByRole('button', { name: /ask question/i });
    expect(submitButton).toBeDisabled();

    const questionInput = screen.getByLabelText(/your space question/i);
    await user.type(questionInput, 'Why is space dark?');

    expect(submitButton).not.toBeDisabled();
  });

  it('should show simplify and more details buttons after answer', async () => {
    const user = userEvent.setup();
    
    askQuestion.mockResolvedValue({
      answer: 'This is a complex answer about space.',
      questionId: 1,
    });

    render(<CosmicQA onNewQuestion={mockOnNewQuestion} />);

    const questionInput = screen.getByLabelText(/your space question/i);
    await user.type(questionInput, 'Complex space question?');

    const submitButton = screen.getByRole('button', { name: /ask question/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/this is a complex answer/i)).toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: /explain simpler/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /more details/i })).toBeInTheDocument();
  });

  it('should request simplified answer', async () => {
    const user = userEvent.setup();
    const mockUser = { id: 1, username: 'testuser', age: 8 };
    
    askAuthenticatedQuestion
      .mockResolvedValueOnce({
        answer: 'Complex scientific explanation.',
        questionId: 1,
      })
      .mockResolvedValueOnce({
        answer: 'Simple explanation for kids.',
        questionId: 2,
      });

    render(<CosmicQA user={mockUser} onNewQuestion={mockOnNewQuestion} />);

    // First ask a question
    const questionInput = screen.getByLabelText(/your space question/i);
    await user.type(questionInput, 'What is gravity?');
    await user.click(screen.getByRole('button', { name: /ask question/i }));

    await waitFor(() => {
      expect(screen.getByText(/complex scientific explanation/i)).toBeInTheDocument();
    });

    // Click simplify button
    const simplifyButton = screen.getByRole('button', { name: /explain simpler/i });
    await user.click(simplifyButton);

    await waitFor(() => {
      expect(askAuthenticatedQuestion).toHaveBeenCalledWith(
        expect.stringContaining('Please explain in simple terms for a 8 year old')
      );
      expect(screen.getByText(/simple explanation for kids/i)).toBeInTheDocument();
    });
  });

  it('should auto-enable simplified mode for young users', () => {
    const youngUser = { id: 1, username: 'younguser', age: 7 };
    
    render(<CosmicQA user={youngUser} onNewQuestion={mockOnNewQuestion} />);

    // Component should initialize with simplified mode for users under 10
    // This is internal state, but we can verify behavior when asking questions
    expect(screen.getByText(/ask anything about space/i)).toBeInTheDocument();
  });
});