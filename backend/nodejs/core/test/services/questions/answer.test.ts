import server from '@src/app';
import request from 'supertest';
import * as COMMONS from '../../datas/commons';
import * as QUESTIONS from '../../datas/questions/answer';
import { HEADER_AUTH } from '@test/Commons';
import { DynamodbHelper } from '@alphax/dynamodb';
import { Environment } from '@consts';
import { APIs } from 'typings';
import { LearningService } from '@services';

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
      client.truncateAll(Environment.TABLE_NAME_WEEKLY_ABILITY),
      client.truncateAll(Environment.TABLE_NAME_QUESTIONS),
    ]);
  });

  test.skip('Answer01: 問題回答_正解', async () => {
    const apiPath = '/v1/study/daily/test/questions/Q001';

    const res = await request(server)
      .post(apiPath)
      .set('username', HEADER_AUTH)
      .send({
        correct: '1',
      } as APIs.QuestionAnswerRequest);

    // status code
    expect(res.statusCode).toBe(200);

    const result = await LearningService.describe('Q001', '84d95083-9ee8-4187-b6e7-8123558ef2c1');

    expect(result).toMatchObject(QUESTIONS.ANSWER001_REQUEST);
  });
});
