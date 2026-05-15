// ═══════════════════════════════════════════════════════════════
// USE CASE: UpdateTodoUseCase
// ═══════════════════════════════════════════════════════════════
//
// Updates a todo — but ONLY if it belongs to the logged-in user.
// This is called "Authorization" — checking if the user has
// PERMISSION to perform the action (different from Authentication).
//
// Authentication = "Who are you?" (JWT token)
// Authorization  = "Are you allowed to do this?" (ownership check)
// ═══════════════════════════════════════════════════════════════

import { ITodoRepository } from '@domain/repositories/todos/ITodoRepository';
import { NotFoundError } from '@domain/errors/NotFoundError';
import { DomainError } from '@domain/errors/DomainError';
import { UpdateTodoDTO } from '@application/dto/todos/UpdateTodoDTO';
import { Todo } from '@domain/entities/todos/Todo';

export class UpdateTodoUseCase {
  constructor(private readonly todoRepository: ITodoRepository) {}

  async execute(
    todoId: string,
    dto: UpdateTodoDTO,
    userId: string
  ): Promise<Todo> {
    // ── Step 1: Find the todo ──
    const existingTodo = await this.todoRepository.findById(todoId);

    if (!existingTodo) {
      throw new NotFoundError('Todo', todoId);
    }

    // ── Step 2: Authorization check — does this todo belong to the user? ──
    if (!existingTodo.belongsTo(userId)) {
      // 403 = Forbidden — you're authenticated but not authorized
      throw new DomainError('You are not authorized to update this todo', 403);
    }

    // ── Step 3: Update the todo ──
    const updatedTodo = await this.todoRepository.update(todoId, {
      title: dto.title,
      description: dto.description,
      completed: dto.completed,
      priority: dto.priority as any,
    });

    if (!updatedTodo) {
      throw new NotFoundError('Todo', todoId);
    }

    return updatedTodo;
  }
}
