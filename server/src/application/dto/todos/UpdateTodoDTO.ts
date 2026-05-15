// ═══════════════════════════════════════════════════════════════
// DTO: UpdateTodoDTO
// ═══════════════════════════════════════════════════════════════
//
// All fields are optional because you might only want to update
// the title, or just toggle completion, without changing everything.
// This is called a "Partial Update" or "PATCH" in REST terms.
// ═══════════════════════════════════════════════════════════════

export interface UpdateTodoDTO {
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: 'low' | 'medium' | 'high';
}
