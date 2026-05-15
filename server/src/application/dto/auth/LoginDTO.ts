// ═══════════════════════════════════════════════════════════════
// DTO: LoginDTO
// ═══════════════════════════════════════════════════════════════

export interface LoginDTO {
  email: string;
  password: string;  // Plain text — will be compared against hash
}
