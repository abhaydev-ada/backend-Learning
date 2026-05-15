// ═══════════════════════════════════════════════════════════════
// REPOSITORY IMPLEMENTATION: MongoUserRepository
// ═══════════════════════════════════════════════════════════════
//
// THIS IS WHERE THE MAGIC OF CLEAN ARCHITECTURE HAPPENS!
//
// The domain layer DEFINED the interface (IUserRepository):
//   "I need findById, findByEmail, create, update, delete"
//
// This file IMPLEMENTS that interface using MongoDB/Mongoose:
//   "Here's HOW to do findById using Mongoose"
//
// KEY RESPONSIBILITY:
// Convert between Mongoose Documents ↔ Domain Entities
// The rest of the app only knows about Domain Entities.
// ═══════════════════════════════════════════════════════════════

import { IUserRepository } from '@domain/repositories/auth/IUserRepository';
import { User, UserRole } from '@domain/entities/auth/User';
import { UserModel } from '@infrastructure/database/mongoose/schemas/UserSchema';

export class MongoUserRepository implements IUserRepository {
  /**
   * Find a user by their MongoDB _id.
   *
   * FLOW: MongoDB Document → Domain Entity
   * The controller/use case never sees Mongoose documents.
   */
  async findById(id: string): Promise<User | null> {
    // Find user and INCLUDE passwordHash (it's excluded by default in schema)
    const doc = await UserModel.findById(id).select('+passwordHash');

    if (!doc) return null;

    // Convert Mongoose document → Domain entity
    return this.toDomainEntity(doc);
  }

  /**
   * Find a user by email.
   * Used during login — we need the password hash to compare.
   */
  async findByEmail(email: string): Promise<User | null> {
    const doc = await UserModel.findOne({ email: email.toLowerCase() })
      .select('+passwordHash');  // Include password hash for login comparison

    if (!doc) return null;

    return this.toDomainEntity(doc);
  }

  /**
   * Create a new user in MongoDB.
   *
   * FLOW: Domain Entity → Mongoose Document → Save → Domain Entity
   */
  async create(user: User): Promise<User> {
    const doc = await UserModel.create({
      name: user.name,
      email: user.email.value,         // Email is a Value Object → extract .value
      passwordHash: user.passwordHash.value,  // Same for PasswordHash
      role: user.role,
    });

    return this.toDomainEntity(doc);
  }

  /**
   * Update an existing user.
   */
  async update(id: string, data: Partial<User>): Promise<User | null> {
    const doc = await UserModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }  // 'new: true' returns the UPDATED document
    ).select('+passwordHash');

    if (!doc) return null;

    return this.toDomainEntity(doc);
  }

  /**
   * Delete a user.
   */
  async delete(id: string): Promise<boolean> {
    const result = await UserModel.findByIdAndDelete(id);
    return result !== null;
  }

  // ─── PRIVATE HELPER ───────────────────────────────────
  /**
   * Convert a Mongoose document to a Domain entity.
   *
   * WHY THIS METHOD?
   * The Domain layer should NEVER see Mongoose-specific things
   * like _id, __v, .save(), .populate(), etc.
   * We convert to a clean Domain entity that only has business properties.
   */
  private toDomainEntity(doc: any): User {
    return User.create({
      id: doc._id.toString(),
      name: doc.name,
      email: doc.email,
      passwordHash: doc.passwordHash || '',
      role: doc.role as UserRole,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }
}
