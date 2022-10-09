require('dotenv').config({ path: '.env.test' });

import { DynamodbHelper } from '@alphax/dynamodb';
import AWS, { S3 } from 'aws-sdk';

AWS.config.update({
  region: process.env['AWS_REGION'],
  s3: { endpoint: process.env['AWS_ENDPOINT'] },
  dynamodb: { endpoint: process.env['AWS_ENDPOINT_DYNAMODB'] },
});

const TABLE_NAME_USERS = process.env['TABLE_NAME_USERS'] as string;
const TABLE_NAME_GROUPS = process.env['TABLE_NAME_GROUPS'] as string;
const TABLE_NAME_WORDS = process.env['TABLE_NAME_WORDS'] as string;
const TABLE_NAME_WORD_MASTER = process.env['TABLE_NAME_WORD_MASTER'] as string;
const TABLE_NAME_WORD_IGNORE = process.env['TABLE_NAME_WORD_IGNORE'] as string;
const TABLE_NAME_QUESTIONS = process.env['TABLE_NAME_QUESTIONS'] as string;
const TABLE_NAME_LEARNING = process.env['TABLE_NAME_LEARNING'] as string;
const TABLE_NAME_TRACES = process.env['TABLE_NAME_TRACES'] as string;
const TABLE_NAME_CURRICULUMS = process.env['TABLE_NAME_CURRICULUMS'] as string;
const TABLE_NAME_INQUIRY = process.env['TABLE_NAME_INQUIRY'] as string;

