// ═══════════════════════════════════════════════════════════════
// REPOSITORY IMPLEMENTATION: InMemoryUserRepository
// ═══════════════════════════════════════════════════════════════
//
// In-memory implementation of IUserRepository for LOCAL TESTING.
// Stores users in a Map (JavaScript's built-in hash map).
// Data is lost when the server restarts — that's fine for testing!
//
// This is the POWER of Clean Architecture:
// We swap MongoUserRepository → InMemoryUserRepository
// and NOTHING else in the app needs to change!
// ═══════════════════════════════════════════════════════════════

import { IUserRepository } from '@domain/repositories/auth/IUserRepository';
import { User, UserRole } from '@domain/entities/auth/User';
import { v4 as uuidv4 } from 'crypto';

export class InMemoryUserRepository implements IUserRepository {
  // In-memory store: Map<id, userData>
  private users: Map<string, {
    id: string;
    name: string;
    email: string;
    passwordHash: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
  }> = new Map();

  async findById(id: string): Promise<User | null> {
    const data = this.users.get(id);
    if (!data) return null;
    return this.toDomainEntity(data);
  }

  async findByEmail(email: string): Promise<User | null> {
    const normalizedEmail = email.toLowerCase();
    for (const data of this.users.values()) {
      if (data.email === normalizedEmail) {
        return this.toDomainEntity(data);
      }
    }
    return null;
  }

  async create(user: User): Promise<User> {
    const id = randomId();
    const data = {
      id,
      name: user.name,
      email: user.email.value,
      passwordHash: user.passwordHash.value,
      role: user.role,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(id, data);
    return this.toDomainEntity(data);
  }

  async update(id: string, data: Partial<User>): Promise<User | null> {
    const existing = this.users.get(id);
    if (!existing) return null;

    const updated = {
      ...existing,
      ...(data.name !== undefined && { name: data.name }),
      ...(data.email !== undefined && { email: data.email.value }),
      ...(data.passwordHash !== undefined && { passwordHash: data.passwordHash.value }),
      ...(data.role !== undefined && { role: data.role }),
      updatedAt: new Date(),
    };
    this.users.set(id, updated);
    return this.toDomainEntity(updated);
  }

  async delete(id: string): Promise<boolean> {
    return this.users.delete(id);
  }

  private toDomainEntity(data: any): User {
    return User.create({
      id: data.id,
      name: data.name,
      email: data.email,
      passwordHash: data.passwordHash,
      role: data.role as UserRole,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }
}

// Simple unique ID generator (no external dependency needed)
function randomId(): string {
  return crypto.randomUUID();
}
