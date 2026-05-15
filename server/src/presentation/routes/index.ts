// Route Aggregator — mounts all routes under /api
import { Router } from 'express';
import authRoutes from './auth.routes';
import todoRoutes from './todos.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/todos', todoRoutes);

export default router;
