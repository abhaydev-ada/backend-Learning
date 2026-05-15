import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { DomainError } from '@domain/errors/DomainError';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(100),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

function validate(schema: z.ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const domainErr = new DomainError('Validation failed', 400);
        (domainErr as any).errors = error.issues.map((e: z.ZodIssue) => ({
          field: e.path.join('.'),
          message: e.message,
        }));
        next(domainErr);
        return;
      }
      next(error);
    }
  };
}

export const validateSignup = validate(signupSchema);
export const validateLogin = validate(loginSchema);
