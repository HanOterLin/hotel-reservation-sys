import winston from 'winston';
import { UserContext } from "./types";

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ level, message, timestamp, ...meta }) => {
            return `${timestamp} [${level.toUpperCase()}]: ${message} ${JSON.stringify(meta)}`;
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
        logger.log(level, message, ctx);
    } else {
        logger.log(level, message);
    }
}

interface CustomLogger extends winston.Logger {
    error(ctx: UserContext, message: string): void;
    warn(ctx: UserContext, message: string): void;
    info(ctx: UserContext, message: string): void;
    debug(ctx: UserContext, message: string): void;
    verbose(ctx: UserContext, message: string): void;
    silly(ctx: UserContext, message: string): void;
}

type ExtendedLogger = CustomLogger & {
    sys_error(message: string): void;
    sys_warn(message: string): void;
    sys_info(message: string): void;
    sys_debug(message: string): void;
};

const customLogger = logger as ExtendedLogger;

customLogger.error = (ctx: UserContext, message: string) => log('error', message, ctx);
customLogger.warn = (ctx: UserContext, message: string) => log('warn', message, ctx);
customLogger.info = (ctx: UserContext, message: string) => log('info', message, ctx);
customLogger.debug = (ctx: UserContext, message: string) => log('debug', message, ctx);
customLogger.verbose = (ctx: UserContext, message: string) => log('verbose', message, ctx);
customLogger.silly = (ctx: UserContext, message: string) => log('silly', message, ctx);

customLogger.sys_error = (message: string) => log('error', message);
customLogger.sys_warn = (message: string) => log('warn', message);
customLogger.sys_info = (message: string) => log('info', message);
customLogger.sys_debug = (message: string) => log('debug', message);

export default customLogger;
