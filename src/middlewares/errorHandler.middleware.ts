import { Request, Response, NextFunction } from 'express';

function errorHandlerMiddleware(err: any, req: Request, res: Response, next: NextFunction) {
  console.error(err.stack);
  res.status(500).json({message: err.message});
}

export default errorHandlerMiddleware;