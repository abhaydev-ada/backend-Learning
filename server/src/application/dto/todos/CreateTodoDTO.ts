// ═══════════════════════════════════════════════════════════════
// DTO: CreateTodoDTO
// ═══════════════════════════════════════════════════════════════

export interface CreateTodoDTO {
  title: string;
  description?: string;       // Optional — not all todos need descriptions
  priority?: 'low' | 'medium' | 'high';  // Optional — defaults to 'medium'
}
