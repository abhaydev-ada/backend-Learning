import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { DomainError } from '@domain/errors/DomainError';

const createTodoSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(1000).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
});

const updateTodoSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional(),
  completed: z.boolean().optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
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

export const validateCreateTodo = validate(createTodoSchema);
export const validateUpdateTodo = validate(updateTodoSchema);
