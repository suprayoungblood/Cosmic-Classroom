import { Request, Response } from 'express';
import { getAIResponse } from '../services/openaiService';

export const askQuestion = async (req: Request, res: Response) => {
  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    console.log('Received question:', question);
    const answer = await getAIResponse(question);
    console.log('AI response:', answer);

    res.json({ answer });
  } catch (error) {
    console.error('Error in askQuestion:', error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
};
