// Todos Controller — handles HTTP requests for todo endpoints
import { Request, Response, NextFunction } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { container } from '@infrastructure/di/container';
import { ResponseTransformer } from '@presentation/transformers/response.transformer';
import { HTTP_STATUS } from '@shared/constants/http';
import { parsePagination } from '@shared/utils/pagination';

export class TodosController {
  // GET /api/todos
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit } = parsePagination(req.query);
      const result = await container.getTodosUseCase.execute(
        req.user!.userId,
        { page, limit }
      );
      res.status(HTTP_STATUS.OK).json(
        ResponseTransformer.paginated(
          result.data.map((t) => t.toJSON()),
          result.total,
          result.page,
          result.limit,
          'Todos retrieved'
        )
      );
    } catch (error) {
      next(error);
    }
  }

  // POST /api/todos
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const todo = await container.createTodoUseCase.execute(
        req.body,
        req.user!.userId
      );
      res.status(HTTP_STATUS.CREATED).json(
        ResponseTransformer.success(todo.toJSON(), 'Todo created successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/todos/:id
  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const todoId = req.params.id as string;
      const todo = await container.updateTodoUseCase.execute(
        todoId,
        req.body,
        req.user!.userId
      );
      res.status(HTTP_STATUS.OK).json(
        ResponseTransformer.success(todo.toJSON(), 'Todo updated successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  // DELETE /api/todos/:id
  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const todoId = req.params.id as string;
      await container.deleteTodoUseCase.execute(
        todoId,
        req.user!.userId
      );
      res.status(HTTP_STATUS.OK).json(
        ResponseTransformer.success(null, 'Todo deleted successfully')
      );
    } catch (error) {
      next(error);
    }
  }
}
