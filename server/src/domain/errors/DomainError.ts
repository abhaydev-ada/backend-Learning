// ═══════════════════════════════════════════════════════════════
// DOMAIN ERROR — Base Error Class
// ═══════════════════════════════════════════════════════════════
//
// WHY THIS EXISTS:
// In Clean Architecture, the Domain layer defines its OWN errors.
// These are business errors, NOT HTTP errors.
// The Presentation layer later maps these to HTTP status codes.
//
// LEARNING NOTE:
// "extends Error" means DomainError IS an Error, but with extra properties.
// This is called INHERITANCE — a core OOP concept.
// ═══════════════════════════════════════════════════════════════

export class DomainError extends Error {
  /**
   * statusCode: The HTTP status code to return (used by error middleware)
   * isOperational: true = expected error (bad input, not found)
   *                false = unexpected error (database crash, bug)
   *
   * We handle operational errors gracefully.
   * Non-operational errors = something is seriously wrong.
   */
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    // Call the parent Error constructor with the message
    super(message);

    this.statusCode = statusCode;
    this.isOperational = isOperational;

    // This line preserves the correct class name in stack traces
    // Without it, error.constructor.name would be "Error" instead of "DomainError"
    Object.setPrototypeOf(this, new.target.prototype);

    // Captures where the error was thrown (useful for debugging)
    Error.captureStackTrace(this, this.constructor);
  }
}
