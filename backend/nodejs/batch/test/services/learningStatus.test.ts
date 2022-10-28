import LearningStatus from '@src/func/learningStatus';
import * as COMMONS from '../datas/commons';
import { DynamodbHelper } from '@alphax/dynamodb';
import { Environments } from '@utils';

const client = new DynamodbHelper({ options: { endpoint: process.env['AWS_ENDPOINT_DYNAMODB'] } });

jest.setTimeout(10000);

describe('LearningStatus', () => {
  beforeAll(async () => {
    await Promise.all([
      client.bulk(Environments.TABLE_NAME_USERS, COMMONS.DB_USERS),
      client.bulk(Environments.TABLE_NAME_LEARNING, COMMONS.DB_LEARNING),
    ]);
  });

  afterAll(async () => {
    await Promise.all([
      client.truncateAll(Environments.TABLE_NAME_USERS),
      client.truncateAll(Environments.TABLE_NAME_LEARNING),
    ]);
  });

  test('Describe001: 学習状況参照', async () => {
    // テスト実行
    await LearningStatus();
  });
});
