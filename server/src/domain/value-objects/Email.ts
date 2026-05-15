// ═══════════════════════════════════════════════════════════════
// VALUE OBJECT: Email
// ═══════════════════════════════════════════════════════════════
//
// WHAT IS A VALUE OBJECT?
// A Value Object is a small, immutable object that represents a concept.
// Unlike an Entity (which has an ID), a Value Object is defined by its VALUE.
//
// Two Email objects with the same address are considered EQUAL,
// even if they are different instances.
//
// WHY USE IT?
// Instead of passing `string` everywhere and hoping it's a valid email,
// we use `Email` type. If you have an `Email` object, it's GUARANTEED
// to be valid — validation happens in the constructor.
//
// This is called "Making Illegal States Unrepresentable"
// ═══════════════════════════════════════════════════════════════

import { ValidationError } from '../errors/ValidationError';

export class Email {
  // 'readonly' means this can never be changed after creation (IMMUTABLE)
  public readonly value: string;

  /**
   * Private constructor — you can't do `new Email("test@test.com")` directly.
   * You MUST use `Email.create()` which validates first.
   * This pattern is called a "Factory Method".
   */
  private constructor(email: string) {
    this.value = email.toLowerCase().trim();
  }

  /**
   * Factory method — creates an Email only if it's valid.
   * If invalid, throws a ValidationError.
   *
   * Usage: const email = Email.create("user@example.com");
   */
  static create(email: string): Email {
    if (!email || email.trim().length === 0) {
      throw new ValidationError('Email is required');
    }

    // Simple email regex — checks for basic format: something@something.something
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new ValidationError('Invalid email format');
    }

    return new Email(email);
  }

  /**
   * Value Objects are compared by VALUE, not by reference.
   * Email("a@b.com") === Email("a@b.com") → true
   */
  equals(other: Email): boolean {
    return this.value === other.value;
  }

  /**
   * Returns the string representation
   */
  toString(): string {
    return this.value;
  }
}
