import server from '@src/app';
import request from 'supertest';
import * as COMMONS from '../../datas/commons';
import { DynamoDBClient, HEADER_AUTH, HEADER_USER } from '@test/Commons';

import { Environment } from '@consts';
import { CurriculumService, GroupService, LearningService, QuestionService } from '@services';
import { APIs } from 'typings';

const client = DynamoDBClient;

jest.setTimeout(15000);

describe('Question Transfer', () => {
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

  test('Transfer01: 更新前後とも学習していない', async () => {
    const gid = 'uVrvSNr9bbFxaJrxD9i1uo';
    const qid = '16JJ2BiBMq6qoNzVNSmjGJ';
    const newGid = '2GC1rgutnVKg9PqR2FLUAv';
    const apiPath = `/v1/groups/${gid}/questions/${qid}/transfer`;

    const [prevQuestion, oldGroup, newGroup, oldCurriculum, newCurriculum, prevLearning] = await Promise.all([
      QuestionService.describe(qid),
      GroupService.describe(gid),
      GroupService.describe(newGid),
      CurriculumService.queryByGroup(gid, HEADER_USER),
      CurriculumService.queryByGroup(newGid, HEADER_USER),
      LearningService.describe(qid, HEADER_USER),
    ]);

    // 変更前グループID
    expect(prevQuestion?.groupId).toEqual(gid);
    // 学習していない（旧）
    expect(oldCurriculum).toBeUndefined();
    // 学習していない（新）
    expect(newCurriculum).toBeUndefined();
    // 学習していない
    expect(prevLearning).toBeUndefined();

    const res = await request(server)
      .post(apiPath)
      .set('username', HEADER_AUTH)
      .send({
        newGroupId: newGid,
      } as APIs.QuestionTransferRequest);

    // status code
    expect(res.statusCode).toBe(200);

    const results = await Promise.all([
      QuestionService.describe(qid),
      GroupService.describe(gid),
      GroupService.describe(newGid),
      LearningService.describe(qid, HEADER_USER),
    ]);

    // グループID
    expect(results[0]?.groupId).toEqual(newGid);
    // 旧グループ問題数
    expect(results[1]?.count).toEqual(oldGroup!.count - 1);
    // 新グループ問題数
    expect(results[2]?.count).toEqual(newGroup!.count + 1);
    // 学習していない
    expect(results[3]).toBeUndefined();
  });

  test('Transfer02: 更新前のグループは学習中', async () => {
    const gid = 'sGd6gX36nvnMaSCDTiYZ2Z';
    const qid = '85EuLteEPQ4pzcYN442PUX';
    const newGid = 'wXtkuF2vzjHPsohPoyuxRg';
    const apiPath = `/v1/groups/${gid}/questions/${qid}/transfer`;

    const [prevQuestion, oldGroup, newGroup, oldCurriculum, newCurriculum, prevLearning] = await Promise.all([
      QuestionService.describe(qid),
      GroupService.describe(gid),
      GroupService.describe(newGid),
      CurriculumService.queryByGroup(gid, HEADER_USER),
      CurriculumService.queryByGroup(newGid, HEADER_USER),
      LearningService.describe(qid, HEADER_USER),
    ]);

    // 変更前グループID
    expect(prevQuestion?.groupId).toEqual(gid);
    // カリキュラム学習している（旧）
    expect(oldCurriculum).not.toBeUndefined();
    // カリキュラム学習していない（新）
    expect(newCurriculum).toBeUndefined();
    // 問題学習している
    expect(prevLearning).not.toBeUndefined();

    const res = await request(server)
      .post(apiPath)
      .set('username', HEADER_AUTH)
      .send({
        newGroupId: newGid,
      } as APIs.QuestionTransferRequest);

    // status code
    expect(res.statusCode).toBe(200);

    const results = await Promise.all([
      QuestionService.describe(qid),
      GroupService.describe(gid),
      GroupService.describe(newGid),
      LearningService.describe(qid, HEADER_USER),
      CurriculumService.queryByGroup(gid, HEADER_USER),
    ]);

    // グループID
    expect(results[0]?.groupId).toEqual(newGid);
    // 旧グループ問題数
    expect(results[1]?.count).toEqual(oldGroup!.count - 1);
    // 新グループ問題数
    expect(results[2]?.count).toEqual(newGroup!.count + 1);
    // 学習中の問題が削除される
    expect(results[3]).toBeUndefined();
    // 未学習のカンウントが減る
    expect(results[4]?.unlearned).toEqual(oldCurriculum!.unlearned - 1);
  });

  test('Transfer03: 更新後のグループは学習中', async () => {
    const gid = 'wXtkuF2vzjHPsohPoyuxRg';
    const qid = '1mvsZVTwwt1jLAdwnjwywu';
    const newGid = 'sGd6gX36nvnMaSCDTiYZ2Z';
    const apiPath = `/v1/groups/${gid}/questions/${qid}/transfer`;

    const [prevQuestion, oldGroup, newGroup, oldCurriculum, newCurriculum, prevLearning] = await Promise.all([
      QuestionService.describe(qid),
      GroupService.describe(gid),
      GroupService.describe(newGid),
      CurriculumService.queryByGroup(gid, HEADER_USER),
      CurriculumService.queryByGroup(newGid, HEADER_USER),
      LearningService.describe(qid, HEADER_USER),
    ]);

    // 変更前グループID
    expect(prevQuestion?.groupId).toEqual(gid);
    // カリキュラム学習している（旧）
    expect(oldCurriculum).toBeUndefined();
    // カリキュラム学習していない（新）
    expect(newCurriculum).not.toBeUndefined();
    // 問題学習している
    expect(prevLearning).toBeUndefined();

    const res = await request(server)
      .post(apiPath)
      .set('username', HEADER_AUTH)
      .send({
        newGroupId: newGid,
      } as APIs.QuestionTransferRequest);

    // status code
    expect(res.statusCode).toBe(200);

    const results = await Promise.all([
      QuestionService.describe(qid),
      GroupService.describe(gid),
      GroupService.describe(newGid),
      LearningService.describe(qid, HEADER_USER),
      CurriculumService.queryByGroup(newGid, HEADER_USER),
    ]);

    // グループID
    expect(results[0]?.groupId).toEqual(newGid);
    // 旧グループ問題数
    expect(results[1]?.count).toEqual(oldGroup!.count - 1);
    // 新グループ問題数
    expect(results[2]?.count).toEqual(newGroup!.count + 1);
    // 学習中の問題が削除される
    expect(results[3]).not.toBeUndefined();
    // 未学習のカンウントが減る
    expect(results[4]?.unlearned).toEqual(newCurriculum!.unlearned + 1);
  });

  test('Transfer04: 更新前後のグループともに学習中', async () => {
    const gid = 'sGd6gX36nvnMaSCDTiYZ2Z';
    const qid = '85EuLteEPQ4pzcYN442PUX';
    const newGid = 'v4kBKX6owmewxcVUp1mQvf';
    const apiPath = `/v1/groups/${gid}/questions/${qid}/transfer`;

    const [prevQuestion, oldGroup, newGroup, oldCurriculum, newCurriculum, prevLearning] = await Promise.all([
      QuestionService.describe(qid),
      GroupService.describe(gid),
      GroupService.describe(newGid),
      CurriculumService.queryByGroup(gid, HEADER_USER),
      CurriculumService.queryByGroup(newGid, HEADER_USER),
      LearningService.describe(qid, HEADER_USER),
    ]);

    // 変更前グループID
    expect(prevQuestion?.groupId).toEqual(gid);
    // カリキュラム学習している（旧）
    expect(oldCurriculum).not.toBeUndefined();
    // カリキュラム学習していない（新）
    expect(newCurriculum).not.toBeUndefined();
    // 問題学習している
    expect(prevLearning?.groupId).toEqual(gid);

    const res = await request(server)
      .post(apiPath)
      .set('username', HEADER_AUTH)
      .send({
        newGroupId: newGid,
      } as APIs.QuestionTransferRequest);

    // status code
    expect(res.statusCode).toBe(200);

    const results = await Promise.all([
      QuestionService.describe(qid),
      GroupService.describe(gid),
      GroupService.describe(newGid),
      LearningService.describe(qid, HEADER_USER),
      CurriculumService.queryByGroup(gid, HEADER_USER),
      CurriculumService.queryByGroup(newGid, HEADER_USER),
    ]);

    // グループID
    expect(results[0]?.groupId).toEqual(newGid);
    // 旧グループ問題数
    expect(results[1]?.count).toEqual(oldGroup!.count - 1);
    // 新グループ問題数
    expect(results[2]?.count).toEqual(newGroup!.count + 1);
    // 学習中の問題のグループIDが代わる
    expect(results[3]?.groupId).toEqual(newGid);
    // 未学習のカンウントが減る
    expect(results[4]?.unlearned).toEqual(oldCurriculum!.unlearned - 1);
    expect(results[5]?.unlearned).toEqual(newCurriculum!.unlearned + 1);
  });
});
