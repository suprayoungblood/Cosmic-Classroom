import OpenAI from 'openai';
import { ENV } from '../config/env';

// Create a fallback mechanism that always works
const getFallbackResponse = (question: string): string => {
  const fallbackResponses = [
    `Space is vast and contains countless celestial objects including stars, planets, galaxies, nebulae, and black holes. Our solar system is just a tiny part of the Milky Way galaxy, which itself is one of billions of galaxies in the observable universe.`,
    `Astronomers study space using various tools including telescopes that observe different wavelengths of light, from radio waves to gamma rays. The James Webb Space Telescope is the most advanced space telescope ever built.`,
    `Our solar system consists of the Sun, eight planets, dwarf planets, moons, asteroids, comets, and other objects. Earth is the third planet from the Sun and the only known place in the universe that harbors life.`,
    `Black holes are regions of spacetime where gravity is so strong that nothing, not even light, can escape once it passes the event horizon. They form when massive stars collapse at the end of their life cycles.`,
    `The universe began approximately 13.8 billion years ago with the Big Bang. Since then, it has been expanding and cooling. Galaxies began forming a few hundred million years after the Big Bang.`
  ];
  
  // Return a random fallback response
  const randomIndex = Math.floor(Math.random() * fallbackResponses.length);
  return `I don't have specific information about "${question}" but here's something about space: ${fallbackResponses[randomIndex]}`;
};

// Create OpenAI client
let openai: OpenAI | null = null;

if (ENV.OPENAI_API_KEY) {
  openai = new OpenAI({ 
    apiKey: ENV.OPENAI_API_KEY
  });
  console.log('OpenAI API configured successfully');
} else {
  console.warn('WARNING: No OpenAI API key. Switching to fallback responses mode.');
}

// System prompt for space context
const SYSTEM_PROMPT = `You are a knowledgeable and friendly AI assistant for a space education app called Cosmic Classroom. 
Your purpose is to educate users about astronomy, space exploration, and cosmic phenomena.

When answering questions:
- Provide accurate, scientifically sound information about space and astronomy
- Use an engaging, conversational tone appropriate for all ages
- Include fascinating facts that inspire curiosity about the cosmos
- Be concise but informative, with explanations that are easy to understand
- When addressing complex topics, break them down into accessible concepts
- For questions outside your knowledge, acknowledge limitations rather than inventing information
- Focus on educational value while maintaining an enthusiastic tone about space science`;

export const getAnswerForQuestion = async (question: string): Promise<string> => {
  try {
    if (!openai) {
      console.log('No OpenAI API key available. Using fallback response for question:', question);
      return getFallbackResponse(question);
    }
    
    console.log('Using OpenAI API for question:', question);
    
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {"role": "system", "content": SYSTEM_PROMPT},
          {"role": "user", "content": question}
        ],
        max_tokens: 500
      });

      // Validate response before returning
      if (!response || !response.choices || response.choices.length === 0) {
        console.error('Empty or invalid response from OpenAI');
        return getFallbackResponse(question);
      }
      
      const content = response.choices[0].message.content;
      if (!content) {
        console.error('Empty content in OpenAI response');
        return getFallbackResponse(question);
      }
      
      return content;
    } catch (err: any) {
      console.error('Error with OpenAI API:', err);
      return getFallbackResponse(question);
    }
  } catch (error) {
    console.error('Error in AI service:', error);
    return getFallbackResponse(question);
  }
};

export default {
  getAnswerForQuestion
};