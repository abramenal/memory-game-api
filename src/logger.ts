import winston from 'winston';

type LogLevel = 'info' | 'warn' | 'error';

type LoggerConfig = {
  level: LogLevel;
  isDevelopment: boolean;
};

export type Logger = {
  info: (message: string, payload?: Record<string, unknown>) => void;
  warn: (message: string, payload?: Record<string, unknown>) => void;
  error: (message: string, payload?: Record<string, unknown>) => void;
};

export default function createLogger({ level, isDevelopment }: LoggerConfig): Logger {
  const logger = winston.createLogger({
    level,
    format: winston.format.json(),
    transports: [
      // Any production logging solution
    ],
  });

  if (isDevelopment) {
    logger.add(
      new winston.transports.Console({
        format: winston.format.simple(),
      }),
    );
  }

  return logger;
}
