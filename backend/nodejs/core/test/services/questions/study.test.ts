import axios, { AxiosStatic } from 'axios';
import server from '@src/app';
import request from 'supertest';
import * as COMMONS from '../../datas/commons';
import * as QUESTIONS from '../../datas/questions/study';
import { HEADER_AUTH, HEADER_USER, HEADER_USER2 } from '@test/Commons';
import { DynamodbHelper } from '@alphax/dynamodb';
import { Environment } from '@consts';

const client = new DynamodbHelper({ options: { endpoint: process.env['AWS_ENDPOINT_DYNAMODB'] } });
const api = axios as jest.Mocked<AxiosStatic>;

jest.mock('axios');
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

  test('Study01: デリー学習一覧_未学習のみ', async () => {
    api.get.mockImplementationOnce(() => Promise.resolve({ status: 200, data: COMMONS.USER_STUDENT }));

    const apiPath = '/v1/study/daily/practice/questions';

    const res = await request(server)
      .get(apiPath)
      .query({
        subject: '2',
      })
      .set('username', HEADER_USER);

    // status code
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(QUESTIONS.STUDY001_EXPECT_LEARNING);
  });

  test('Study02: デリー学習一覧_学習済のみ', async () => {
    const apiPath = '/v1/study/daily/practice/questions';

    const res = await request(server)
      .get(apiPath)
      .query({
        subject: '3',
      })
      .set('username', HEADER_USER2);

    // status code
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(QUESTIONS.STUDY002_EXPECT_LEARNING);
  });

  test('Study03: 対象ユーザ学習データ存在しない', async () => {
    const apiPath = '/v1/study/daily/practice/questions';

    const res = await request(server).get(apiPath).set('username', HEADER_AUTH);

    // status code
    expect(res.statusCode).toBe(400);
    expect(res.text).toEqual('Please select subject.');
  });

  test('Study04: 科目未選択', async () => {
    const apiPath = '/v1/study/daily/practice/questions';

    const res = await request(server).get(apiPath).set('username', HEADER_USER);

    // status code
    expect(res.statusCode).toBe(400);
    expect(res.text).toEqual('Please select subject.');
  });
});
