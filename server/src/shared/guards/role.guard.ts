// Role Guard — middleware to check user roles
import { Request, Response, NextFunction } from 'express';
import { DomainError } from '@domain/errors/DomainError';

export function roleGuard(...allowedRoles: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new DomainError('Authentication required', 401);
    }
    if (!allowedRoles.includes(req.user.role)) {
      throw new DomainError('Insufficient permissions', 403);
    }
    next();
  };
}
