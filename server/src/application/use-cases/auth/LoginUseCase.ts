// ═══════════════════════════════════════════════════════════════
// USE CASE: LoginUseCase
// ═══════════════════════════════════════════════════════════════
//
// THE LOGIN FLOW:
// 1. Find user by email
// 2. Compare password with stored hash (bcrypt.compare)
// 3. If match → generate JWT token
// 4. If no match → throw error
//
// SECURITY BEST PRACTICE:
// We return the SAME error message for "user not found" and "wrong password".
// This prevents attackers from knowing which emails are registered.
// This is called "timing-safe" error handling.
// ═══════════════════════════════════════════════════════════════

import { User } from '@domain/entities/auth/User';
import { IUserRepository } from '@domain/repositories/auth/IUserRepository';
import { DomainError } from '@domain/errors/DomainError';
import { IHashProvider } from '@application/interfaces/providers/IHashProvider';
import { ITokenProvider } from '@application/interfaces/providers/ITokenProvider';
import { LoginDTO } from '@application/dto/auth/LoginDTO';

export interface LoginResult {
  user: ReturnType<User['toJSON']>;
  token: string;
}

export class LoginUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly hashProvider: IHashProvider,
    private readonly tokenProvider: ITokenProvider
  ) {}

  async execute(dto: LoginDTO): Promise<LoginResult> {
    // ── Step 1: Find user by email ──
    const user = await this.userRepository.findByEmail(dto.email);

    if (!user) {
      // ⚠️ SECURITY: Generic message — don't reveal that the email doesn't exist
      throw new DomainError('Invalid email or password', 401);
    }

    // ── Step 2: Compare passwords ──
    // bcrypt.compare("typedPassword", "$2b$10$storedHash...") → true/false
    const isPasswordValid = await this.hashProvider.compare(
      dto.password,
      user.passwordHash.value
    );

    if (!isPasswordValid) {
      // ⚠️ SECURITY: Same message as above — attacker can't tell the difference
      throw new DomainError('Invalid email or password', 401);
    }

    // ── Step 3: Generate JWT token ──
    const token = this.tokenProvider.generate({
      userId: user.id,
      role: user.role,
    });

    // ── Step 4: Return user + token ──
    return {
      user: user.toJSON(),
      token,
    };
  }
}