const setup = async () => {
  console.log('jest setup start...');

  const helper = new DynamodbHelper({ options: { endpoint: process.env['AWS_ENDPOINT_DYNAMODB'] } });
  const s3Client = new S3();
  const dbClient = helper.getClient();

  await Promise.all([
    s3Client.createBucket({ Bucket: process.env['BUCKET_NAME_MATERAILS'] as string }).promise(),
    dbClient
      .createTable({
        TableName: TABLE_NAME_USERS,
        BillingMode: 'PAY_PER_REQUEST',
        KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
        AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
      })
      .promise(),
    dbClient
      .createTable({
        TableName: TABLE_NAME_GROUPS,
        BillingMode: 'PAY_PER_REQUEST',
        KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
        AttributeDefinitions: [
          { AttributeName: 'id', AttributeType: 'S' },
          { AttributeName: 'subject', AttributeType: 'S' },
        ],
        GlobalSecondaryIndexes: [
          {
            IndexName: 'gsiIdx1',
            KeySchema: [
              { AttributeName: 'subject', KeyType: 'HASH' },
              { AttributeName: 'id', KeyType: 'RANGE' },
            ],
            Projection: { ProjectionType: 'ALL' },
          },
        ],
      })
      .promise(),
    dbClient
      .createTable({
        TableName: TABLE_NAME_WORDS,
        BillingMode: 'PAY_PER_REQUEST',
        KeySchema: [
          { AttributeName: 'id', KeyType: 'HASH' },
          { AttributeName: 'groupId', KeyType: 'RANGE' },
        ],
        AttributeDefinitions: [
          { AttributeName: 'id', AttributeType: 'S' },
          { AttributeName: 'groupId', AttributeType: 'S' },
          { AttributeName: 'nextTime', AttributeType: 'S' },
        ],
        GlobalSecondaryIndexes: [
          {
            IndexName: 'gsiIdx1',
            KeySchema: [
              { AttributeName: 'groupId', KeyType: 'HASH' },
              { AttributeName: 'nextTime', KeyType: 'RANGE' },
            ],
            Projection: { ProjectionType: 'ALL' },
          },
        ],
      })
      .promise(),
    dbClient
      .createTable({
        TableName: TABLE_NAME_WORD_MASTER,
        BillingMode: 'PAY_PER_REQUEST',
        KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
        AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
      })
      .promise(),
    dbClient
      .createTable({
        TableName: TABLE_NAME_WORD_IGNORE,
        BillingMode: 'PAY_PER_REQUEST',
        KeySchema: [
          { AttributeName: 'id', KeyType: 'HASH' },
          { AttributeName: 'word', KeyType: 'RANGE' },
        ],
        AttributeDefinitions: [
          { AttributeName: 'id', AttributeType: 'S' },
          { AttributeName: 'word', AttributeType: 'S' },
        ],
      })
      .promise(),
    dbClient
      .createTable({
        TableName: TABLE_NAME_TRACES,
        BillingMode: 'PAY_PER_REQUEST',
        KeySchema: [
          { AttributeName: 'qid', KeyType: 'HASH' },
          { AttributeName: 'timestamp', KeyType: 'RANGE' },
        ],
        AttributeDefinitions: [
          { AttributeName: 'qid', AttributeType: 'S' },
          { AttributeName: 'timestamp', AttributeType: 'S' },
        ],
      })
      .promise(),
    dbClient
      .createTable({
        TableName: TABLE_NAME_QUESTIONS,
        BillingMode: 'PAY_PER_REQUEST',
        KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
        AttributeDefinitions: [
          { AttributeName: 'id', AttributeType: 'S' },
          { AttributeName: 'groupId', AttributeType: 'S' },
        ],
        GlobalSecondaryIndexes: [
          {
            IndexName: 'gsiIdx1',
            KeySchema: [
              { AttributeName: 'groupId', KeyType: 'HASH' },
              { AttributeName: 'id', KeyType: 'RANGE' },
            ],
            Projection: { ProjectionType: 'ALL' },
          },
        ],
      })
      .promise(),
    dbClient
      .createTable({
        TableName: TABLE_NAME_LEARNING,
        BillingMode: 'PAY_PER_REQUEST',
        KeySchema: [
          { AttributeName: 'qid', KeyType: 'HASH' },
          { AttributeName: 'userId', KeyType: 'RANGE' },
        ],
        AttributeDefinitions: [
          { AttributeName: 'qid', AttributeType: 'S' },
          { AttributeName: 'userId', AttributeType: 'S' },
          { AttributeName: 'nextTime', AttributeType: 'S' },
          { AttributeName: 'groupId', AttributeType: 'S' },
        ],
        GlobalSecondaryIndexes: [
          {
            IndexName: 'gsiIdx1',
            KeySchema: [
              { AttributeName: 'userId', KeyType: 'HASH' },
              { AttributeName: 'nextTime', KeyType: 'RANGE' },
            ],
            Projection: { ProjectionType: 'ALL' },
          },
          {
            IndexName: 'gsiIdx2',
            KeySchema: [
              { AttributeName: 'groupId', KeyType: 'HASH' },
              { AttributeName: 'nextTime', KeyType: 'RANGE' },
            ],
            Projection: { ProjectionType: 'ALL' },
          },
        ],
      })
      .promise(),
    dbClient
      .createTable({
        TableName: TABLE_NAME_CURRICULUMS,
        BillingMode: 'PAY_PER_REQUEST',
        KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
        AttributeDefinitions: [
          { AttributeName: 'id', AttributeType: 'S' },
          { AttributeName: 'guardian', AttributeType: 'S' },
          { AttributeName: 'groupId', AttributeType: 'S' },
          { AttributeName: 'userId', AttributeType: 'S' },
        ],
        GlobalSecondaryIndexes: [
          {
            IndexName: 'gsiIdx1',
            KeySchema: [
              { AttributeName: 'guardian', KeyType: 'HASH' },
              { AttributeName: 'groupId', KeyType: 'RANGE' },
            ],
            Projection: { ProjectionType: 'ALL' },
          },
          {
            IndexName: 'gsiIdx2',
            KeySchema: [
              { AttributeName: 'groupId', KeyType: 'HASH' },
              { AttributeName: 'userId', KeyType: 'RANGE' },
            ],
            Projection: { ProjectionType: 'ALL' },
          },
        ],
      })
      .promise(),
    dbClient
      .createTable({
        TableName: TABLE_NAME_INQUIRY,
        BillingMode: 'PAY_PER_REQUEST',
        KeySchema: [{ AttributeName: 'qid', KeyType: 'HASH' }],
        AttributeDefinitions: [{ AttributeName: 'qid', AttributeType: 'S' }],
      })
      .promise(),
  ]);

  console.log('jest setup end...');
};

// setup();

export default setup;
