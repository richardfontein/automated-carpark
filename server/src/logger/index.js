import winston from 'winston';
import path from 'path';
import EmailTransport from './EmailTransport';

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'blue',
};

winston.addColors(colors);

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`),
  ),
  transports: [
    //
    // - Write to all logs with level `info` and below to `combined.log`
    // - Write all logs error (and below) to `error.log`.
    //
    new winston.transports.File({ filename: path.resolve('log', 'error.log'), level: 'error' }),
    new winston.transports.File({ filename: path.resolve('log', 'combined.log') }),
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: path.resolve('log', 'exceptions.log') }),
  ],
});

// If in production, add email transport
if (process.env.NODE_ENV === 'production') {
  logger.add(new EmailTransport({ level: 'error' }));
}

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message}
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(info => `${info.level}: ${info.message}`),
      ),
      handleExceptions: true,
    }),
  );
}

export default logger;
