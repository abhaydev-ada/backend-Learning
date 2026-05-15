// ═══════════════════════════════════════════════════════════════
// DOMAIN ENTITY: User
// ═══════════════════════════════════════════════════════════════
//
// WHAT IS AN ENTITY?
// An Entity is a domain object with a UNIQUE IDENTITY (ID).
// Two users with the same name are DIFFERENT users if they have different IDs.
// This is the opposite of Value Objects (which are compared by value).
//
// CLEAN ARCHITECTURE RULE:
// This file has ZERO dependencies on Express, Mongoose, or any framework.
// It's pure TypeScript — pure business logic.
// You could use this same User entity with PostgreSQL, Firebase, or anything.
//
// This is the CORE of your application. Everything else serves this layer.
// ═══════════════════════════════════════════════════════════════

import { Email } from '../../value-objects/Email';
import { PasswordHash } from '../../value-objects/PasswordHash';
import { ValidationError } from '../../errors/ValidationError';

/**
 * User roles — controls what a user can do.
 * In a real app you might have: admin, manager, user, viewer, etc.
 */
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

/**
 * Properties needed to create a User entity.
 * 'interface' defines the SHAPE of an object — like a blueprint.
 */
export interface UserProps {
  id?: string;
  name: string;
  email: string;
  passwordHash: string;
  role?: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * User Entity — represents a user in our system.
 *
 * Notice:
 * - All properties are 'readonly' — can only be set in the constructor
 * - Validation happens during creation — if a User exists, it's VALID
 * - No Mongoose, no Express — just pure TypeScript
 */
export class User {
  public readonly id: string;
  public readonly name: string;
  public readonly email: Email;
  public readonly passwordHash: PasswordHash;
  public readonly role: UserRole;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  private constructor(props: UserProps) {
    this.id = props.id || '';
    this.name = props.name;
    this.email = Email.create(props.email);
    this.passwordHash = PasswordHash.fromHash(props.passwordHash);
    this.role = props.role || UserRole.USER;
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
  }

  /**
   * Factory method — creates a User with validation.
   *
   * WHY A FACTORY METHOD?
   * 1. Validates data BEFORE creating the object
   * 2. Returns a consistent error if validation fails
   * 3. Ensures every User instance is in a valid state
   */
  static create(props: UserProps): User {
    // Validate name
    if (!props.name || props.name.trim().length === 0) {
      throw new ValidationError('User name is required');
    }

    if (props.name.trim().length < 2) {
      throw new ValidationError('User name must be at least 2 characters');
    }

    // Email validation happens inside Email.create()
    // Password hash validation — we just check it exists
    if (!props.passwordHash || props.passwordHash.length === 0) {
      throw new ValidationError('Password hash is required');
    }

    return new User(props);
  }

  /**
   * Convert to a plain object (useful for API responses).
   * Notice: we NEVER include the password hash in responses!
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email.value,
      role: this.role,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      // ⚠️ passwordHash is intentionally EXCLUDED
    };
  }
}
