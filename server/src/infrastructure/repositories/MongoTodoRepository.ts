// ═══════════════════════════════════════════════════════════════
// REPOSITORY IMPLEMENTATION: MongoTodoRepository
// ═══════════════════════════════════════════════════════════════

import { ITodoRepository, PaginatedResult, PaginationOptions } from '@domain/repositories/todos/ITodoRepository';
import { Todo, TodoPriority } from '@domain/entities/todos/Todo';
import { TodoModel } from '@infrastructure/database/mongoose/schemas/TodoSchema';

export class MongoTodoRepository implements ITodoRepository {
  async findById(id: string): Promise<Todo | null> {
    const doc = await TodoModel.findById(id);
    if (!doc) return null;
    return this.toDomainEntity(doc);
  }

  /**
   * Find all todos for a specific user, with pagination.
   *
   * HOW PAGINATION WORKS:
   * Page 1, Limit 10 → skip 0, take 10  → items 1-10
   * Page 2, Limit 10 → skip 10, take 10 → items 11-20
   * Page 3, Limit 10 → skip 20, take 10 → items 21-30
   *
   * Formula: skip = (page - 1) * limit
   */
  async findAllByUserId(
    userId: string,
    options: PaginationOptions
  ): Promise<PaginatedResult<Todo>> {
    const { page, limit } = options;
    const skip = (page - 1) * limit;

    // Run both queries in parallel for performance
    // Promise.all() runs multiple async operations simultaneously
    const [docs, total] = await Promise.all([
      TodoModel
        .find({ userId })          // Filter by user
        .sort({ createdAt: -1 })   // Newest first (-1 = descending)
        .skip(skip)                 // Skip previous pages
        .limit(limit),             // Take only 'limit' items

      TodoModel.countDocuments({ userId }),  // Count total for this user
    ]);

    return {
      data: docs.map((doc) => this.toDomainEntity(doc)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async create(todo: Todo): Promise<Todo> {
    const doc = await TodoModel.create({
      title: todo.title,
      description: todo.description,
      completed: todo.completed,
      priority: todo.priority,
      userId: todo.userId,
    });

    return this.toDomainEntity(doc);
  }

  async update(id: string, data: Partial<Todo>): Promise<Todo | null> {
    // Build update object — only include defined fields
    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.completed !== undefined) updateData.completed = data.completed;
    if (data.priority !== undefined) updateData.priority = data.priority;

    const doc = await TodoModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!doc) return null;
    return this.toDomainEntity(doc);
  }

  async delete(id: string): Promise<boolean> {
    const result = await TodoModel.findByIdAndDelete(id);
    return result !== null;
  }

  /**
   * Convert Mongoose document → Domain entity.
   */
  private toDomainEntity(doc: any): Todo {
    return Todo.create({
      id: doc._id.toString(),
      title: doc.title,
      description: doc.description,
      completed: doc.completed,
      priority: doc.priority as TodoPriority,
      userId: doc.userId.toString(),
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }
}
