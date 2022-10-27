import server from '@src/app';
import request from 'supertest';
import * as COMMONS from '../../datas/commons';
import * as REPORTS from '../../datas/reports/curriculumStatus';
import { DynamodbHelper } from '@alphax/dynamodb';
import { Environment } from '@consts';

jest.setTimeout(10000);

const client = new DynamodbHelper({ options: { endpoint: process.env['AWS_ENDPOINT_DYNAMODB'] } });

describe('Curriculums', () => {
  beforeAll(async () => {
    await Promise.all([
      client.bulk(Environment.TABLE_NAME_CURRICULUMS, COMMONS.DB_CURRICULUMS),
      client.bulk(Environment.TABLE_NAME_QUESTIONS, COMMONS.DB_QUESTIONS),
      client.bulk(Environment.TABLE_NAME_LEARNING, COMMONS.DB_LEARNING),
    ]);
  });

  afterAll(async () => {
    await Promise.all([
      client.truncateAll(Environment.TABLE_NAME_CURRICULUMS),
      client.truncateAll(Environment.TABLE_NAME_QUESTIONS),
      client.truncateAll(Environment.TABLE_NAME_LEARNING),
    ]);
  });

  test('CurriculumStatus001: 学習進捗取得', async () => {
    const curriculumId = 'f55JhAg711uNpW8DFT54fh';
    const apiPath = `/v1/reports/curriculums/${curriculumId}`;

    const res = await request(server).get(apiPath);

    // status code
    expect(res.statusCode).toBe(200);

    expect(res.body).toMatchObject(REPORTS.CURRICULUM_STATUS001_EXPECTS);
  });

  test('CurriculumStatus002: カリキュラムが存在しない', async () => {
    const curriculumId = 'DUMMY';
    const apiPath = `/v1/reports/curriculums/${curriculumId}`;

    const res = await request(server).get(apiPath);

    // status code
    expect(res.statusCode).toBe(400);
    expect(res.text).toEqual('Curriculum was not found.');
  });
});
