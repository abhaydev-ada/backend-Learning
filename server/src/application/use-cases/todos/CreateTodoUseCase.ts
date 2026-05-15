// ═══════════════════════════════════════════════════════════════
// USE CASE: CreateTodoUseCase
// ═══════════════════════════════════════════════════════════════
//
// Creates a new todo for the logged-in user.
// The userId comes from the auth middleware (JWT decoded).
// ═══════════════════════════════════════════════════════════════

import { Todo, TodoPriority } from '@domain/entities/todos/Todo';
import { ITodoRepository } from '@domain/repositories/todos/ITodoRepository';
import { CreateTodoDTO } from '@application/dto/todos/CreateTodoDTO';

export class CreateTodoUseCase {
  constructor(private readonly todoRepository: ITodoRepository) {}

  async execute(dto: CreateTodoDTO, userId: string): Promise<Todo> {
    // Create the Todo entity — it validates itself (title required, etc.)
    const todo = Todo.create({
      title: dto.title,
      description: dto.description,
      priority: (dto.priority as TodoPriority) || TodoPriority.MEDIUM,
      userId: userId,  // Link todo to the logged-in user
    });

    // Save to database and return the created todo
    return await this.todoRepository.create(todo);
  }
}
