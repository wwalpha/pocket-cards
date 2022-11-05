import server from '@src/app';
import request from 'supertest';
import * as COMMONS from '../../../datas/commons';
import * as QUESTIONS from '../../../datas/questions/answer';
import { HEADER_USER } from '@test/Commons';
import { DynamodbHelper } from '@alphax/dynamodb';
import { Environment } from '@consts';
import { APIs } from 'typings';
import { CurriculumService, LearningService } from '@services';
import moment from 'moment';

const client = new DynamodbHelper({ options: { endpoint: process.env['AWS_ENDPOINT_DYNAMODB'] } });

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

  test('Answer01: 問題回答_正解', async () => {
    const qid = 'xtk4W9TSsxSMmTifVxeFLA';
    const before = await LearningService.describe(qid, HEADER_USER);
    const apiPath = '/v1/study/daily/answer';

    const res = await request(server)
      .post(apiPath)
      .set('username', HEADER_USER)
      .send({
        qid: qid,
        correct: '1',
      } as APIs.QuestionAnswerRequest);

    // status code
    expect(res.statusCode).toBe(200);

    const after = await LearningService.describe(qid, HEADER_USER);

    expect(after).not.toBeUndefined();

    if (!before || !after) return;

    before.lastTime = moment().format('YYYYMMDD');
    before.nextTime = moment().add(2, 'days').format('YYYYMMDD');
    before.times += 1;

    expect(before).toMatchObject(after);
  });

  test('Answer02: 問題回答_不正解', async () => {
    const qid = 'xtk4W9TSsxSMmTifVxeFLA';
    const userId = HEADER_USER;
    const before = await LearningService.describe(qid, userId);
    const apiPath = '/v1/study/daily/answer';

    const res = await request(server)
      .post(apiPath)
      .set('username', userId)
      .send({
        qid: qid,
        correct: '0',
      } as APIs.QuestionAnswerRequest);

    // status code
    expect(res.statusCode).toBe(200);

    const after = await LearningService.describe(qid, userId);

    expect(after).not.toBeUndefined();

    if (!before || !after) return;

    before.lastTime = moment().format('YYYYMMDD');
    before.nextTime = moment().format('YYYYMMDD');
    before.times = 0;

    expect(before).toMatchObject(after);
  });

  test('Answer04: 問題存在しない', async () => {
    const qid = 'Q001';
    const userId = HEADER_USER;
    const apiPath = '/v1/study/daily/answer';

    const res = await request(server)
      .post(apiPath)
      .set('username', userId)
      .send({
        qid: qid,
        correct: '1',
      } as APIs.QuestionAnswerRequest);

    // status code
    expect(res.statusCode).toBe(400);
    expect(res.text).toEqual('Question was not found. Q001');
  });

  test('Answer05: 問題回答_正解_初回学習', async () => {
    const qid = '8QZG2k5o43o1acnT2NCyDY';
    const curriculumId = 'vB6cUPdMB8TJFSrypGwoML';
    const userId = HEADER_USER;
    const before = await LearningService.describe(qid, userId);
    const apiPath = '/v1/study/daily/answer';

    const res = await request(server)
      .post(apiPath)
      .set('username', userId)
      .send({
        qid: qid,
        correct: '1',
      } as APIs.QuestionAnswerRequest);

    // status code
    expect(res.statusCode).toBe(200);

    const after = await LearningService.describe(qid, userId);
    const curriculum = await CurriculumService.describe(curriculumId);

    expect(after).not.toBeUndefined();

    if (!before || !after) return;

    before.lastTime = moment().format('YYYYMMDD');
    before.nextTime = moment().add(1, 'days').format('YYYYMMDD');
    before.times = 1;

    expect(before).toMatchObject(after);
    expect(curriculum).toMatchObject(QUESTIONS.ANSWER005_EXPECT_LEARNING);
  });
});
