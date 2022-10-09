import server from '@src/app';
import request from 'supertest';
import * as COMMONS from '../../datas/commons';
import * as QUESTIONS from '../../datas/questions/lists';
import { HEADER_AUTH } from '@test/Commons';
import { DynamodbHelper } from '@alphax/dynamodb';
import { Environment } from '@consts';

const client = new DynamodbHelper({ options: { endpoint: process.env['AWS_ENDPOINT_DYNAMODB'] } });

jest.setTimeout(10000);

describe('Questions', () => {
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

  test('Lists01: 質問一覧_一般科目', async () => {
    const gid = 'sGd6gX36nvnMaSCDTiYZ2Z';
    const apiPath = `/v1/groups/${gid}/questions`;

    const res = await request(server).get(apiPath).set('username', HEADER_AUTH);

    // status code
    expect(res.statusCode).toBe(200);

    expect(res.body).toEqual(QUESTIONS.LISTS001_EXPECT_QUESTIONS);
  });

  test('Lists03: グループ存在しない', async () => {
    const gid = 'G001';
    const apiPath = `/v1/groups/${gid}/questions`;

    const res = await request(server).get(apiPath).set('username', HEADER_AUTH);

    // status code
    expect(res.statusCode).toBe(400);
    expect(res.text).toEqual('Group informations not found.');
  });
});
