// Auth Middleware — verifies JWT token on protected routes
import { Request, Response, NextFunction } from 'express';
import { container } from '@infrastructure/di/container';
import { DomainError } from '@domain/errors/DomainError';

export function authMiddleware(req: Request, _res: Response, next: NextFunction): void {
  try {
    // Extract token from "Authorization: Bearer <token>"
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new DomainError('No token provided — please login', 401);
    }

    // "Bearer eyJhbGci..." → "eyJhbGci..."
    const token = authHeader.split(' ')[1];

    // Verify and decode the token
    const payload = container.tokenProvider.verify(token);

    // Attach user info to the request object
    // Now every controller can access req.user.userId
    req.user = payload;

    next();
  } catch (error) {
    next(error);
  }
}
