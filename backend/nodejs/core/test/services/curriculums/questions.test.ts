import server from '@src/app';
import request from 'supertest';
import * as COMMONS from '../../datas/commons';
import * as CURRICULUMS from '../../datas/curriculums/questions';
import { HEADER_GUARDIAN, HEADER_USER } from '@test/Commons';
import { DynamodbHelper } from '@alphax/dynamodb';
import { Environment } from '@consts';

jest.setTimeout(10000);

const client = new DynamodbHelper({ options: { endpoint: process.env['AWS_ENDPOINT_DYNAMODB'] } });

describe('Curriculums', () => {
  beforeEach(async () => {
    await Promise.all([
      client.bulk(Environment.TABLE_NAME_GROUPS, COMMONS.DB_GROUPS),
      client.bulk(Environment.TABLE_NAME_CURRICULUMS, COMMONS.DB_CURRICULUMS),
      client.bulk(Environment.TABLE_NAME_LEARNING, COMMONS.DB_LEARNING),
      client.bulk(Environment.TABLE_NAME_QUESTIONS, COMMONS.DB_QUESTIONS),
      client.bulk(Environment.TABLE_NAME_WEEKLY_ABILITY, COMMONS.DB_ABILITY),
    ]);
  });

  afterEach(async () => {
    await Promise.all([
      client.truncateAll(Environment.TABLE_NAME_GROUPS),
      client.truncateAll(Environment.TABLE_NAME_CURRICULUMS),
      client.truncateAll(Environment.TABLE_NAME_LEARNING),
      client.truncateAll(Environment.TABLE_NAME_QUESTIONS),
      client.truncateAll(Environment.TABLE_NAME_WEEKLY_ABILITY),
    ]);
  });

  test('Question01: 問題集一覧_一般', async () => {
    const curriculumId = 'vB6cUPdMB8TJFSrypGwoML';
    const apiPath = `/v1/curriculums/${curriculumId}/questions`;

    const res = await request(server).get(apiPath).set('username', HEADER_GUARDIAN);

    // status code
    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject(CURRICULUMS.CURRI_001_EXPECT_01);
  });

  test('Question02: 問題集一覧_実力', async () => {
    const curriculumId = 'nPhYYwyTtDm3BQLFpWgw7L';
    const apiPath = `/v1/curriculums/${curriculumId}/questions`;

    const res = await request(server).get(apiPath).set('username', HEADER_USER);

    // status code
    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject(CURRICULUMS.CURRI_002_EXPECT_01);
  });

  test('Question03: カリキュラム存在しない', async () => {
    const curriculumId = 'DUMMY';
    const apiPath = `/v1/curriculums/${curriculumId}/questions`;

    const res = await request(server).get(apiPath).set('username', HEADER_USER);

    // status code
    expect(res.statusCode).toBe(400);
    expect(res.text).toEqual(`Curriculum[${curriculumId}] not found.`);
  });
});
