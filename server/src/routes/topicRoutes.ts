import express from 'express';
import { getTopics } from '../controllers/topicController';

const topicRoutes = express.Router();

topicRoutes.get('/topics', getTopics);

export default topicRoutes;