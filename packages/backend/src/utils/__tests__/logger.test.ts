import logger from '../logger';
import { UserContext } from '../../types';
import winston from 'winston';

describe('Logger Module', () => {

    let spyLog: jest.SpyInstance;

    beforeEach(() => {
        spyLog = jest.spyOn(winston.Logger.prototype, 'log').mockImplementation(() => logger);
    });

    afterEach(() => {
        spyLog.mockRestore();
    });

    const mockContext: UserContext = {
        userId: '12345',
        role: 'restaurant_employee',
    };

    it('should log an error message without user context', () => {
        logger.sys_error('A system error occurred');
        expect(spyLog).toHaveBeenCalledWith('error', 'A system error occurred');
    });

    it('should log an info message without user context', () => {
        logger.sys_info('A system info message');
        expect(spyLog).toHaveBeenCalledWith('info', 'A system info message');
    });

    it('should log an warning message without user context', () => {
        logger.sys_warn('A system warning occurred');
        expect(spyLog).toHaveBeenCalledWith('warn', 'A system warning occurred');
    });

    it('should log an debug message without user context', () => {
        logger.sys_debug('A system debug message');
        expect(spyLog).toHaveBeenCalledWith('debug', 'A system debug message');
    });

    it('should log an error message with user context', () => {
        logger.error('An error occurred', mockContext);
        expect(spyLog).toHaveBeenCalledWith('error', 'An error occurred', mockContext);
    });

    it('should log an info message with user context', () => {
        logger.info( 'An info message', mockContext);
        expect(spyLog).toHaveBeenCalledWith('info', 'An info message', mockContext);
    });

    it('should log a warning message with user context', () => {
        logger.warn( 'A warning message', mockContext);
        expect(spyLog).toHaveBeenCalledWith('warn', 'A warning message', mockContext);
    });

    it('should log a debug message with user context', () => {
        logger.debug( 'A debug message', mockContext);
        expect(spyLog).toHaveBeenCalledWith('debug', 'A debug message', mockContext);
    });
});
