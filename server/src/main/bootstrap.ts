// Bootstrap — initializes infrastructure (DB, etc.) and returns the app.
import { connectDatabase } from '@infrastructure/database/mongoose/connection';
import { createApp } from './app';
import { env } from '@infrastructure/config/env';
import { logger } from '@shared/utils/logger';
import express from 'express';

export async function bootstrap(): Promise<express.Application> {
  if (env.USE_MEMORY_DB) {
    // Skip MongoDB — use in-memory storage for testing
    logger.info('💾 Using IN-MEMORY storage (data resets on restart)');
  } else {
    // Connect to MongoDB
    await connectDatabase();
  }

  // Create and configure the Express app
  const app = createApp();

  return app;
}
