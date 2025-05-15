import dotenv from 'dotenv';

dotenv.config();

export const ENV = {
  PORT: process.env.PORT || 3000,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || 'dummy-key',
  DB_NAME: process.env.DB_NAME || 'cosmic_classroom',
  DB_USER: process.env.DB_USER || 'postgres',
  DB_PASSWORD: process.env.DB_PASSWORD || 'postgres',
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: parseInt(process.env.DB_PORT || '5432', 10),
  DB_DIALECT: 'postgres',
  JWT_SECRET: process.env.JWT_SECRET || 'cosmic-classroom-dev-secret-key-2025-04-05',
  NODE_ENV: process.env.NODE_ENV || 'development'
};

// Log OpenAI API key status
if (ENV.OPENAI_API_KEY) {
  console.log('OpenAI API key provided');
} else {
  console.warn('No OpenAI API key found. AI features will use fallback responses.');
}

if (!process.env.JWT_SECRET && ENV.NODE_ENV === 'production') {
  console.warn('JWT_SECRET is not set in production. This is a security risk.');
}

if (!process.env.DB_PASSWORD && ENV.NODE_ENV === 'production') {
  console.warn('DB_PASSWORD is not set in production. Using default password is a security risk.');
}