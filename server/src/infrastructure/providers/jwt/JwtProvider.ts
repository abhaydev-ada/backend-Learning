import jwt from 'jsonwebtoken';
import { ITokenProvider, TokenPayload } from '@application/interfaces/providers/ITokenProvider';
import { env } from '@infrastructure/config/env';
import { DomainError } from '@domain/errors/DomainError';

export class JwtProvider implements ITokenProvider {
  generate(payload: TokenPayload): string {
    return jwt.sign(
      {
        userId: payload.userId,
        role: payload.role,
      },
      env.JWT_SECRET,
      {
        expiresIn: env.JWT_EXPIRES_IN as any,
      }
    );
  }

  verify(token: string): TokenPayload {
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as any;
      return {
        userId: decoded.userId,
        role: decoded.role,
      };
    } catch (error: any) {
      if (error.name === 'TokenExpiredError') {
        throw new DomainError('Token has expired — please login again', 401);
      }
      if (error.name === 'JsonWebTokenError') {
        throw new DomainError('Invalid token — please login again', 401);
      }
      throw new DomainError('Token verification failed', 401);
    }
  }
}
