import winston from 'winston';

/**
 * Logger configuration using Winston.
 * Logs are output to the console with timestamps and in JSON format.
 * The log level is set to 'info' by default, but can be adjusted as needed.
 */
export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});