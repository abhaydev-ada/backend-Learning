// Extend Express Request to include user from JWT
import { TokenPayload } from '@application/interfaces/providers/ITokenProvider';

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}
