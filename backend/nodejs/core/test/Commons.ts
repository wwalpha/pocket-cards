import { DynamodbHelper } from '@alphax/dynamodb';
import winston from 'winston';
import * as path from 'path';

export const HEADER_AUTH = '84d95083-9ee8-4187-b6e7-8123558ef2c1';

export const HEADER_USER = 'Google_109439805128280065775';
export const HEADER_USER2 = 'kakuto';

export const HEADER_GUARDIAN = 'guardian@gmail.com';

export const helper = new DynamodbHelper();

export const DynamoDBClient = new DynamodbHelper({
  options: { endpoint: process.env['AWS_ENDPOINT_DYNAMODB'] },
  logger: {
    levels: winston.config.syslog.levels,
    transports: [
      new winston.transports.File({ filename: path.join(__dirname, '../test_error.log'), level: 'error' }),
      new winston.transports.File({ filename: path.join(__dirname, '../test_info.log'), level: 'info' }),
      new winston.transports.File({ filename: path.join(__dirname, '../test_debug.log'), level: 'debug' }),
    ],
  },
});
