import type { Logger } from "winston";
import { createLogger, transports, format } from 'winston';

/**
 * Logger to be used in the bucketizers
 */

const logFormat = format.printf(({ level, message, label, timestamp }) => `${timestamp} [${label}] ${level.toUpperCase()}: ${message}`);

export const getLogger = (name: string): Logger => {
  return createLogger({
    transports: [
      new transports.Console({
        format: format.combine(
          format.label({ label: name }),
          format.timestamp(),
          logFormat,
        ),
      }),
    ],
    exitOnError: false
  })
};
