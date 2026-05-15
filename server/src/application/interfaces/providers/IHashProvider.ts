// ═══════════════════════════════════════════════════════════════
// PROVIDER INTERFACE: IHashProvider
// ═══════════════════════════════════════════════════════════════
//
// Abstracts password hashing. Currently uses bcrypt, but could
// be swapped to argon2, scrypt, or any other hashing algorithm.
//
// KEY CONCEPT — One-Way Hashing:
//   "myPassword123" → "$2b$10$N9qo8uLOick..." (hash)
//   You can NOT reverse this! You can only COMPARE:
//   compare("myPassword123", "$2b$10$N9qo8uLOick...") → true
//   compare("wrongPassword", "$2b$10$N9qo8uLOick...") → false
// ═══════════════════════════════════════════════════════════════

export interface IHashProvider {
  /**
   * Hash a plain-text password.
   * Used during SIGNUP — we hash the password before saving.
   *
   * "myPassword" → "$2b$10$N9qo8uLOickGdKBJRCM..."
   */
  hash(plainText: string): Promise<string>;

  /**
   * Compare a plain-text password against a hash.
   * Used during LOGIN — we compare what the user typed vs what's in the DB.
   *
   * compare("myPassword", "$2b$10$N9qo8uLOick...") → true
   * compare("wrong",      "$2b$10$N9qo8uLOick...") → false
   */
  compare(plainText: string, hashed: string): Promise<boolean>;
}
