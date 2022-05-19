import server from '@src/app';
import request from 'supertest';
import * as COMMONS from '../../datas/commons';
import * as CURRICULUMS from '../../datas/curriculums/order';
import { HEADER_GUARDIAN } from '@test/Commons';
import { DynamodbHelper } from '@alphax/dynamodb';
import { Environment } from '@consts';
import { APIs } from 'typings';
import { CurriculumService } from '@services';

jest.setTimeout(10000);

const client = new DynamodbHelper({ options: { endpoint: process.env['AWS_ENDPOINT_DYNAMODB'] } });

describe('Curriculums', () => {
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

  // // カリキュラム一覧
  // app.get('/v1/curriculums', express.json(), (req, res) => entry(req, res, CurriculumList));
  // // カリキュラム削除
  // app.delete('/v1/curriculums/:curriculumId', express.json(), (req, res) => entry(req, res, CurriculumRemove));
  // // カリキュラムの問題集一覧
  // app.get('/v1/curriculums/:curriculumId/questions', express.json(), (req, res) => entry(req, res, CurriculumQuestions));

  test('Order01: カリキュラム更新', async () => {
    const curriculumId = 'jkxRVJ1ggVEEUYNHAX8SxL';
    const apiPath = `/v1/curriculums/${curriculumId}/order`;

    const res = await request(server)
      .post(apiPath)
      .set('authorization', HEADER_GUARDIAN)
      .send({
        order: '3',
      } as APIs.CurriculumOrderRequest);

    const item = await CurriculumService.describe(curriculumId);

    // status code
    expect(res.statusCode).toBe(200);
    // response
    expect(res.body).toEqual(CURRICULUMS.CURRI_001_EXPECT_01);
    // database
    expect(item).toEqual(CURRICULUMS.CURRI_001_EXPECT_01);
  });

  test('Order02: Miss required parameter', async () => {
    const curriculumId = 'jkxRVJ1ggVEEUYNHAX8SxL';
    const apiPath = `/v1/curriculums/${curriculumId}/order`;

    const res = await request(server).post(apiPath).set('username', HEADER_GUARDIAN).send();

    // status code
    expect(res.statusCode).toBe(400);
    expect(res.text).toEqual('Required parameter: Order');
  });

  test('Order03: Curriculum not found', async () => {
    const curriculumId = 'DUMMY';
    const apiPath = `/v1/curriculums/${curriculumId}/order`;

    const res = await request(server)
      .post(apiPath)
      .set('authorization', HEADER_GUARDIAN)
      .send({
        order: '3',
      } as APIs.CurriculumOrderRequest);

    // status code
    expect(res.statusCode).toBe(400);
    expect(res.text).toEqual('Curriculum[DUMMY] not found.');
  });
});
