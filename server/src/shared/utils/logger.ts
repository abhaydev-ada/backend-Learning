// Logger utility — wraps Winston
import winston from 'winston';
import { loggerConfig } from '@infrastructure/config/logger.config';

export const logger = winston.createLogger(loggerConfig);
