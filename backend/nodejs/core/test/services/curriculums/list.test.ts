import axios, { AxiosStatic } from 'axios';
import server from '@src/app';
import request from 'supertest';
import * as COMMONS from '../../datas/commons';
import { HEADER_USER } from '@test/Commons';
import { DynamodbHelper } from '@alphax/dynamodb';
import { Environment } from '@consts';

jest.mock('axios');
jest.setTimeout(30000);

const client = new DynamodbHelper({ options: { endpoint: process.env['AWS_ENDPOINT_DYNAMODB'] } });
const api = axios as jest.Mocked<AxiosStatic>;

describe('Curriculums', () => {
  beforeEach(async () => {
    console.log(new Date().toUTCString());
    await Promise.all([
      client.bulk(Environment.TABLE_NAME_GROUPS, COMMONS.DB_GROUPS),
      client.bulk(Environment.TABLE_NAME_CURRICULUMS, COMMONS.DB_CURRICULUMS),
      client.bulk(Environment.TABLE_NAME_LEARNING, COMMONS.DB_LEARNING),
      client.bulk(Environment.TABLE_NAME_QUESTIONS, COMMONS.DB_QUESTIONS),
    ]);
    console.log(new Date().toUTCString());
  });

  afterEach(async () => {
    console.log(new Date().toUTCString());

    await Promise.all([
      client.truncateAll(Environment.TABLE_NAME_GROUPS),
      client.truncateAll(Environment.TABLE_NAME_LEARNING),
      client.truncateAll(Environment.TABLE_NAME_CURRICULUMS),
      client.truncateAll(Environment.TABLE_NAME_WEEKLY_ABILITY),
      client.truncateAll(Environment.TABLE_NAME_QUESTIONS),
    ]);

    console.log(new Date().toUTCString());
  });

  // // カリキュラム一覧
  // app.get('/v1/curriculums', express.json(), (req, res) => entry(req, res, CurriculumList));
  // // カリキュラム削除
  // app.delete('/v1/curriculums/:curriculumId', express.json(), (req, res) => entry(req, res, CurriculumRemove));
  // // カリキュラムの問題集一覧
  // app.get('/v1/curriculums/:curriculumId/questions', express.json(), (req, res) => entry(req, res, CurriculumQuestions));
  // // カリキュラム並べ順更新
  // app.put('/v1/curriculums/:curriculumId/order', express.json(), (req, res) => entry(req, res, CurriculumOrder));

  test('List01:保護者', async () => {
    api.get.mockImplementationOnce(() => Promise.resolve({ status: 200, data: COMMONS.USER_GUARDIAN }));

    const apiPath = '/v1/curriculums';

    const res = await request(server).get(apiPath).set('authorization', HEADER_USER);

    // status code
    expect(res.statusCode).toBe(200);

    console.log(res.body);
  });
});
