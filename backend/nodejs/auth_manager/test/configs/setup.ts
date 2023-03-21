require('dotenv').config({ path: '.env.test' });

import { DynamodbHelper } from '@alphax/dynamodb';
import Releases from './releases.json';

const TABLE_NAME_SETTINGS = process.env.TABLE_NAME_SETTINGS as string;

const setup = async () => {
  const helper = new DynamodbHelper({ options: { endpoint: process.env.AWS_ENDPOINT } });

  //create table
  await helper.getClient().createTable({
    TableName: TABLE_NAME_SETTINGS,
    BillingMode: 'PROVISIONED',
    ProvisionedThroughput: { ReadCapacityUnits: 100, WriteCapacityUnits: 100 },
    KeySchema: [{ AttributeName: 'Id', KeyType: 'HASH' }],
    AttributeDefinitions: [{ AttributeName: 'Id', AttributeType: 'S' }],
  });

  // insert data
  await helper.bulk(TABLE_NAME_SETTINGS, [Releases]);
};

export default setup;
