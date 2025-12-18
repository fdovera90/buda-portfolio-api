import { Request, Response, NextFunction } from 'express';

export class HttpError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

export function errorHandler(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (error instanceof HttpError) {
    return res.status(error.statusCode).json({
      error: error.message
    });
  }

  console.error(error);

  return res.status(500).json({
    error: 'Internal server error'
  });
}
