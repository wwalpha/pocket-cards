import winston, { format } from 'winston';
import * as path from 'path';

const logger = winston.createLogger({
  level: 'debug',
  format: format.json(),
  transports: [
    new winston.transports.File({ filename: path.join(__dirname, '../../test_error.log'), level: 'error' }),
    new winston.transports.File({ filename: path.join(__dirname, '../../test_info.log'), level: 'info' }),
    new winston.transports.File({ filename: path.join(__dirname, '../../test_debug.log') }),
  ],
});

winston.createLogger = jest.fn().mockImplementation(() => logger);
