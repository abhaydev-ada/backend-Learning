// Auth Controller — handles HTTP requests for auth endpoints
import { Request, Response, NextFunction } from 'express';
import { container } from '@infrastructure/di/container';
import { ResponseTransformer } from '@presentation/transformers/response.transformer';
import { HTTP_STATUS } from '@shared/constants/http';

export class AuthController {
  // POST /api/auth/signup
  static async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await container.signupUseCase.execute(req.body);
      res.status(HTTP_STATUS.CREATED).json(
        ResponseTransformer.success(result, 'User registered successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  // POST /api/auth/login
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await container.loginUseCase.execute(req.body);
      res.status(HTTP_STATUS.OK).json(
        ResponseTransformer.success(result, 'Login successful')
      );
    } catch (error) {
      next(error);
    }
  }

  // GET /api/auth/me (protected)
  static async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await container.getMeUseCase.execute(req.user!.userId);
      res.status(HTTP_STATUS.OK).json(
        ResponseTransformer.success(user, 'User profile retrieved')
      );
    } catch (error) {
      next(error);
    }
  }
}
