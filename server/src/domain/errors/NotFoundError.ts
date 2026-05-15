// ═══════════════════════════════════════════════════════════════
// NOT FOUND ERROR
// ═══════════════════════════════════════════════════════════════
//
// Thrown when a resource doesn't exist in the database.
// Example: "User with ID abc123 not found"
//
// This maps to HTTP 404 in the presentation layer.
// ═══════════════════════════════════════════════════════════════

import { DomainError } from './DomainError';

export class NotFoundError extends DomainError {
  constructor(entity: string, identifier?: string) {
    // Build a helpful error message
    // e.g., "User not found" or "Todo with id abc123 not found"
    const message = identifier
      ? `${entity} with id ${identifier} not found`
      : `${entity} not found`;

    // 404 = Not Found
    super(message, 404);
  }
}
