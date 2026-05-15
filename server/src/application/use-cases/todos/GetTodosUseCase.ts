// ═══════════════════════════════════════════════════════════════
// USE CASE: GetTodosUseCase
// ═══════════════════════════════════════════════════════════════
//
// Returns all todos for the logged-in user with pagination.
//
// WHY PAGINATION?
// If a user has 10,000 todos, loading them all at once would be:
// 1. Slow (lots of data transfer)
// 2. Memory-heavy (server and client)
// 3. Bad UX (user can't see 10,000 items at once anyway)
//
// Instead, we load 10-20 at a time with page numbers.
// ═══════════════════════════════════════════════════════════════

import { ITodoRepository, PaginatedResult, PaginationOptions } from '@domain/repositories/todos/ITodoRepository';
import { Todo } from '@domain/entities/todos/Todo';

export class GetTodosUseCase {
  constructor(private readonly todoRepository: ITodoRepository) {}

  async execute(
    userId: string,
    options: PaginationOptions = { page: 1, limit: 10 }
  ): Promise<PaginatedResult<Todo>> {
    // Only fetch todos belonging to THIS user
    return await this.todoRepository.findAllByUserId(userId, options);
  }
}
