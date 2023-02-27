import { S3, S3ClientConfig } from '@aws-sdk/client-s3';
import { DynamoDB, DynamoDBClientConfig } from '@aws-sdk/client-dynamodb';
import { Polly, PollyClientConfig } from '@aws-sdk/client-polly';
import { Translate, TranslateClientConfig } from '@aws-sdk/client-translate';
import { SSM, SSMClientConfig } from '@aws-sdk/client-ssm';
import { Lambda, LambdaClientConfig } from '@aws-sdk/client-lambda';
import { TimestreamWrite, TimestreamWriteClientConfig } from '@aws-sdk/client-timestream-write';
import { SES, SESClientConfig } from '@aws-sdk/client-ses';

let dynamoDBClient: DynamoDB;
let pollyClient: Polly;
let s3Client: S3;
let translateClient: Translate;
let ssmClient: SSM;
let lambdaClient: Lambda;
let writeClient: TimestreamWrite;
let sesClient: SES;

/** Dynamodb Client初期化 */
export const dynamoDB = (options?: DynamoDBClientConfig): DynamoDB => {
  // 初期化済
  if (dynamoDBClient) return dynamoDBClient;

  // 初期化パラメータあり
  if (options) return new DynamoDB(options);

  // 初期化する
  return new DynamoDB({
    region: process.env['DEFAULT_REGION'],
  });
};

/** Polly Client初期化 */
export const polly = (options?: PollyClientConfig): Polly => {
  // 初期化済み
  if (pollyClient) return pollyClient;

  // 初期化設定あり
  if (options) return new Polly(options);

  return new Polly({
    region: process.env['DEFAULT_REGION'],
  });
};

/** S3 Client初期化 */
export const s3 = (options?: S3ClientConfig): S3 => {
  // 初期化済み
  if (s3Client) return s3Client;

  // 初期化設定あり
  if (options) return new S3(options);

  // 初期化設定なし
  return new S3({
    region: process.env['DEFAULT_REGION'],
    endpoint: process.env['AWS_ENDPOINT'],
  });
};

/** Translate初期化 */
export const translate = (options?: TranslateClientConfig): Translate => {
  // 初期化済み
  if (translateClient) return translateClient;

  // 初期化設定あり
  if (options) return new Translate(options);

  // 初期化設定なし
  return new Translate({
    region: process.env['DEFAULT_REGION'],
  });
};

/** SSM Client初期化 */
export const ssm = (options?: SSMClientConfig): SSM => {
  // 初期化済み
  if (ssmClient) return ssmClient;

  // 初期化設定あり
  if (options) return new SSM(options);

  // 初期化設定なし
  return new SSM({
    region: process.env['DEFAULT_REGION'],
  });
};

export const lambda = (options?: LambdaClientConfig): Lambda => {
  // 初期化済み
  if (lambdaClient) return lambdaClient;

  // 初期化設定あり
  if (options) return new Lambda(options);

  // 初期化設定なし
  return new Lambda({
    region: process.env['DEFAULT_REGION'],
  });
};

export const timestreamWrite = (options?: TimestreamWriteClientConfig): TimestreamWrite => {
  // 初期化済み
  if (writeClient) return writeClient;

  // 初期化設定あり
  if (options) return new TimestreamWrite(options);

  // 初期化設定なし
  return new TimestreamWrite({
    region: process.env['DEFAULT_REGION'],
  });
};

export const ses = (options?: SESClientConfig): SES => {
  // 初期化済み
  if (sesClient) return sesClient;

  const config: SESClientConfig = options
    ? options
    : {
        region: process.env['DEFAULT_REGION'],
      };

  sesClient = new SES(config);

  return sesClient;
};
