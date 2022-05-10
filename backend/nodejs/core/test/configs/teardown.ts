require('dotenv').config({ path: '.env.test' });

import AWS, { DynamoDB, S3 } from 'aws-sdk';

AWS.config.update({
  region: process.env['AWS_REGION'],
  s3: { endpoint: process.env['AWS_ENDPOINT'] },
  sqs: { endpoint: process.env['AWS_ENDPOINT'] },
  dynamodb: { endpoint: process.env['AWS_ENDPOINT'] },
});

const s3Client = new S3();
const dbClient = new DynamoDB();

const TABLE_NAME_USERS = process.env['TABLE_NAME_USERS'] as string;
const TABLE_NAME_GROUPS = process.env['TABLE_NAME_GROUPS'] as string;
const TABLE_NAME_WORDS = process.env['TABLE_NAME_WORDS'] as string;
const TABLE_NAME_WORD_MASTER = process.env['TABLE_NAME_WORD_MASTER'] as string;
const TABLE_NAME_WORD_IGNORE = process.env['TABLE_NAME_WORD_IGNORE'] as string;
const TABLE_NAME_QUESTIONS = process.env['TABLE_NAME_QUESTIONS'] as string;
const TABLE_NAME_LEARNING = process.env['TABLE_NAME_LEARNING'] as string;
const TABLE_NAME_TRACES = process.env['TABLE_NAME_TRACES'] as string;
const TABLE_NAME_WEEKLY_ABILITY = process.env['TABLE_NAME_WEEKLY_ABILITY'] as string;

const BUCKET_NAME_MATERAILS = process.env['BUCKET_NAME_MATERAILS'] as string;

const teardown = async () => {
  console.log('jest teardown start...');

  const objects = await listObject();

  // remove all objects
  await Promise.all(
    objects.map((item) => s3Client.deleteObject({ Bucket: BUCKET_NAME_MATERAILS, Key: item.Key as string }).promise())
  );

  // delete bucket
  await s3Client.deleteBucket({ Bucket: BUCKET_NAME_MATERAILS }).promise();

  await dbClient.deleteTable({ TableName: TABLE_NAME_USERS }).promise();
  await dbClient.deleteTable({ TableName: TABLE_NAME_GROUPS }).promise();
  await dbClient.deleteTable({ TableName: TABLE_NAME_WORDS }).promise();
  await dbClient.deleteTable({ TableName: TABLE_NAME_WORD_MASTER }).promise();
  await dbClient.deleteTable({ TableName: TABLE_NAME_WORD_IGNORE }).promise();
  await dbClient.deleteTable({ TableName: TABLE_NAME_QUESTIONS }).promise();
  await dbClient.deleteTable({ TableName: TABLE_NAME_LEARNING }).promise();
  await dbClient.deleteTable({ TableName: TABLE_NAME_TRACES }).promise();
  await dbClient.deleteTable({ TableName: TABLE_NAME_WEEKLY_ABILITY }).promise();

  console.log('jest teardown end...');
};

export const listObject = async (token?: string): Promise<S3.Object[]> => {
  const results = await s3Client
    .listObjectsV2({
      Bucket: BUCKET_NAME_MATERAILS,
      ContinuationToken: token,
    })
    .promise();

  let contents: S3.ObjectList = [];

  if (results.Contents) {
    contents = results.Contents;
  }

  if (results.NextContinuationToken) {
    const subList = await listObject(results.NextContinuationToken);

    return [...contents, ...subList];
  }

  return contents;
};

export default teardown;
