import { DynamodbHelper } from '@alphax/dynamodb';

require('dotenv').config({ path: '.env.test' });

const TABLE_NAME_SETTINGS = process.env.TABLE_NAME_SETTINGS as string;

const teardown = async () => {
  const helper = new DynamodbHelper({ options: { endpoint: process.env.AWS_ENDPOINT } });

  await helper.getClient().deleteTable({ TableName: TABLE_NAME_SETTINGS });
};

export default teardown;
