import { Request, Response, NextFunction } from 'express';

function notFoundMiddleware(req: Request, res: Response, next: NextFunction) {
  const error = new Error('Not Found');
  res.status(404).json({ message: error.message });
  return
}

export default notFoundMiddleware;