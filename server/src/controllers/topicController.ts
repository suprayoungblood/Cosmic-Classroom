import { Request, Response } from 'express';

export const getTopics = (req: Request, res: Response) => {
  const topics = ["Planets", "Stars", "Galaxies", "Space Exploration"];
  console.log('Sending topics:', topics);
  res.json(topics);
};
