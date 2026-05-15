// ═══════════════════════════════════════════════════════════════
// DATABASE: MongoDB Connection
// ═══════════════════════════════════════════════════════════════
//
// This file handles connecting to MongoDB using Mongoose.
//
// MONGOOSE is an ODM (Object Data Modeling) library for MongoDB.
// It provides:
// - Schema definitions (structure of your data)
// - Validation
// - Query building
// - Middleware (hooks before/after save, delete, etc.)
//
// CONNECTION BEST PRACTICES:
// 1. Connect ONCE at app startup (not per request)
// 2. Handle connection errors gracefully
// 3. Log connection status
// ═══════════════════════════════════════════════════════════════

import mongoose from 'mongoose';
import { env } from '../../config/env';
import { logger } from '@shared/utils/logger';

/**
 * Connect to MongoDB.
 * Called once during app startup (in bootstrap.ts).
 */
export async function connectDatabase(): Promise<void> {
  try {
    const conn = await mongoose.connect(env.MONGO_URI);

    logger.info(`✅ MongoDB Connected: ${conn.connection.host}`);

    // ── Connection Event Handlers ──
    // These help you monitor the database connection in production

    mongoose.connection.on('error', (err) => {
      logger.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('⚠️  MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('🔄 MongoDB reconnected');
    });
  } catch (error) {
    logger.error('❌ Failed to connect to MongoDB:', error);
    process.exit(1);  // Can't run without a database
  }
}

/**
 * Disconnect from MongoDB.
 * Called during graceful shutdown.
 */
export async function disconnectDatabase(): Promise<void> {
  await mongoose.connection.close();
  logger.info('🔌 MongoDB connection closed');
}
