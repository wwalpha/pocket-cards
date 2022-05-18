import { DBHelper } from '@utils';
import server from '@src/app';
import request from 'supertest';
import * as CURRICULUMS from '../../datas/curriculums/regist';
import { HEADER_USER } from '@test/Commons';
import { DynamodbHelper } from '@alphax/dynamodb';
import { Environment } from '@consts';
import { APIs, Tables } from 'typings';
import { orderBy } from 'lodash';

const client = new DynamodbHelper({ options: { endpoint: process.env['AWS_ENDPOINT_DYNAMODB'] } });

jest.setTimeout(10000);

describe('Curriculums', () => {
  afterEach(async () => {
    await client.truncateAll(Environment.TABLE_NAME_GROUPS);
    await client.truncateAll(Environment.TABLE_NAME_LEARNING);
    await client.truncateAll(Environment.TABLE_NAME_CURRICULUMS);
    await client.truncateAll(Environment.TABLE_NAME_WEEKLY_ABILITY);
    await client.truncateAll(Environment.TABLE_NAME_QUESTIONS);
  });

  test('Curriculums01:カリキュラム登録_普通', async () => {
    await client.bulk(Environment.TABLE_NAME_GROUPS, CURRICULUMS.CURRI_001_DB_GROUP);
    await client.bulk(Environment.TABLE_NAME_QUESTIONS, CURRICULUMS.CURRI_001_DB_QUESTIONS);

    const apiPath = '/v1/curriculums';

    const res = await request(server)
      .post(apiPath)
      .set('username', HEADER_USER)
      .send(CURRICULUMS.CURRI_001_REQ as APIs.CurriculumRegistRequest);

    // status code
    expect(res.statusCode).toBe(200);

    const response = res.body as APIs.CurriculumRegistResponse;

    const learning = await DBHelper().scan({ TableName: Environment.TABLE_NAME_LEARNING });
    const curriculum = await DBHelper().get({
      TableName: Environment.TABLE_NAME_CURRICULUMS,
      Key: {
        id: response.id,
      } as Tables.TCurriculumsKey,
    });

    expect(orderBy(learning.Items, 'qid')).toMatchObject(CURRICULUMS.CURRI_001_EXPECT_01);
    expect(curriculum?.Item).toMatchObject(CURRICULUMS.CURRI_001_EXPECT_02);
  });

  test('Curriculums02:カリキュラム登録_実力', async () => {
    await client.bulk(Environment.TABLE_NAME_GROUPS, CURRICULUMS.CURRI_002_DB_GROUP);
    await client.bulk(Environment.TABLE_NAME_WEEKLY_ABILITY, CURRICULUMS.CURRI_002_DB_ABILITY);
    await client.bulk(Environment.TABLE_NAME_QUESTIONS, CURRICULUMS.CURRI_002_DB_QUESTIONS);

    const apiPath = '/v1/curriculums';

    const res = await request(server)
      .post(apiPath)
      .set('username', HEADER_USER)
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

  test('Curriculums03: Group Id not exists', async () => {
    await client.bulk(Environment.TABLE_NAME_GROUPS, CURRICULUMS.CURRI_003_DB_GROUP);

    const apiPath = '/v1/curriculums';

    const res = await request(server)
      .post(apiPath)
      .set('username', HEADER_USER)
      .send(CURRICULUMS.CURRI_003_REQ as APIs.CurriculumRegistRequest);

    // status code
    expect(res.statusCode).toBe(400);
    expect(res.text).toEqual('Group informations not found.');
  });

  test('Curriculums04: Bad request', async () => {
    const apiPath = '/v1/curriculums';

    const res = await request(server)
      .post(apiPath)
      .set('username', HEADER_USER)
      .send(CURRICULUMS.CURRI_004_REQ as APIs.CurriculumRegistRequest);

    // status code
    expect(res.statusCode).toBe(400);
    expect(res.text).toEqual('Parameter check error.');
  });

  test('Curriculums05: No Question', async () => {
    await client.bulk(Environment.TABLE_NAME_GROUPS, CURRICULUMS.CURRI_005_DB_GROUP);

    const apiPath = '/v1/curriculums';

    const res = await request(server)
      .post(apiPath)
      .set('username', HEADER_USER)
      .send(CURRICULUMS.CURRI_005_REQ as APIs.CurriculumRegistRequest);

    // status code
    expect(res.statusCode).toBe(400);
    expect(res.text).toEqual('No questions in group');
  });

  test('Curriculums06: No Question', async () => {
    await client.bulk(Environment.TABLE_NAME_GROUPS, CURRICULUMS.CURRI_006_DB_GROUP);

    const apiPath = '/v1/curriculums';

    const res = await request(server)
      .post(apiPath)
      .set('username', HEADER_USER)
      .send(CURRICULUMS.CURRI_006_REQ as APIs.CurriculumRegistRequest);

    // status code
    expect(res.statusCode).toBe(400);
    expect(res.text).toEqual('No questions in group');
  });
});
