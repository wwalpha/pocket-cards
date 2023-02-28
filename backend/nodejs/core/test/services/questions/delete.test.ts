import server from '@src/app';
import request from 'supertest';
import * as COMMONS from '../../datas/commons';
import * as QUESTIONS from '../../datas/questions/delete';
import { DynamoDBClient, HEADER_AUTH } from '@test/Commons';

import { Environment } from '@consts';
import { GroupService, LearningService, QuestionService } from '@services';

const client = DynamoDBClient;

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

  test('Delete01: 質問削除', async () => {
    const qid = '8QZG2k5o43o1acnT2NCyDY';
    const gid = 'uDf4fvg3yMAYKgvYBPydt9';
    const apiPath = `/v1/groups/${gid}/questions/${qid}`;

    const res = await request(server).delete(apiPath).set('username', HEADER_AUTH);
    const question = await QuestionService.describe(qid);
    const learnings = await LearningService.listByQuestion(qid);
    const group = await GroupService.describe(gid);

    // status code
    expect(res.statusCode).toBe(200);
    expect(question).toBeUndefined();
    expect(learnings.length).toBe(0);
    expect(group).toEqual(QUESTIONS.DELETE001_EXPECT_GROUP);
  });
});
