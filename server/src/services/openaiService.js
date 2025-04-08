"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAnswerForQuestion = void 0;
const openai_1 = __importDefault(require("openai"));
const env_1 = require("../config/env");
// Flag to determine if we're using OpenAI API
const useOpenAI = env_1.ENV.OPENAI_API_KEY !== 'dummy-key';
// Create OpenAI client instance if we have a real API key
const openai = useOpenAI ? new openai_1.default({ apiKey: env_1.ENV.OPENAI_API_KEY }) : null;
// Log what API we're using to help with debugging
console.log(`OpenAI API configured: ${useOpenAI ? 'Yes' : 'No (using fallback)'}`);
if (!useOpenAI) {
    console.warn('WARNING: OPENAI_API_KEY is not set or is set to dummy-key. AI features will use fallback responses.');
}
const getAnswerForQuestion = (question) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if we can use OpenAI
        if (useOpenAI && openai) {
            console.log('Using OpenAI API for question:', question);
            try {
                const response = yield openai.chat.completions.create({
                    model: "gpt-3.5-turbo",
                    messages: [
                        { "role": "system", "content": "You are a helpful assistant for a space education app for kids and space enthusiasts. Provide concise, accurate, and engaging answers about astronomy, space exploration, and cosmic phenomena." },
                        { "role": "user", "content": question }
                    ],
                    max_tokens: 500
                });
                // Validate response before returning
                if (!response || !response.choices || response.choices.length === 0) {
                    console.error('Empty or invalid response from OpenAI:', response);
                    throw new Error('Invalid response from AI service');
                }
                const content = response.choices[0].message.content;
                if (!content) {
                    console.error('Empty content in OpenAI response');
                    throw new Error('Empty response from AI service');
                }
                return content;
            }
            catch (err) {
                const openaiError = err;
                console.error('Error with OpenAI API:', openaiError);
                throw new Error(`OpenAI API error: ${openaiError.message}`);
            }
        }
        else {
            // If OpenAI API key not configured, use a fallback response
            console.log('Using fallback response for question:', question);
            return `I'm currently operating in fallback mode. Here's what I know about "${question}": Space is vast and contains countless celestial objects including stars, planets, galaxies, nebulae, and black holes. Our solar system is just a tiny part of the Milky Way galaxy, which itself is one of billions of galaxies in the observable universe.`;
        }
    }
    catch (error) {
        console.error('Error in AI service:', error);
        throw error;
    }
});
exports.getAnswerForQuestion = getAnswerForQuestion;
exports.default = {
    getAnswerForQuestion: exports.getAnswerForQuestion
};
