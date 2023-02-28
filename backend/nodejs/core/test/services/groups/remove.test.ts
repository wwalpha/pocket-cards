import server from '@src/app';
import request from 'supertest';
import * as COMMONS from '../../datas/commons';
import { DynamoDBClient, HEADER_AUTH, HEADER_USER } from '@test/Commons';
import { Environment } from '@consts';
import { CurriculumService, GroupService, LearningService, QuestionService } from '@services';

const client = DynamoDBClient;

jest.setTimeout(10000);

describe('Groups', () => {
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

  test('Remove01: グループ削除', async () => {
    const gid = 'sGd6gX36nvnMaSCDTiYZ2Z';
    const apiPath = `/v1/groups/${gid}`;

    const res = await request(server).delete(apiPath).set('username', HEADER_USER).send();

    // status code
    expect(res.statusCode).toBe(200);

    const learnings = await LearningService.listByGroup(gid);
    const curriculums = await CurriculumService.listByGroup(gid);
    const questions = await QuestionService.listByGroup(gid);
    const groupInfo = await GroupService.describe(gid);

    expect(learnings.length).toBe(0);
    expect(curriculums.length).toBe(0);
    expect(questions.length).toBe(0);
    expect(groupInfo).toBeUndefined();
  });

  test('Remove03: グループ存在しない', async () => {
    const gid = 'G001';
    const apiPath = `/v1/groups/${gid}`;

    const res = await request(server).delete(apiPath).set('username', HEADER_AUTH).send();

    // status code
    expect(res.statusCode).toBe(400);
    expect(res.text).toBe('Group not found. G001');
  });
});
