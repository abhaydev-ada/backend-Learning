// Todo Routes — all protected (require JWT)
import { Router } from 'express';
import { TodosController } from '@presentation/controllers/todos/TodosController';
import { authMiddleware } from '@presentation/middlewares/auth.middleware';
import { validateCreateTodo, validateUpdateTodo } from '@presentation/validators/todos.validator';

const router = Router();

// All todo routes require authentication
router.use(authMiddleware);

// GET    /api/todos          — Get all user's todos
router.get('/', TodosController.getAll);

// POST   /api/todos          — Create a new todo
router.post('/', validateCreateTodo, TodosController.create);

// PUT    /api/todos/:id      — Update a todo
router.put('/:id', validateUpdateTodo, TodosController.update);

// DELETE /api/todos/:id      — Delete a todo
router.delete('/:id', TodosController.delete);

export default router;
