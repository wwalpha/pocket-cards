require('dotenv').config({ path: '.env.test' });

import { DynamodbHelper } from '@alphax/dynamodb';
import { S3, _Object } from '@aws-sdk/client-s3';

const s3Client = new S3({
  region: process.env['AWS_REGION'],
  endpoint: process.env['AWS_ENDPOINT'],
});

const dbClient = new DynamodbHelper({
  options: {
    region: process.env['AWS_REGION'],
    endpoint: process.env['AWS_ENDPOINT_DYNAMODB'],
  },
}).getClient();

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

const BUCKET_NAME_MATERAILS = process.env['BUCKET_NAME_MATERAILS'] as string;

const teardown = async () => {
  console.log('jest teardown start...');

  const objects = await listObject();

  // remove all objects
  await Promise.all(
    objects.map((item) => s3Client.deleteObject({ Bucket: BUCKET_NAME_MATERAILS, Key: item.Key as string }))
  );

  // delete bucket
  await s3Client.deleteBucket({ Bucket: BUCKET_NAME_MATERAILS });

  await dbClient.deleteTable({ TableName: TABLE_NAME_USERS });
  await dbClient.deleteTable({ TableName: TABLE_NAME_GROUPS });
  await dbClient.deleteTable({ TableName: TABLE_NAME_WORDS });
  await dbClient.deleteTable({ TableName: TABLE_NAME_WORD_MASTER });
  await dbClient.deleteTable({ TableName: TABLE_NAME_WORD_IGNORE });
  await dbClient.deleteTable({ TableName: TABLE_NAME_QUESTIONS });
  await dbClient.deleteTable({ TableName: TABLE_NAME_LEARNING });
  await dbClient.deleteTable({ TableName: TABLE_NAME_TRACES });
  await dbClient.deleteTable({ TableName: TABLE_NAME_CURRICULUMS });
  await dbClient.deleteTable({ TableName: TABLE_NAME_INQUIRY });

  console.log('jest teardown end...');
};

export const listObject = async (token?: string): Promise<_Object[]> => {
  const results = await s3Client.listObjectsV2({
    Bucket: BUCKET_NAME_MATERAILS,
    ContinuationToken: token,
  });
  let contents: _Object[] = [];

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
