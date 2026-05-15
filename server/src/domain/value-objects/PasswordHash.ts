// ═══════════════════════════════════════════════════════════════
// VALUE OBJECT: PasswordHash
// ═══════════════════════════════════════════════════════════════
//
// WHY THIS EXISTS:
// We NEVER store plain-text passwords. This type wraps a bcrypt hash
// so you can't accidentally pass a plain password where a hash is expected.
//
// TypeScript's type system makes this confusion IMPOSSIBLE:
//   function saveUser(hash: PasswordHash) { ... }
//   saveUser("plain-password")  // ❌ TypeScript ERROR
//   saveUser(PasswordHash.fromHash("$2b$..."))  // ✅ Works
//
// This is called "Type Safety" — the compiler protects you.
// ═══════════════════════════════════════════════════════════════

export class PasswordHash {
  public readonly value: string;

  private constructor(hash: string) {
    this.value = hash;
  }

  /**
   * Create a PasswordHash from an already-hashed string.
   * Used when reading from the database (passwords are stored as hashes).
   */
  static fromHash(hash: string): PasswordHash {
    return new PasswordHash(hash);
  }

  toString(): string {
    return this.value;
  }
}
