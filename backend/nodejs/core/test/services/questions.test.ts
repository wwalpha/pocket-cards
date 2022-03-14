import { DBHelper } from '@utils';
import server from '@src/server';
import request from 'supertest';
import * as QUESTIONS from '../datas/questions';
import { HEADER_AUTH } from '@test/Commons';
import { DynamodbHelper } from '@alphax/dynamodb';
import { Environment } from '@consts';
import { Tables, APIs } from 'typings';
import { Learning, Questions } from '@queries';
import orderBy from 'lodash/orderBy';

const client = new DynamodbHelper({ options: { endpoint: process.env.AWS_ENDPOINT } });

jest.setTimeout(10000);

describe('d0', () => {
  afterEach(async () => {
    await client.truncateAll(Environment.TABLE_NAME_GROUPS);
    await client.truncateAll(Environment.TABLE_NAME_QUESTIONS);
    await client.truncateAll(Environment.TABLE_NAME_LEARNING);
  });

  test('Question01:問題一括登録', async () => {
    await client.bulk(Environment.TABLE_NAME_GROUPS, QUESTIONS.REGIST001_DB_GROUP);

    const apiPath = '/v1/groups/G001/questions';

    const res = await request(server).post(apiPath).set('authorization', HEADER_AUTH).send(QUESTIONS.REGIST001_REQ);

    // status code
    expect(res.statusCode).toBe(200);

    const questions = await DBHelper().scan({ TableName: Environment.TABLE_NAME_QUESTIONS });
    const learning = await DBHelper().scan({ TableName: Environment.TABLE_NAME_LEARNING });

    expect(questions.Items.length).toBe(2);
    expect(learning.Items.length).toBe(2);

    // const learningItems = orderBy(learning.Items, 'qid');
    // const questionItems = orderBy(questions.Items, 'id');

    // expect(learningItems).toMatchObject(QUESTIONS.REGIST001_EXPECT01);
    // expect(questionItems).toMatchObject(QUESTIONS.REGIST001_EXPECT02);
  });

  test('Question02:学習問題一覧', async () => {
    await client.bulk(Environment.TABLE_NAME_QUESTIONS, QUESTIONS.STUDY002_DB_QUESTIONS);
    await client.bulk(Environment.TABLE_NAME_LEARNING, QUESTIONS.STUDY002_DB_LEARNING);

    const apiPath = '/v1/questions/study';

    const res = await request(server)
      .get(apiPath)
      .query({
        subject: '2',
      })
      .set('authorization', HEADER_AUTH);

    // status code
    expect(res.statusCode).toBe(200);

    expect(res.body).toEqual(QUESTIONS.STUDY002_EXPECT01);
  });

  test('Question03:テスト問題一覧', async () => {
    await client.bulk(Environment.TABLE_NAME_QUESTIONS, QUESTIONS.TEST003_DB_QUESTIONS);
    await client.bulk(Environment.TABLE_NAME_LEARNING, QUESTIONS.TEST003_DB_LEARNING);

    const apiPath = '/v1/questions/test';

    const res = await request(server)
      .get(apiPath)
      .query({
        subject: '2',
      })
      .set('authorization', HEADER_AUTH);

    // status code
    expect(res.statusCode).toBe(200);

    expect(res.body).toEqual(QUESTIONS.TEST003_EXPECT01);
  });

  test('Question04:問題回答_正解', async () => {
    await client.bulk(Environment.TABLE_NAME_LEARNING, QUESTIONS.ANSWER04_DB_LEARNING);

    const apiPath = '/v1/questions/Q001/answer';

    const res = await request(server)
      .post(apiPath)
      .set('authorization', HEADER_AUTH)
      .send({
        correct: '1',
      } as APIs.QuestionAnswerRequest);

    // status code
    expect(res.statusCode).toBe(200);

    const result = await DBHelper().get(Learning.get({ qid: 'Q001' }));

    expect(result?.Item).toMatchObject(QUESTIONS.ANSWER04_EXPECT01);
  });

  test('Question05:問題回答_不正解', async () => {
    await client.bulk(Environment.TABLE_NAME_LEARNING, QUESTIONS.ANSWER05_DB_LEARNING);

    const apiPath = '/v1/questions/Q001/answer';

    const res = await request(server)
      .post(apiPath)
      .set('authorization', HEADER_AUTH)
      .send({
        correct: '0',
      } as APIs.QuestionAnswerRequest);

    // status code
    expect(res.statusCode).toBe(200);

    const result = await DBHelper().get(Learning.get({ qid: 'Q001' }));

    expect(result?.Item).toMatchObject(QUESTIONS.ANSWER05_EXPECT01);
  });
});