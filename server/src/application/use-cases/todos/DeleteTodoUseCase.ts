// ═══════════════════════════════════════════════════════════════
// USE CASE: DeleteTodoUseCase
// ═══════════════════════════════════════════════════════════════
//
// Deletes a todo — with the same ownership check as UpdateTodo.
// ═══════════════════════════════════════════════════════════════

import { ITodoRepository } from '@domain/repositories/todos/ITodoRepository';
import { NotFoundError } from '@domain/errors/NotFoundError';
import { DomainError } from '@domain/errors/DomainError';

export class DeleteTodoUseCase {
  constructor(private readonly todoRepository: ITodoRepository) {}

  async execute(todoId: string, userId: string): Promise<void> {
    // ── Step 1: Find the todo ──
    const existingTodo = await this.todoRepository.findById(todoId);

    if (!existingTodo) {
      throw new NotFoundError('Todo', todoId);
    }

    // ── Step 2: Authorization check ──
    if (!existingTodo.belongsTo(userId)) {
      throw new DomainError('You are not authorized to delete this todo', 403);
    }

    // ── Step 3: Delete ──
    await this.todoRepository.delete(todoId);
  }
}
