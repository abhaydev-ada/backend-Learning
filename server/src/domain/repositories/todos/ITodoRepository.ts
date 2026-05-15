// ═══════════════════════════════════════════════════════════════
// REPOSITORY INTERFACE: ITodoRepository
// ═══════════════════════════════════════════════════════════════
//
// Contract for Todo data access.
// Notice: this interface knows nothing about MongoDB, SQL, or any database.
// It only knows about the Todo ENTITY from the domain layer.
// ═══════════════════════════════════════════════════════════════

import { Todo } from '../../entities/todos/Todo';

/**
 * Pagination options — used for listing todos.
 * In real apps with thousands of todos, you MUST paginate.
 */
export interface PaginationOptions {
  page: number;
  limit: number;
}

/**
 * Paginated result — wraps the data with metadata.
 */
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ITodoRepository {
  /**
   * Find a single todo by ID.
   */
  findById(id: string): Promise<Todo | null>;

  /**
   * Find ALL todos belonging to a specific user.
   * Returns paginated results.
   *
   * WHY userId parameter?
   * Each user can only see THEIR todos. This is called "data isolation"
   * or "multi-tenancy" — critical for any real application.
   */
  findAllByUserId(
    userId: string,
    options: PaginationOptions
  ): Promise<PaginatedResult<Todo>>;

  /**
   * Create a new todo.
   */
  create(todo: Todo): Promise<Todo>;

  /**
   * Update an existing todo.
   * 'Partial<Todo>' means you can update just some fields.
   */
  update(id: string, data: Partial<Todo>): Promise<Todo | null>;

  /**
   * Delete a todo by ID.
   */
  delete(id: string): Promise<boolean>;
}
