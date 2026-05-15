// ═══════════════════════════════════════════════════════════════
// USE CASE: SignupUseCase
// ═══════════════════════════════════════════════════════════════
//
// WHAT IS A USE CASE?
// A Use Case represents ONE specific thing a user can do.
// "Sign up for an account" → SignupUseCase
// "Create a todo" → CreateTodoUseCase
//
// RULES:
// 1. One use case = one action (Single Responsibility Principle)
// 2. Has a single public method: execute()
// 3. Receives dependencies through the CONSTRUCTOR (Dependency Injection)
// 4. Does NOT know about HTTP, Express, or any web framework
// 5. Orchestrates domain entities and infrastructure services
//
// THE SIGNUP FLOW:
// 1. Check if email is already taken
// 2. Hash the password (never store plain text!)
// 3. Create the User entity
// 4. Save to database via repository
// 5. Generate a JWT token
// 6. Return the user + token
// ═══════════════════════════════════════════════════════════════

import { User } from '@domain/entities/auth/User';
import { IUserRepository } from '@domain/repositories/auth/IUserRepository';
import { ValidationError } from '@domain/errors/ValidationError';
import { IHashProvider } from '@application/interfaces/providers/IHashProvider';
import { ITokenProvider } from '@application/interfaces/providers/ITokenProvider';
import { SignupDTO } from '@application/dto/auth/SignupDTO';

/**
 * What the use case returns after successful signup.
 */
export interface SignupResult {
  user: ReturnType<User['toJSON']>;  // User data (without password)
  token: string;                      // JWT token for authentication
}

export class SignupUseCase {
  /**
   * DEPENDENCY INJECTION (DI):
   * Instead of creating dependencies inside the class:
   *   ❌ this.repo = new MongoUserRepository()  // TIGHT coupling
   *
   * We RECEIVE them from outside:
   *   ✅ constructor(repo: IUserRepository)      // LOOSE coupling
   *
   * Benefits:
   * - Easy to test (pass mock repositories)
   * - Easy to swap implementations (Mongo → PostgreSQL)
   * - Each class focuses on its own job
   */
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly hashProvider: IHashProvider,
    private readonly tokenProvider: ITokenProvider
  ) {}

  /**
   * Execute the signup use case.
   *
   * @param dto - The signup data (name, email, password)
   * @returns The created user and their JWT token
   * @throws ValidationError if email is already taken
   */
  async execute(dto: SignupDTO): Promise<SignupResult> {
    // ── Step 1: Check if email is already registered ──
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new ValidationError('A user with this email already exists');
    }

    // ── Step 2: Validate password strength ──
    if (!dto.password || dto.password.length < 6) {
      throw new ValidationError('Password must be at least 6 characters');
    }

    // ── Step 3: Hash the password ──
    // NEVER store plain-text passwords!
    // "myPassword123" → "$2b$10$N9qo8uLOickGdKBJRCM..."
    const passwordHash = await this.hashProvider.hash(dto.password);

    // ── Step 4: Create the User entity ──
    // The entity validates itself (name, email format, etc.)
    const user = User.create({
      name: dto.name,
      email: dto.email,
      passwordHash: passwordHash,
    });

    // ── Step 5: Save to database ──
    const savedUser = await this.userRepository.create(user);

    // ── Step 6: Generate JWT token ──
    const token = this.tokenProvider.generate({
      userId: savedUser.id,
      role: savedUser.role,
    });

    // ── Step 7: Return user (without password) + token ──
    return {
      user: savedUser.toJSON(),
      token,
    };
  }
}
