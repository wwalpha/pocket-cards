import server from '@src/app';
import request from 'supertest';
import * as COMMONS from '../../datas/commons';
import * as GROUPS from '../../datas/groups/describe';
import { DynamodbHelper } from '@alphax/dynamodb';
import { Environment } from '@consts';

const client = new DynamodbHelper({ options: { endpoint: process.env['AWS_ENDPOINT_DYNAMODB'] } });

jest.setTimeout(10000);

describe('Groups', () => {
  beforeEach(async () => {
    await Promise.all([
      client.bulk(Environment.TABLE_NAME_GROUPS, COMMONS.DB_GROUPS),
      client.bulk(Environment.TABLE_NAME_CURRICULUMS, COMMONS.DB_CURRICULUMS),
      client.bulk(Environment.TABLE_NAME_LEARNING, COMMONS.DB_LEARNING),
      client.bulk(Environment.TABLE_NAME_QUESTIONS, COMMONS.DB_QUESTIONS),
    ]);
  });

  afterEach(async () => {
    await Promise.all([
      client.truncateAll(Environment.TABLE_NAME_GROUPS),
      client.truncateAll(Environment.TABLE_NAME_LEARNING),
      client.truncateAll(Environment.TABLE_NAME_CURRICULUMS),
      client.truncateAll(Environment.TABLE_NAME_QUESTIONS),
    ]);
  });

  test('Describe01: グループ情報取得', async () => {
    const gid = '2GC1rgutnVKg9PqR2FLUAv';
    const apiPath = `/v1/groups/${gid}`;

    const res = await request(server).get(apiPath).send();

    // status code
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(GROUPS.DESCRIBE001_EXPECT_GROUP);
  });
});
