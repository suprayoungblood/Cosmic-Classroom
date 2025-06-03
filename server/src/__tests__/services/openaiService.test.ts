import { processQuestion } from '../../services/openaiService';
import OpenAI from 'openai';

jest.mock('openai');

describe('OpenAIService', () => {
  let mockOpenAI: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockOpenAI = {
      chat: {
        completions: {
          create: jest.fn()
        }
      }
    };
    (OpenAI as jest.MockedClass<typeof OpenAI>).mockImplementation(() => mockOpenAI);
  });

  describe('processQuestion', () => {
    it('should process question successfully with OpenAI', async () => {
      const mockResponse = {
        choices: [{
          message: {
            content: 'This is a test response from OpenAI'
          }
        }]
      };

      mockOpenAI.chat.completions.create.mockResolvedValue(mockResponse);

      const result = await processQuestion('What is JavaScript?', 'science');

      expect(mockOpenAI.chat.completions.create).toHaveBeenCalledWith({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: expect.stringContaining('educational AI assistant')
          },
          {
            role: 'user',
            content: 'Topic: science\nQuestion: What is JavaScript?'
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      });

      expect(result).toBe('This is a test response from OpenAI');
    });

    it('should return fallback response when OpenAI fails', async () => {
      mockOpenAI.chat.completions.create.mockRejectedValue(new Error('OpenAI API error'));

      const result = await processQuestion('What is quantum computing?', 'science');

      expect(result).toContain('I\'m currently unable to process your question');
      expect(result).toContain('quantum computing');
    });

    it('should return demo response when API key is dummy', async () => {
      // Mock env to have dummy key
      const originalEnv = process.env.OPENAI_API_KEY;
      process.env.OPENAI_API_KEY = 'dummy-key';

      const result = await processQuestion('What is AI?', 'science');

      expect(result).toContain('[Demo Mode]');
      expect(result).toContain('artificial intelligence');
      expect(mockOpenAI.chat.completions.create).not.toHaveBeenCalled();

      // Restore env
      process.env.OPENAI_API_KEY = originalEnv;
    });

    it('should handle empty topic gracefully', async () => {
      const mockResponse = {
        choices: [{
          message: {
            content: 'Response without specific topic'
          }
        }]
      };

      mockOpenAI.chat.completions.create.mockResolvedValue(mockResponse);

      const result = await processQuestion('General question', '');

      expect(mockOpenAI.chat.completions.create).toHaveBeenCalledWith({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: expect.stringContaining('educational AI assistant')
          },
          {
            role: 'user',
            content: 'Topic: general\nQuestion: General question'
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      });

      expect(result).toBe('Response without specific topic');
    });

    it('should handle OpenAI response with no choices', async () => {
      const mockResponse = {
        choices: []
      };

      mockOpenAI.chat.completions.create.mockResolvedValue(mockResponse);

      const result = await processQuestion('Test question', 'math');

      expect(result).toContain('I\'m currently unable to process your question');
    });

    it('should use fallback for specific error types', async () => {
      const rateLimitError = new Error('Rate limit exceeded');
      (rateLimitError as any).status = 429;
      
      mockOpenAI.chat.completions.create.mockRejectedValue(rateLimitError);

      const result = await processQuestion('What is calculus?', 'math');

      expect(result).toContain('I\'m currently unable to process your question');
      expect(result).toContain('calculus');
    });
  });
});