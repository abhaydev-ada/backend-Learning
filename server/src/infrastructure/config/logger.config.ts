// ═══════════════════════════════════════════════════════════════
// INFRASTRUCTURE CONFIG: Logger Configuration
// ═══════════════════════════════════════════════════════════════
//
// WHY WINSTON?
// console.log() is fine for development, but in production you need:
// - Log levels (info, warn, error, debug)
// - Timestamps
// - File output (not just terminal)
// - Structured JSON logs (for log aggregation tools)
// ═══════════════════════════════════════════════════════════════

import winston from 'winston';
import { env } from './env';

/**
 * Logger configuration.
 * Different formats for development vs production.
 */
export const loggerConfig: winston.LoggerOptions = {
  level: env.NODE_ENV === 'development' ? 'debug' : 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    env.NODE_ENV === 'development'
      ? winston.format.combine(
          winston.format.colorize(),
          winston.format.printf(({ timestamp, level, message, stack }) => {
            return `${timestamp} [${level}]: ${stack || message}`;
          })
        )
      : winston.format.json()  // JSON format for production (easier to parse)
  ),
  transports: [
    new winston.transports.Console(),
    // In production, you might add file transport:
    // new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    // new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
};
