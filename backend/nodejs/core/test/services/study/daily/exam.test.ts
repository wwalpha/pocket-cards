import server from '@src/app';
import request from 'supertest';
import * as COMMONS from '../../../datas/commons';
import * as QUESTIONS from '../../../datas/questions/exam';
import { HEADER_GUARDIAN, HEADER_USER } from '@test/Commons';
import { DynamodbHelper } from '@alphax/dynamodb';
import { Environment } from '@consts';

const client = new DynamodbHelper({ options: { endpoint: process.env['AWS_ENDPOINT_DYNAMODB'] } });

jest.mock('axios');
jest.setTimeout(10000);

describe('Study', () => {
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

  test('Exam01: デリー学習一覧_未学習のみ', async () => {
    const apiPath = `/v1/study/daily/exam`;

    const res = await request(server)
      .get(apiPath)
      .query({
        subject: '3',
      })
      .set('username', HEADER_USER)
      .set('guardian', HEADER_GUARDIAN);

    // status code
    expect(res.statusCode).toBe(200);

    expect(res.body).toEqual(QUESTIONS.EXAM001_EXPECT);
  });
});
