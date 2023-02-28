import server from '@src/app';
import request from 'supertest';

import * as COMMONS from '../../datas/commons';
import * as WEEKLY from '../../datas/weekly';
import { Environment } from '@consts';
import { DynamoDBClient, HEADER_USER } from '@test/Commons';

const client = DynamoDBClient;

describe('Weekly', () => {
  beforeAll(async () => {
    await Promise.all([
      client.bulk(Environment.TABLE_NAME_QUESTIONS, COMMONS.DB_QUESTIONS),
      client.bulk(Environment.TABLE_NAME_GROUPS, COMMONS.DB_GROUPS),
    ]);
  });
  afterAll(async () => {
    await Promise.all([
      client.truncateAll(Environment.TABLE_NAME_QUESTIONS),
      client.truncateAll(Environment.TABLE_NAME_GROUPS),
    ]);
  });

  beforeEach(async () => {
    await Promise.all([client.bulk(Environment.TABLE_NAME_LEARNING, WEEKLY.LIST_01_DB_LEARNING)]);
  });
  afterEach(async () => {
    await Promise.all([client.truncateAll(Environment.TABLE_NAME_LEARNING)]);
  });

  test('WeeklyList01', async () => {
    const apiPath = '/v1/study/weekly';
    const subject = '2';

    const res = await request(server).get(`${apiPath}?subject=${subject}`).set('username', HEADER_USER).send();

    // status code
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(WEEKLY.LIST_01_EXPECT);
  });
});
