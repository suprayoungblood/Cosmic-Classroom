"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENV = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.ENV = {
    PORT: process.env.PORT || 3000,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY || 'dummy-key',
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY || 'dummy-key',
    DB_NAME: process.env.DB_NAME || 'cosmic_classroom',
    DB_USER: process.env.DB_USER || 'postgres',
    DB_PASSWORD: process.env.DB_PASSWORD || 'postgres',
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_PORT: parseInt(process.env.DB_PORT || '5432', 10),
    DB_DIALECT: 'postgres',
    JWT_SECRET: process.env.JWT_SECRET || 'default-jwt-secret-for-development',
    NODE_ENV: process.env.NODE_ENV || 'development'
};
// Only warn in development, don't throw error
if (!process.env.OPENAI_API_KEY) {
    console.warn('OPENAI_API_KEY is not set. AI features will not work properly.');
}
if (!process.env.JWT_SECRET && exports.ENV.NODE_ENV === 'production') {
    console.warn('JWT_SECRET is not set in production. This is a security risk.');
}
if (!process.env.DB_PASSWORD && exports.ENV.NODE_ENV === 'production') {
    console.warn('DB_PASSWORD is not set in production. Using default password is a security risk.');
}
