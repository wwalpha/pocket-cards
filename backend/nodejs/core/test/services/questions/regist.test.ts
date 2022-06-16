import server from '@src/app';
import request from 'supertest';
import * as COMMONS from '../../datas/commons';
import * as QUESTIONS from '../../datas/questions/regist';
import { HEADER_AUTH } from '@test/Commons';
import { DynamodbHelper } from '@alphax/dynamodb';
import { Environment } from '@consts';
import { CurriculumService, LearningService, QuestionService } from '@services';
import { APIs } from 'typings';

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

  test('Regist01: 問題一括登録_英語以外_カリキュラム登録なし', async () => {
    const apiPath = '/v1/groups/2GC1rgutnVKg9PqR2FLUAv/questions';

    const res = await request(server).post(apiPath).set('username', HEADER_AUTH).send(QUESTIONS.REGIST001_REQ);
    const response = res.body as APIs.QuestionRegistResponse;

    // status code
    expect(res.statusCode).toBe(200);
    expect(response.count).toBe(1);

    const qid = response.ids[0] ?? '';
    const question = await QuestionService.describe(qid);

    expect(question).toMatchObject(QUESTIONS.REGIST001_EXPECT01);
  });

  test('Regist02: 問題一括登録_英語以外_カリキュラム登録あり', async () => {
    const groupId = 'uDf4fvg3yMAYKgvYBPydt9';
    const apiPath = `/v1/groups/${groupId}/questions`;

    const res = await request(server).post(apiPath).set('username', HEADER_AUTH).send(QUESTIONS.REGIST002_REQUEST);
    const response = res.body as APIs.QuestionRegistResponse;

    // status code
    expect(res.statusCode).toBe(200);
    expect(response.count).toBe(1);

    const qid = response.ids[0] ?? '';
    const question = await QuestionService.describe(qid);
    const curriculums = await CurriculumService.listByGroup(groupId);

    const learnings = await Promise.all(curriculums.map((item) => LearningService.describe(qid, item.userId)));

    expect(question).toMatchObject(QUESTIONS.REGIST002_EXPECT_QUESTION);
    expect(learnings).toMatchObject(QUESTIONS.REGIST002_EXPECT_LEARNING);
  });

  test('Regist03: グループが存在しない', async () => {
    const groupId = 'G001';
    const apiPath = `/v1/groups/${groupId}/questions`;

    const res = await request(server).post(apiPath).set('username', HEADER_AUTH).send(QUESTIONS.REGIST003_REQUEST);

    // status code
    expect(res.statusCode).toBe(400);
    expect(res.text).toEqual(`Group id is not exist. ${groupId}`);
  });
});
