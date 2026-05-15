// ═══════════════════════════════════════════════════════════════
// VALUE OBJECT: UUID
// ═══════════════════════════════════════════════════════════════
//
// WHY THIS EXISTS:
// IDs are strings, but not all strings are IDs.
// Wrapping IDs in a UUID type prevents you from accidentally passing
// a user's name where their ID is expected.
//
// Example of a bug this prevents:
//   findUser(userId)    // ✅ Correct
//   findUser(userName)  // ❌ Without UUID type, this compiles but is wrong!
//   findUser(userName)  // ✅ With UUID type, TypeScript catches this mistake
// ═══════════════════════════════════════════════════════════════

export class UUID {
  public readonly value: string;

  private constructor(id: string) {
    this.value = id;
  }

  /**
   * Create a UUID from a string (e.g., MongoDB's _id.toString())
   */
  static create(id: string): UUID {
    return new UUID(id);
  }

  equals(other: UUID): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
