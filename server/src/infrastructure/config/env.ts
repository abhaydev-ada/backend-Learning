// ═══════════════════════════════════════════════════════════════
// INFRASTRUCTURE CONFIG: Environment Variables
// ═══════════════════════════════════════════════════════════════
//
// WHY ZOD FOR ENV VARS?
// Environment variables are strings from the OS. Without validation:
//   - Missing MONGO_URI → app crashes at runtime with a confusing error
//   - Wrong PORT type → subtle bugs
//
// With Zod validation:
//   - App fails FAST at startup with a CLEAR error message
//   - All env vars are typed (PORT is a number, not a string)
//   - Default values are documented in one place
//
// This is called "Fail Fast" — catch problems BEFORE they cause damage.
// ═══════════════════════════════════════════════════════════════

import dotenv from 'dotenv';
import { z } from 'zod';

// Load .env file into process.env
dotenv.config();

/**
 * Define the SCHEMA for environment variables.
 * Each variable is validated — if it's missing or wrong type, app won't start.
 */
const envSchema = z.object({
  // Server
  PORT: z
    .string()
    .default('5000')
    .transform(Number),  // Convert string "5000" → number 5000

  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),

  // Storage Mode
  // Set to 'true' to use in-memory storage (no MongoDB required)
  USE_MEMORY_DB: z
    .string()
    .default('false')
    .transform((val) => val === 'true'),

  // MongoDB (optional when USE_MEMORY_DB=true)
  MONGO_URI: z
    .string()
    .default(''),

  // JWT
  JWT_SECRET: z
    .string()
    .min(10, 'JWT_SECRET must be at least 10 characters for security'),

  JWT_EXPIRES_IN: z
    .string()
    .default('30d'),

  // Bcrypt
  BCRYPT_SALT_ROUNDS: z
    .string()
    .default('10')
    .transform(Number),
});

/**
 * Parse and validate environment variables.
 * If validation fails, the app will NOT start — and you'll see exactly what's wrong.
 */
const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:');
  console.error(parsed.error.format());
  process.exit(1);  // Exit immediately — don't start with bad config
}

/**
 * Export typed env object.
 * Now you can use: env.PORT (number), env.MONGO_URI (string), etc.
 * TypeScript knows the EXACT type of each variable!
 */
export const env = parsed.data;
