import winston from 'winston';
import { UserContext } from '../types';

const winstonLogger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ level, message, timestamp, ...meta }) => {
            const metaStr = JSON.stringify(meta);

            return `${timestamp} [${level.toUpperCase()}]: ${message} ${metaStr === '{}' ? '' : metaStr}`;
        })
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' })
    ],
});

function log(level: string, message: string, ctx?: UserContext) {
    if (ctx) {
        winstonLogger.log(level, message, ctx);
    } else {
        winstonLogger.log(level, message);
    }
}

const logger = Object.assign(winstonLogger, {
    error: (message: string, ctx: UserContext) => log('error', message, ctx),
    warn: (message: string, ctx: UserContext) => log('warn', message, ctx),
    info: (message: string, ctx: UserContext) => log('info', message, ctx),
    debug: (message: string, ctx: UserContext) => log('debug', message, ctx),
    verbose: (message: string, ctx: UserContext) => log('verbose', message, ctx),
    silly: (message: string, ctx: UserContext) => log('silly', message, ctx),

    sys_error: (message: string) => log('error', message),
    sys_warn: (message: string) => log('warn', message),
    sys_info: (message: string) => log('info', message),
    sys_debug: (message: string) => log('debug', message),
});

export default logger;
