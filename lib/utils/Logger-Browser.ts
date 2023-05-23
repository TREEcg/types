import * as log from 'loglevel';
import * as prefix from 'loglevel-plugin-prefix';

export class LoggerBrowser {
    private readonly logger;

    constructor(loggable: Instance | string, level?: string | undefined) {
        const label = typeof loggable === 'string' ? loggable : loggable.constructor.name;
        level = level && isLogLevel(level) ? level : 'info';
        log.setDefaultLevel('info');
        if (level && isLogLevel(level)) {
            log.setLevel(level as log.LogLevelDesc);
        }
        prefix.reg(log);
        prefix.apply(log, {
            template: '%t [%n] %l:',
            levelFormatter(level) {
                return level;
            },
            nameFormatter(name) {
                return name || 'global';
            },
            timestampFormatter(date) {
                return date.toISOString();
            },
        });
        this.logger = log.getLogger(label);
    }

    public error(message: string): void {
        this.logger.error(message);
    }

    public warn(message: string): void {
        this.logger.warn(message);
    }

    public info(message: string): void {
        this.logger.info(message);
    }

    public debug(message: string): void {
        this.logger.debug(message);
    }

    public trace(message: string): void {
        this.logger.trace(message);
    }
}

function isLogLevel(value: string): boolean {
    value = value.toUpperCase();
    return Object.keys(log.levels).includes(value);
}

export const getLogger = (name: string): LoggerBrowser => {
  return new LoggerBrowser(name, 'info');
};

interface Instance {
    constructor: { name: string };
}
