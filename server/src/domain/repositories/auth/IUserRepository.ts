// ═══════════════════════════════════════════════════════════════
// REPOSITORY INTERFACE: IUserRepository
// ═══════════════════════════════════════════════════════════════
//
// WHAT IS A REPOSITORY?
// A Repository is a pattern that abstracts data access.
// It provides a clean API for storing and retrieving domain entities.
//
// WHAT IS AN INTERFACE?
// An interface is a CONTRACT. It says "whoever implements me MUST
// have these methods". It does NOT provide implementation.
//
// WHY INTERFACES?
// This is the POWER of Clean Architecture:
//   - Domain layer defines WHAT operations exist (this file)
//   - Infrastructure layer defines HOW they work (MongoUserRepository)
//   - If you switch from MongoDB to PostgreSQL, you only change
//     the infrastructure layer. Domain + Application stay the same!
//
// The "I" prefix is a naming convention meaning "Interface".
// ═══════════════════════════════════════════════════════════════

import { User } from '../../entities/auth/User';

export interface IUserRepository {
  /**
   * Find a user by their unique ID.
   * Returns null if not found (instead of throwing an error).
   */
  findById(id: string): Promise<User | null>;

  /**
   * Find a user by their email address.
   * Used during login to look up the user.
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * Save a new user to the database.
   * Returns the created user with their generated ID.
   */
  create(user: User): Promise<User>;

  /**
   * Update an existing user.
   * Returns the updated user.
   */
  update(id: string, data: Partial<User>): Promise<User | null>;

  /**
   * Delete a user by their ID.
   * Returns true if deleted, false if not found.
   */
  delete(id: string): Promise<boolean>;
}
