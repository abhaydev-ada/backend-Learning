// ═══════════════════════════════════════════════════════════════
// USE CASE: GetMeUseCase
// ═══════════════════════════════════════════════════════════════
//
// Returns the currently logged-in user's profile.
// The userId comes from the JWT token (decoded by auth middleware).
// ═══════════════════════════════════════════════════════════════

import { User } from '@domain/entities/auth/User';
import { IUserRepository } from '@domain/repositories/auth/IUserRepository';
import { NotFoundError } from '@domain/errors/NotFoundError';

export class GetMeUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(userId: string): Promise<ReturnType<User['toJSON']>> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundError('User', userId);
    }

    return user.toJSON();
  }
}
