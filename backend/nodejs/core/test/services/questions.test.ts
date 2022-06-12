import server from '@src/app';
import request from 'supertest';
import * as QUESTIONS from '../datas/questions';
import { HEADER_AUTH } from '@test/Commons';
import { DynamodbHelper } from '@alphax/dynamodb';
import { Environment } from '@consts';
import { APIs } from 'typings';
import { LearningService } from '@services';

const client = new DynamodbHelper({ options: { endpoint: process.env['AWS_ENDPOINT_DYNAMODB'] } });

jest.setTimeout(10000);

describe('questions', () => {
  afterEach(async () => {
    await client.truncateAll(Environment.TABLE_NAME_GROUPS);
    await client.truncateAll(Environment.TABLE_NAME_QUESTIONS);
    await client.truncateAll(Environment.TABLE_NAME_LEARNING);
  });

  test('Question02:学習問題一覧', async () => {
    await client.bulk(Environment.TABLE_NAME_QUESTIONS, QUESTIONS.STUDY002_DB_QUESTIONS);
    await client.bulk(Environment.TABLE_NAME_LEARNING, QUESTIONS.STUDY002_DB_LEARNING);

    // TODO:
    // const apiPath = '/v1/study/daily/practice/questions';

    // const res = await request(server)
    //   .get(apiPath)
    //   .query({
    //     subject: '2',
    //   })
    //   .set('username', HEADER_AUTH);

    // status code
    // expect(res.statusCode).toBe(200);
    // expect(res.body).toEqual(QUESTIONS.STUDY002_EXPECT01);
  });

  test.skip('Question03:テスト問題一覧', async () => {
    await client.bulk(Environment.TABLE_NAME_QUESTIONS, QUESTIONS.TEST003_DB_QUESTIONS);
    await client.bulk(Environment.TABLE_NAME_LEARNING, QUESTIONS.TEST003_DB_LEARNING);

    const apiPath = '/v1/study/daily/test/questions';

    const res = await request(server)
      .get(apiPath)
      .query({
        subject: '2',
      })
      .set('username', HEADER_AUTH);

    // status code
    expect(res.statusCode).toBe(200);

    expect(res.body).toEqual(QUESTIONS.TEST003_EXPECT01);
  });

  test.skip('Question04:問題回答_正解', async () => {
    await client.bulk(Environment.TABLE_NAME_LEARNING, QUESTIONS.ANSWER04_DB_LEARNING);

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

    expect(result).toMatchObject(QUESTIONS.ANSWER04_EXPECT01);
  });

  test.skip('Question05:問題回答_不正解', async () => {
    await client.bulk(Environment.TABLE_NAME_LEARNING, QUESTIONS.ANSWER05_DB_LEARNING);

    const apiPath = '/v1/study/daily/test/questions/Q001';

    const res = await request(server)
      .post(apiPath)
      .set('username', HEADER_AUTH)
      .send({
        correct: '0',
      } as APIs.QuestionAnswerRequest);

    // status code
    expect(res.statusCode).toBe(200);

    const result = await LearningService.describe('Q001', '84d95083-9ee8-4187-b6e7-8123558ef2c1');

    expect(result).toMatchObject(QUESTIONS.ANSWER05_EXPECT01);
  });

  test.skip('Question06:質問一覧', async () => {
    await client.bulk(Environment.TABLE_NAME_QUESTIONS, QUESTIONS.DETAILS06_DB_QUESTIONS);
    await client.bulk(Environment.TABLE_NAME_GROUPS, QUESTIONS.DETAILS06_DB_GROUP);

    const apiPath = '/v1/groups/G001/questions';

    const res = await request(server).get(apiPath).set('username', HEADER_AUTH);

    // status code
    expect(res.statusCode).toBe(200);

    expect(res.body).toEqual(QUESTIONS.DETAILS06_EXPECT01);
  });
});
