// ═══════════════════════════════════════════════════════════════
// REPOSITORY IMPLEMENTATION: InMemoryTodoRepository
// ═══════════════════════════════════════════════════════════════
//
// In-memory implementation of ITodoRepository for LOCAL TESTING.
// Stores todos in a Map — data is lost on server restart.
// ═══════════════════════════════════════════════════════════════

import { ITodoRepository, PaginatedResult, PaginationOptions } from '@domain/repositories/todos/ITodoRepository';
import { Todo, TodoPriority } from '@domain/entities/todos/Todo';

export class InMemoryTodoRepository implements ITodoRepository {
  // In-memory store: Map<id, todoData>
  private todos: Map<string, {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    priority: TodoPriority;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
  }> = new Map();

  async findById(id: string): Promise<Todo | null> {
    const data = this.todos.get(id);
    if (!data) return null;
    return this.toDomainEntity(data);
  }

  async findAllByUserId(
    userId: string,
    options: PaginationOptions
  ): Promise<PaginatedResult<Todo>> {
    const { page, limit } = options;
    const skip = (page - 1) * limit;

    // Get all todos for this user, sorted by createdAt descending
    const userTodos = Array.from(this.todos.values())
      .filter((t) => t.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const total = userTodos.length;
    const paginated = userTodos.slice(skip, skip + limit);

    return {
      data: paginated.map((doc) => this.toDomainEntity(doc)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async create(todo: Todo): Promise<Todo> {
    const id = crypto.randomUUID();
    const data = {
      id,
      title: todo.title,
      description: todo.description,
      completed: todo.completed,
      priority: todo.priority,
      userId: todo.userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.todos.set(id, data);
    return this.toDomainEntity(data);
  }

  async update(id: string, data: Partial<Todo>): Promise<Todo | null> {
    const existing = this.todos.get(id);
    if (!existing) return null;

    const updated = {
      ...existing,
      ...(data.title !== undefined && { title: data.title }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.completed !== undefined && { completed: data.completed }),
      ...(data.priority !== undefined && { priority: data.priority }),
      updatedAt: new Date(),
    };
    this.todos.set(id, updated);
    return this.toDomainEntity(updated);
  }

  async delete(id: string): Promise<boolean> {
    return this.todos.delete(id);
  }

  private toDomainEntity(data: any): Todo {
    return Todo.create({
      id: data.id,
      title: data.title,
      description: data.description,
      completed: data.completed,
      priority: data.priority as TodoPriority,
      userId: data.userId,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }
}
