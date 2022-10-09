import server from '@src/app';
import request from 'supertest';
import { DynamodbHelper } from '@alphax/dynamodb';
import * as COMMONS from '../../datas/commons';
import * as WEEKLY from '../../datas/weekly';
import { Environment } from '@consts';
import { HEADER_USER } from '@test/Commons';
import { LearningService } from '@services';

const client = new DynamodbHelper({ options: { endpoint: process.env['AWS_ENDPOINT_DYNAMODB'] } });

describe('Weekly', () => {
  beforeAll(async () => {
    await Promise.all([
      client.bulk(Environment.TABLE_NAME_QUESTIONS, COMMONS.DB_QUESTIONS),
      client.bulk(Environment.TABLE_NAME_GROUPS, COMMONS.DB_GROUPS),
    ]);
  });
  afterAll(async () => {
    await Promise.all([
      client.truncateAll(Environment.TABLE_NAME_QUESTIONS),
      client.truncateAll(Environment.TABLE_NAME_GROUPS),
    ]);
  });

  beforeEach(async () => {
    await Promise.all([client.bulk(Environment.TABLE_NAME_LEARNING, COMMONS.DB_LEARNING)]);
  });
  afterEach(async () => {
    await Promise.all([client.truncateAll(Environment.TABLE_NAME_LEARNING)]);
  });

  test('WeeklyAnswer01: 正解', async () => {
    const qid = 'fBTFsyZGVkknQtKBBpfuhJ';
    const apiPath = `/v1/study/weekly/${qid}`;

    const res = await request(server).post(apiPath).set('username', HEADER_USER).send({
      correct: '1',
    });

    const item = await LearningService.describe(qid, HEADER_USER);

    // status code
    expect(res.statusCode).toBe(200);
    expect(item).toMatchObject(WEEKLY.ANSWER_01_EXPECT);
  });

  test('WeeklyAnswer02: 不正解', async () => {
    const qid = 'fBTFsyZGVkknQtKBBpfuhJ';
    const apiPath = `/v1/study/weekly/${qid}`;

    const res = await request(server).post(apiPath).set('username', HEADER_USER).send({
      correct: '0',
    });

    const item = await LearningService.describe(qid, HEADER_USER);

    // status code
    expect(res.statusCode).toBe(200);
    expect(item).toMatchObject(WEEKLY.ANSWER_02_EXPECT);
  });
});
