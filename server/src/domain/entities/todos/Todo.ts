// ═══════════════════════════════════════════════════════════════
// DOMAIN ENTITY: Todo
// ═══════════════════════════════════════════════════════════════
//
// The core entity of our app — a Todo item!
//
// KEY CONCEPTS:
// 1. Each todo BELONGS to a user (userId) — user isolation
// 2. Business methods live HERE (markComplete, markIncomplete, belongsTo)
// 3. The entity validates itself — no invalid todos can exist
//
// This is "Rich Domain Model" — the entity has behavior, not just data.
// The opposite is "Anemic Domain Model" where entities are just data bags.
// Rich models are preferred in DDD (Domain-Driven Design).
// ═══════════════════════════════════════════════════════════════

import { ValidationError } from '../../errors/ValidationError';

/**
 * Priority levels for todos.
 * Helps users organize their work.
 */
export enum TodoPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export interface TodoProps {
  id?: string;
  title: string;
  description?: string;
  completed?: boolean;
  priority?: TodoPriority;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Todo {
  public readonly id: string;
  public readonly title: string;
  public readonly description: string;
  public readonly completed: boolean;
  public readonly priority: TodoPriority;
  public readonly userId: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  private constructor(props: TodoProps) {
    this.id = props.id || '';
    this.title = props.title;
    this.description = props.description || '';
    this.completed = props.completed || false;
    this.priority = props.priority || TodoPriority.MEDIUM;
    this.userId = props.userId;
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
  }

  /**
   * Factory method with validation.
   */
  static create(props: TodoProps): Todo {
    if (!props.title || props.title.trim().length === 0) {
      throw new ValidationError('Todo title is required');
    }

    if (props.title.trim().length > 200) {
      throw new ValidationError('Todo title must be less than 200 characters');
    }

    if (!props.userId) {
      throw new ValidationError('Todo must belong to a user');
    }

    return new Todo(props);
  }

  // ─── BUSINESS METHODS ─────────────────────────────────
  // These methods represent business operations on a Todo.
  // They return NEW Todo instances (immutability).

  /**
   * Mark this todo as completed.
   * Returns a NEW Todo (immutability pattern).
   *
   * WHY IMMUTABILITY?
   * Instead of changing the existing object, we create a new one.
   * This prevents accidental side effects and makes code predictable.
   */
  markComplete(): Todo {
    return Todo.create({
      ...this.toProps(),
      completed: true,
      updatedAt: new Date(),
    });
  }

  /**
   * Mark this todo as incomplete.
   */
  markIncomplete(): Todo {
    return Todo.create({
      ...this.toProps(),
      completed: false,
      updatedAt: new Date(),
    });
  }

  /**
   * Check if this todo belongs to a specific user.
   * Used to prevent User A from accessing User B's todos.
   */
  belongsTo(userId: string): boolean {
    return this.userId === userId;
  }

  /**
   * Convert to props (useful for creating modified copies).
   */
  private toProps(): TodoProps {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      completed: this.completed,
      priority: this.priority,
      userId: this.userId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  /**
   * Convert to plain object for API responses.
   */
  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      completed: this.completed,
      priority: this.priority,
      userId: this.userId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
