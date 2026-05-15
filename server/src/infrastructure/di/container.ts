// DI CONTAINER — Composition Root
// Wires all dependencies together in ONE place.
//
// CLEAN ARCHITECTURE IN ACTION:
// When USE_MEMORY_DB=true, we swap MongoDB repos for in-memory repos.
// NOTHING else changes — use cases, services, controllers all work the same!

import { env } from '@infrastructure/config/env';
import { MongoUserRepository } from '@infrastructure/repositories/MongoUserRepository';
import { MongoTodoRepository } from '@infrastructure/repositories/MongoTodoRepository';
import { InMemoryUserRepository } from '@infrastructure/repositories/InMemoryUserRepository';
import { InMemoryTodoRepository } from '@infrastructure/repositories/InMemoryTodoRepository';
import { JwtProvider } from '@infrastructure/providers/jwt/JwtProvider';
import { BcryptHashProvider } from '@infrastructure/providers/hash/BcryptHashProvider';
import { SignupUseCase } from '@application/use-cases/auth/SignupUseCase';
import { LoginUseCase } from '@application/use-cases/auth/LoginUseCase';
import { GetMeUseCase } from '@application/use-cases/auth/GetMeUseCase';
import { CreateTodoUseCase } from '@application/use-cases/todos/CreateTodoUseCase';
import { GetTodosUseCase } from '@application/use-cases/todos/GetTodosUseCase';
import { UpdateTodoUseCase } from '@application/use-cases/todos/UpdateTodoUseCase';
import { DeleteTodoUseCase } from '@application/use-cases/todos/DeleteTodoUseCase';
import { AuthService } from '@application/services/AuthService';

// ── Infrastructure (concrete implementations) ──
// Swap between MongoDB and In-Memory based on env config
const userRepository = env.USE_MEMORY_DB
  ? new InMemoryUserRepository()
  : new MongoUserRepository();

const todoRepository = env.USE_MEMORY_DB
  ? new InMemoryTodoRepository()
  : new MongoTodoRepository();

const tokenProvider = new JwtProvider();
const hashProvider = new BcryptHashProvider();

// ── Use Cases (injected with dependencies) ──
const signupUseCase = new SignupUseCase(userRepository, hashProvider, tokenProvider);
const loginUseCase = new LoginUseCase(userRepository, hashProvider, tokenProvider);
const getMeUseCase = new GetMeUseCase(userRepository);
const createTodoUseCase = new CreateTodoUseCase(todoRepository);
const getTodosUseCase = new GetTodosUseCase(todoRepository);
const updateTodoUseCase = new UpdateTodoUseCase(todoRepository);
const deleteTodoUseCase = new DeleteTodoUseCase(todoRepository);

// ── Services ──
const authService = new AuthService(signupUseCase, loginUseCase, getMeUseCase);

// ── Export everything ──
export const container = {
  // Repositories
  userRepository,
  todoRepository,
  // Providers
  tokenProvider,
  hashProvider,
  // Use Cases
  signupUseCase,
  loginUseCase,
  getMeUseCase,
  createTodoUseCase,
  getTodosUseCase,
  updateTodoUseCase,
  deleteTodoUseCase,
  // Services
  authService,
};
