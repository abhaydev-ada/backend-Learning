// ═══════════════════════════════════════════════════════════════
// VALIDATION ERROR
// ═══════════════════════════════════════════════════════════════
//
// Thrown when input data is invalid.
// Example: "Email format is invalid", "Password must be at least 6 characters"
//
// This maps to HTTP 400 (Bad Request) in the presentation layer.
// ═══════════════════════════════════════════════════════════════

import { DomainError } from './DomainError';

export class ValidationError extends DomainError {
  /**
   * errors: An optional array of specific field errors
   * Useful when multiple fields are invalid at once
   *
   * Example: [
   *   { field: 'email', message: 'Invalid email format' },
   *   { field: 'password', message: 'Must be at least 6 characters' }
   * ]
   */
  public readonly errors?: Array<{ field: string; message: string }>;

  constructor(
    message: string,
    errors?: Array<{ field: string; message: string }>
  ) {
    // 400 = Bad Request
    super(message, 400);
    this.errors = errors;
  }
}
