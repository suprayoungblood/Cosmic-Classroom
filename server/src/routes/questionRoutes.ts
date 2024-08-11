import express from 'express';
import { askQuestion } from '../controllers/questionController';

const questionRoutes = express.Router();

questionRoutes.post('/ask', askQuestion);

export default questionRoutes;