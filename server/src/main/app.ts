// Express App — creates and configures Express WITHOUT starting the server.
// Separation of app config from server startup enables testing.
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import apiRoutes from '@presentation/routes/index';
import healthRoutes from '@main/health/health.controller';
import { errorMiddleware } from '@presentation/middlewares/error.middleware';
import { requestLoggerMiddleware } from '@presentation/middlewares/request-logger.middleware';
import { generalLimiter } from '@presentation/middlewares/rate-limit.middleware';
import path from 'path';

export function createApp(): express.Application {
  const app = express();

  // ── Security Middlewares ──
  app.use(helmet());       // Sets security HTTP headers

  // ── CORS (Cross-Origin Resource Sharing) ──
  // WHY CORS?
  // Your React client runs on http://localhost:3000
  // Your Express server runs on http://localhost:5000
  // Browsers BLOCK requests between different origins by default (security).
  // CORS tells the browser: "It's OK, I trust these origins."
  app.use(cors({
    origin: [
      'http://localhost:3000',    // Vite dev server
      'http://localhost:5173',    // Vite default port
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5173',
    ],
    credentials: true,            // Allow cookies/auth headers
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));

  app.use(generalLimiter); // Rate limiting

  // ── Body Parsing ──
  app.use(express.json());              // Parse JSON request bodies
  app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

  // ── Request Logging ──
  app.use(requestLoggerMiddleware);

  // ── Routes ──
  app.use('/', healthRoutes);    // Health check at root
  app.use('/api', apiRoutes);    // All API routes under /api

  // ── Serve React Frontend (production) ──
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../../../client/dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, '../../../client/dist/index.html'));
    });
  }

  // ── Global Error Handler (MUST be last middleware) ──
  app.use(errorMiddleware);

  return app;
}
