import axios, { AxiosStatic } from 'axios';
import server from '@src/app';
import request from 'supertest';
import * as COMMONS from '../../datas/commons';
import * as CURRICULUMS from '../../datas/curriculums/list';

import { HEADER_GUARDIAN, HEADER_USER } from '@test/Commons';
import { DynamodbHelper } from '@alphax/dynamodb';
import { Environment } from '@consts';

jest.mock('axios');
jest.setTimeout(10000);

const client = new DynamodbHelper({ options: { endpoint: process.env['AWS_ENDPOINT_DYNAMODB'] } });
const api = axios as jest.Mocked<AxiosStatic>;

describe('Curriculums', () => {
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
      client.truncateAll(Environment.TABLE_NAME_WEEKLY_ABILITY),
      client.truncateAll(Environment.TABLE_NAME_QUESTIONS),
    ]);
  });

  test('List01:保護者', async () => {
    api.get.mockImplementationOnce(() => Promise.resolve({ status: 200, data: COMMONS.USER_GUARDIAN }));

    const apiPath = '/v1/curriculums';

    const res = await request(server).get(apiPath).set('username', HEADER_GUARDIAN);

    // status code
    expect(res.statusCode).toBe(200);

    expect(res.body).toMatchObject(CURRICULUMS.CURRI_001_EXPECT_01);
  });

  test('List02:保護者以外', async () => {
    api.get.mockImplementationOnce(() => Promise.resolve({ status: 200, data: COMMONS.USER_STUDENT }));

    const apiPath = '/v1/curriculums';

    const res = await request(server).get(apiPath).set('username', HEADER_USER);

    // status code
    expect(res.statusCode).toBe(400);
    expect(res.text).toEqual('Guardian access only.');
  });
});
