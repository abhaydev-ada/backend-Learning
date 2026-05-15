// ═══════════════════════════════════════════════════════════════
// PROVIDER INTERFACE: ITokenProvider
// ═══════════════════════════════════════════════════════════════
//
// WHAT IS A PROVIDER?
// A Provider is an abstraction for an external service.
// ITokenProvider says "I need something that can generate and verify tokens"
// but it does NOT say HOW (JWT, Paseto, OAuth, etc.).
//
// The infrastructure layer provides the concrete implementation:
//   JwtProvider implements ITokenProvider → uses jsonwebtoken library
//
// WHY THIS PATTERN?
// If tomorrow you want to switch from JWT to Paseto tokens:
//   1. Create PasetoProvider that implements ITokenProvider
//   2. Change ONE line in the DI container
//   3. Done! No use case or controller changes needed.
// ═══════════════════════════════════════════════════════════════

/**
 * The data we store inside the token.
 * When a user logs in, we put their ID and role in the token.
 * Every protected request sends this token back, and we decode it.
 */
export interface TokenPayload {
  userId: string;
  role: string;
}

export interface ITokenProvider {
  /**
   * Generate a token from a payload.
   * Example: generate({ userId: "123", role: "user" }) → "eyJhbGciOi..."
   */
  generate(payload: TokenPayload): string;

  /**
   * Verify a token and extract the payload.
   * Throws an error if the token is invalid or expired.
   */
  verify(token: string): TokenPayload;
}
