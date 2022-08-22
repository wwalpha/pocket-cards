import { DBHelper } from '@utils';
import server from '@src/app';
import request from 'supertest';
import * as CURRICULUMS from '../../datas/curriculums/regist';
import * as COMMONS from '../../datas/commons';
import { HEADER_GUARDIAN, HEADER_USER } from '@test/Commons';
import { DynamodbHelper } from '@alphax/dynamodb';
import { Environment } from '@consts';
import { APIs, Tables } from 'typings';
import { orderBy } from 'lodash';
import { LearningService } from '@services';

const client = new DynamodbHelper({ options: { endpoint: process.env['AWS_ENDPOINT_DYNAMODB'] } });

jest.setTimeout(10000);

describe('Curriculums', () => {
  beforeEach(async () => {
    await Promise.all([
      client.bulk(Environment.TABLE_NAME_GROUPS, COMMONS.DB_GROUPS),
      client.bulk(Environment.TABLE_NAME_CURRICULUMS, COMMONS.DB_CURRICULUMS),
      client.bulk(Environment.TABLE_NAME_LEARNING, COMMONS.DB_LEARNING),
      client.bulk(Environment.TABLE_NAME_QUESTIONS, COMMONS.DB_QUESTIONS),
      client.bulk(Environment.TABLE_NAME_WEEKLY_ABILITY, COMMONS.DB_ABILITY),
    ]);
  });

  afterEach(async () => {
    await Promise.all([
      client.truncateAll(Environment.TABLE_NAME_GROUPS),
      client.truncateAll(Environment.TABLE_NAME_CURRICULUMS),
      client.truncateAll(Environment.TABLE_NAME_LEARNING),
      client.truncateAll(Environment.TABLE_NAME_QUESTIONS),
      client.truncateAll(Environment.TABLE_NAME_WEEKLY_ABILITY),
    ]);
  });

  test.skip('Curriculums01:カリキュラム登録_普通', async () => {
    const apiPath = '/v1/curriculums';

    const res = await request(server)
      .post(apiPath)
      .set('username', HEADER_GUARDIAN)
      .send(CURRICULUMS.CURRI_001_REQ as APIs.CurriculumRegistRequest);

    // status code
    expect(res.statusCode).toBe(200);

    const response = res.body as APIs.CurriculumRegistResponse;

    const learning = await LearningService.listByUser(HEADER_USER, 'uVrvSNr9bbFxaJrxD9i1uo');
    const curriculum = await DBHelper().get({
      TableName: Environment.TABLE_NAME_CURRICULUMS,
      Key: {
        id: response.id,
      } as Tables.TCurriculumsKey,
    });

    expect(orderBy(learning, 'qid')).toMatchObject(CURRICULUMS.CURRI_001_EXPECT_01);
    expect(curriculum?.Item).toMatchObject(CURRICULUMS.CURRI_001_EXPECT_02);
  });

  test.skip('Curriculums02:カリキュラム登録_実力', async () => {
    const apiPath = '/v1/curriculums';

    const res = await request(server)
      .post(apiPath)
      .set('username', HEADER_GUARDIAN)
      .send(CURRICULUMS.CURRI_002_REQ as APIs.CurriculumRegistRequest);

    // status code
    expect(res.statusCode).toBe(200);

    const response = res.body as APIs.CurriculumRegistResponse;

    const ability = await DBHelper().scan({ TableName: Environment.TABLE_NAME_WEEKLY_ABILITY });
    const curriculum = await DBHelper().get({
      TableName: Environment.TABLE_NAME_CURRICULUMS,
      Key: {
        id: response.id,
      } as Tables.TCurriculumsKey,
    });

    expect(orderBy(ability.Items, 'qid')).toMatchObject(CURRICULUMS.CURRI_002_EXPECT_01);
    expect(curriculum?.Item).toMatchObject(CURRICULUMS.CURRI_002_EXPECT_02);
  });

  test.skip('Curriculums03: Group Id not exists', async () => {
    const apiPath = '/v1/curriculums';

    const res = await request(server)
      .post(apiPath)
      .set('username', HEADER_GUARDIAN)
      .send(CURRICULUMS.CURRI_003_REQ as APIs.CurriculumRegistRequest);

    // status code
    expect(res.statusCode).toBe(400);
    expect(res.text).toEqual('Group informations not found.');
  });

  test.skip('Curriculums04: Bad request', async () => {
    const apiPath = '/v1/curriculums';

    const res = await request(server)
      .post(apiPath)
      .set('username', HEADER_GUARDIAN)
      .send(CURRICULUMS.CURRI_004_REQ as APIs.CurriculumRegistRequest);

    // status code
    expect(res.statusCode).toBe(400);
    expect(res.text).toEqual('Parameter check error.');
  });

  test.skip('Curriculums05: No Question', async () => {
    const apiPath = '/v1/curriculums';

    const res = await request(server)
      .post(apiPath)
      .set('username', HEADER_GUARDIAN)
      .send(CURRICULUMS.CURRI_005_REQ as APIs.CurriculumRegistRequest);

    // status code
    expect(res.statusCode).toBe(400);
    expect(res.text).toEqual('No questions in group');
  });

  test.skip('Curriculums06: No Question', async () => {
    const apiPath = '/v1/curriculums';

    const res = await request(server)
      .post(apiPath)
      .set('username', HEADER_GUARDIAN)
      .send(CURRICULUMS.CURRI_006_REQ as APIs.CurriculumRegistRequest);

    // status code
    expect(res.statusCode).toBe(400);
    expect(res.text).toEqual('No questions in group');
  });

  test('Curriculums07: 英語初回登録', async () => {
    const apiPath = '/v1/curriculums';

    const res = await request(server)
      .post(apiPath)
      .set('username', HEADER_GUARDIAN)
      .send(CURRICULUMS.CURRI_006_REQ as APIs.CurriculumRegistRequest);

    const response = res.body as APIs.CurriculumRegistResponse;

    // status code
    expect(res.statusCode).toBe(200);

    const learning = await LearningService.listByUser(HEADER_USER, 'jzqKogQQw7nvZnrkrQaMWN');
    const curriculum = await DBHelper().get({
      TableName: Environment.TABLE_NAME_CURRICULUMS,
      Key: {
        id: response.id,
      } as Tables.TCurriculumsKey,
    });

    expect(orderBy(learning, 'qid')).toMatchObject(CURRICULUMS.CURRI_006_EXPECT_01);
    expect(curriculum?.Item).toMatchObject(CURRICULUMS.CURRI_006_EXPECT_02);
  });
});
