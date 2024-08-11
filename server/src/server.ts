import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { ENV } from './config/env';
import questionRoutes from './routes/questionRoutes';
import topicRoutes from './routes/topicRoutes';
import errorHandler from './middlewares/errorHandler';

const app = express();

app.use(cors());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

app.use('/api', questionRoutes);
app.use('/api', topicRoutes);

app.use(errorHandler);

const PORT = ENV.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Keep the process running
process.on('SIGINT', () => {
  console.log('Server shutting down');
  process.exit(0);
});