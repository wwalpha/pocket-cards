require('dotenv').config({ path: '.env.test' });

import { DynamodbHelper } from '@alphax/dynamodb';
import Settings from './settings.json';

const TABLE_NAME_SETTINGS = process.env.TABLE_NAME_SETTINGS as string;

const setup = async () => {
  console.log('jest setup start...');
  const helper = new DynamodbHelper({ options: { endpoint: process.env.AWS_ENDPOINT } });

  // create table
  await helper.getClient().createTable({
    TableName: TABLE_NAME_SETTINGS,
    BillingMode: 'PROVISIONED',
    ProvisionedThroughput: { ReadCapacityUnits: 100, WriteCapacityUnits: 100 },
    KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
    AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
  });

  // insert data
  await helper.bulk(TABLE_NAME_SETTINGS, Settings);

  console.log('jest setup end...');
};

export default setup;
