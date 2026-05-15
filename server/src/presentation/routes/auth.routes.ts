// Auth Routes
import { Router } from 'express';
import { AuthController } from '@presentation/controllers/auth/AuthController';
import { authMiddleware } from '@presentation/middlewares/auth.middleware';
import { validateSignup, validateLogin } from '@presentation/validators/auth.validator';
import { authLimiter } from '@presentation/middlewares/rate-limit.middleware';

const router = Router();

// POST /api/auth/signup — Register new user
router.post('/signup', authLimiter, validateSignup, AuthController.signup);

// POST /api/auth/login — Login user
router.post('/login', authLimiter, validateLogin, AuthController.login);

// GET /api/auth/me — Get current user (protected)
router.get('/me', authMiddleware, AuthController.getMe);

export default router;
