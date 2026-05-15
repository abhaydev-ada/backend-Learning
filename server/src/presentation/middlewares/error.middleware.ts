// Global Error Handler Middleware
// Catches ALL errors and returns consistent JSON response.
import { Request, Response, NextFunction } from 'express';
import { DomainError } from '@domain/errors/DomainError';
import { logger } from '@shared/utils/logger';

export function errorMiddleware(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // If it's our custom DomainError, use its statusCode
  if (err instanceof DomainError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(('errors' in err) ? { errors: (err as any).errors } : {}),
    });
    return;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: err.message,
    });
    return;
  }

  // Mongoose duplicate key error (e.g., duplicate email)
  if ((err as any).code === 11000) {
    res.status(409).json({
      success: false,
      message: 'Duplicate value — this resource already exists',
    });
    return;
  }

  // Unknown error — log it and return generic message
  logger.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
}
