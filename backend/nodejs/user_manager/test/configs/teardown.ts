import { DynamodbHelper } from '@alphax/dynamodb';

require('dotenv').config({ path: '.env.test' });

const TABLE_NAME_SETTINGS = process.env.TABLE_NAME_SETTINGS as string;
const dbClient = new DynamodbHelper({
  options: {
    region: process.env.AWS_REGION,
    endpoint: process.env.AWS_ENDPOINT,
  },
});

const teardown = async () => {
  await dbClient.getClient().deleteTable({ TableName: TABLE_NAME_SETTINGS });
};

export default teardown;
