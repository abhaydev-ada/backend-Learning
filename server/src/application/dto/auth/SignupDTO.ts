// ═══════════════════════════════════════════════════════════════
// DTO: SignupDTO
// ═══════════════════════════════════════════════════════════════
//
// WHAT IS A DTO (Data Transfer Object)?
// A DTO is a plain object that carries data between layers.
// It defines the EXACT shape of data a use case needs.
//
// WHY NOT JUST USE 'req.body'?
// 1. req.body is 'any' — no type safety
// 2. req.body might have extra fields we don't want
// 3. The use case should NOT know about HTTP or Express
// 4. DTOs make the API contract explicit and documented
//
// Think of it as a FORM — these are the required fields.
// ═══════════════════════════════════════════════════════════════

export interface SignupDTO {
  name: string;
  email: string;
  password: string;  // Plain text — will be hashed in the use case
}
