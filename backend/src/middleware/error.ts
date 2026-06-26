import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error caught by middleware:', err);

  // Check if it's a Kubernetes API error
  if (err.response && err.response.statusCode) {
    return res.status(err.response.statusCode).json({
      error: 'Kubernetes API Error',
      message: err.response.body?.message || err.message,
      details: err.response.body,
    });
  }

  // Default server error
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: err.name || 'Internal Server Error',
    message: err.message || 'An unexpected error occurred',
  });
};
