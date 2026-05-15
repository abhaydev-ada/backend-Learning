// Server Entry Point — starts listening + graceful shutdown.
import { bootstrap } from './bootstrap';
import { disconnectDatabase } from '@infrastructure/database/mongoose/connection';
import { env } from '@infrastructure/config/env';
import { logger } from '@shared/utils/logger';

async function main() {
  try {
    const app = await bootstrap();

    const server = app.listen(env.PORT, () => {
      logger.info(`🚀 Server running on http://localhost:${env.PORT}`);
      logger.info(`📊 Health check: http://localhost:${env.PORT}/health`);
      logger.info(`🔑 Auth API:     http://localhost:${env.PORT}/api/auth`);
      logger.info(`📝 Todos API:    http://localhost:${env.PORT}/api/todos`);
      logger.info(`🌍 Environment:  ${env.NODE_ENV}`);
    });

    // ── Graceful Shutdown ──
    const shutdown = async (signal: string) => {
      logger.info(`\n${signal} received — shutting down gracefully...`);
      server.close(async () => {
        await disconnectDatabase();
        logger.info('👋 Server shut down complete');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

  } catch (error) {
    logger.error('💥 Failed to start server:', error);
    process.exit(1);
  }
}

main();
