import server from '@src/app';
import request from 'supertest';

import { Environment } from '@consts';
import * as COMMONS from '@test/datas/commons';
import * as OVERALL from '@test/datas/reports/curriculumOverall';
import { APIs } from 'typings';
import { DynamoDBClient } from '@test/Commons';

jest.setTimeout(10000);

const client = DynamoDBClient;

describe('CurriculumOverall', () => {
  beforeAll(async () => {
    await Promise.all([
      client.bulk(Environment.TABLE_NAME_CURRICULUMS, COMMONS.DB_CURRICULUMS),
      client.bulk(Environment.TABLE_NAME_QUESTIONS, COMMONS.DB_QUESTIONS),
      client.bulk(Environment.TABLE_NAME_LEARNING, COMMONS.DB_LEARNING),
      client.bulk(Environment.TABLE_NAME_GROUPS, COMMONS.DB_GROUPS),
    ]);
  });

  afterAll(async () => {
    await Promise.all([
      client.truncateAll(Environment.TABLE_NAME_CURRICULUMS),
      client.truncateAll(Environment.TABLE_NAME_QUESTIONS),
      client.truncateAll(Environment.TABLE_NAME_LEARNING),
      client.truncateAll(Environment.TABLE_NAME_GROUPS),
    ]);
  });

  test('CurriculumOverall001: カリキュラム指定', async () => {
    const apiPath = '/v1/reports/overall/curriculums';
    const curriculums = ['f55JhAg711uNpW8DFT54fh'];

    const res = await request(server)
      .post(apiPath)
      .send({
        curriculums: curriculums,
      } as APIs.CurriculumOverallResquest);

    // status code
    expect(res.statusCode).toBe(200);

    expect(res.body).toEqual(OVERALL.CURRICULUM_OVERALL001_EXPECTS);
  });
});
