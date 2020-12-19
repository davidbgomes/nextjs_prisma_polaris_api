import express, { Request, Response } from 'express';

const router = express.Router();

router.get('/healthz', (_req: Request, res: Response) => {
  res.status(204).end();
});

router.get('/test', (req: Request, res: Response) => {
  const applicationID = req.body.applicationID;
  res.json({ applicationID });
});

export default router;
