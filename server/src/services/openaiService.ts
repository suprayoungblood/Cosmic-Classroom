import OpenAI from 'openai';
import { ENV } from '../config/env';

const openai = new OpenAI({
  apiKey: ENV.OPENAI_API_KEY,
});

export const getAIResponse = async (question: string): Promise<string> => {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {"role": "system", "content": "You are a helpful assistant for a space education app for kids."},
      {"role": "user", "content": question}
    ],
  });

  return response.choices[0].message.content || '';
};
