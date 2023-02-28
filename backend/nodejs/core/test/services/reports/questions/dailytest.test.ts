import server from '@src/app';
import request from 'supertest';
import * as COMMONS from '../../../datas/commons';
import * as REPORTS from '../../../datas/reports/dailytest';

import { DynamoDBClient, HEADER_GUARDIAN } from '@test/Commons';

import { Environment } from '@consts';
import { APIs } from '../../../../../typings';

jest.setTimeout(10000);

const client = DynamoDBClient;

describe('Reports', () => {
  beforeAll(async () => {
    await Promise.all([
      client.bulk(Environment.TABLE_NAME_GROUPS, COMMONS.DB_GROUPS),
      client.bulk(Environment.TABLE_NAME_CURRICULUMS, COMMONS.DB_CURRICULUMS),
      client.bulk(Environment.TABLE_NAME_QUESTIONS, COMMONS.DB_QUESTIONS),
      client.bulk(Environment.TABLE_NAME_LEARNING, COMMONS.DB_LEARNING),
    ]);
  });

  afterAll(async () => {
    await Promise.all([
      client.truncateAll(Environment.TABLE_NAME_GROUPS),
      client.truncateAll(Environment.TABLE_NAME_CURRICULUMS),
      client.truncateAll(Environment.TABLE_NAME_QUESTIONS),
      client.truncateAll(Environment.TABLE_NAME_LEARNING),
    ]);
  });

  test('DailyTestQuestions001: 当日テスト問題一覧', async () => {
    const apiPath = `/v1/reports/questions/dailytest`;
    const uid = 'Google_109439805128280065775';
    const subject = '3';

    const res = await request(server)
      .post(apiPath)
      .set('guardian', HEADER_GUARDIAN)
      .send({
        uid: uid,
        subject: subject,
      } as APIs.DailyTestQuestionsRequest);

    // status code
    expect(res.statusCode).toBe(200);

    expect(res.body).toMatchObject(REPORTS.DAILYTEST001_EXPECTS);
  });
});
