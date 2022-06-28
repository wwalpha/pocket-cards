import server from '@src/app';
import request from 'supertest';
import * as COMMONS from '../../datas/commons';
import * as QUESTIONS from '../../datas/questions/answer';
import { HEADER_USER } from '@test/Commons';
import { DynamodbHelper } from '@alphax/dynamodb';
import { Environment } from '@consts';
import { APIs } from 'typings';
import { CurriculumService, LearningService } from '@services';
import moment from 'moment';

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

  test('Answer01: 問題回答_正解', async () => {
    const before = await LearningService.describe('xtk4W9TSsxSMmTifVxeFLA', 'Google_109439805128280065775');
    const apiPath = '/v1/study/daily/test/questions/xtk4W9TSsxSMmTifVxeFLA';

    const res = await request(server)
      .post(apiPath)
      .set('username', HEADER_USER)
      .send({
        correct: '1',
      } as APIs.QuestionAnswerRequest);

    // status code
    expect(res.statusCode).toBe(200);

    const after = await LearningService.describe('xtk4W9TSsxSMmTifVxeFLA', 'Google_109439805128280065775');

    expect(after).not.toBeUndefined();

    if (!before || !after) return;

    before.lastTime = moment().format('YYYYMMDD');
    before.nextTime = moment().add(2, 'days').format('YYYYMMDD');
    before.times += 1;

    expect(before).toMatchObject(after);
  });

  test('Answer02: 問題回答_不正解', async () => {
    const before = await LearningService.describe('xtk4W9TSsxSMmTifVxeFLA', 'Google_109439805128280065775');

    const apiPath = '/v1/study/daily/test/questions/xtk4W9TSsxSMmTifVxeFLA';

    const res = await request(server)
      .post(apiPath)
      .set('username', HEADER_USER)
      .send({
        correct: '0',
      } as APIs.QuestionAnswerRequest);

    // status code
    expect(res.statusCode).toBe(200);

    const after = await LearningService.describe('xtk4W9TSsxSMmTifVxeFLA', 'Google_109439805128280065775');

    expect(after).not.toBeUndefined();

    if (!before || !after) return;

    before.lastTime = moment().format('YYYYMMDD');
    before.nextTime = moment().format('YYYYMMDD');
    before.times = 0;

    expect(before).toMatchObject(after);
  });

  test('Answer03: 問題回答_正解_算数6回', async () => {
    const before = await LearningService.describe('fBTFsyZGVkknQtKBBpfuhJ', 'Google_109439805128280065775');
    const apiPath = '/v1/study/daily/test/questions/fBTFsyZGVkknQtKBBpfuhJ';

    const res = await request(server)
      .post(apiPath)
      .set('username', HEADER_USER)
      .send({
        correct: '1',
      } as APIs.QuestionAnswerRequest);

    // status code
    expect(res.statusCode).toBe(200);

    const after = await LearningService.describe('fBTFsyZGVkknQtKBBpfuhJ', 'Google_109439805128280065775');

    expect(after).not.toBeUndefined();

    if (!before || !after) return;

    before.lastTime = moment().format('YYYYMMDD');
    before.nextTime = '99991231';
    before.times += 1;

    expect(before).toMatchObject(after);
  });

  test('Answer04: 問題存在しない', async () => {
    const apiPath = '/v1/study/daily/test/questions/Q001';

    const res = await request(server)
      .post(apiPath)
      .set('username', HEADER_USER)
      .send({
        correct: '1',
      } as APIs.QuestionAnswerRequest);

    // status code
    expect(res.statusCode).toBe(400);
    expect(res.text).toEqual('Question not found. Q001');
  });

  test('Answer05: 問題回答_正解_初回学習', async () => {
    const before = await LearningService.describe('8QZG2k5o43o1acnT2NCyDY', 'Google_109439805128280065775');
    const apiPath = '/v1/study/daily/test/questions/8QZG2k5o43o1acnT2NCyDY';

    const res = await request(server)
      .post(apiPath)
      .set('username', HEADER_USER)
      .send({
        correct: '1',
      } as APIs.QuestionAnswerRequest);

    // status code
    expect(res.statusCode).toBe(200);

    const after = await LearningService.describe('8QZG2k5o43o1acnT2NCyDY', 'Google_109439805128280065775');
    const curriculum = await CurriculumService.describe('vB6cUPdMB8TJFSrypGwoML');

    expect(after).not.toBeUndefined();

    if (!before || !after) return;

    before.lastTime = moment().format('YYYYMMDD');
    before.nextTime = moment().add(1, 'days').format('YYYYMMDD');
    before.times = 1;

    expect(before).toMatchObject(after);
    expect(curriculum).toMatchObject(QUESTIONS.ANSWER005_EXPECT_LEARNING);
  });
});
