// ═══════════════════════════════════════════════════════════════
// APPLICATION SERVICE: AuthService
// ═══════════════════════════════════════════════════════════════
//
// WHY A SERVICE?
// Sometimes you have logic that doesn't fit in a single use case.
// AuthService combines multiple auth-related operations.
//
// In a larger app, this might handle:
// - Token refresh
// - Password reset
// - Email verification
// - Session management
//
// For now, it's a thin wrapper — but the pattern is here when you need it.
// ═══════════════════════════════════════════════════════════════

import { SignupUseCase } from '@application/use-cases/auth/SignupUseCase';
import { LoginUseCase } from '@application/use-cases/auth/LoginUseCase';
import { GetMeUseCase } from '@application/use-cases/auth/GetMeUseCase';
import { SignupDTO } from '@application/dto/auth/SignupDTO';
import { LoginDTO } from '@application/dto/auth/LoginDTO';

export class AuthService {
  constructor(
    private readonly signupUseCase: SignupUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly getMeUseCase: GetMeUseCase
  ) {}

  async signup(dto: SignupDTO) {
    return this.signupUseCase.execute(dto);
  }

  async login(dto: LoginDTO) {
    return this.loginUseCase.execute(dto);
  }

  async getMe(userId: string) {
    return this.getMeUseCase.execute(userId);
  }
}
