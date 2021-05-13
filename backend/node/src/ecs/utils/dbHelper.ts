import { DynamodbHelper } from '@alphax/dynamodb';

let helper: DynamodbHelper;

export default () => {
  if (helper) return helper;

  const loggerLevel = process.env.LOGGER_LEVEL ? process.env.LOGGER_LEVEL : 'info';

  helper = new DynamodbHelper({
    options: {
      region: process.env.AWS_DEFAULT_REGION,
      endpoint: process.env.AWS_ENDPOINT,
      sslEnabled: false,
      xray: false,
    },
    logger: {
      appenders: { console: { type: 'console' } },
      categories: { default: { appenders: ['console'], level: loggerLevel } },
    },
  });

  return helper;
};
