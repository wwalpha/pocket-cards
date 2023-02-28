import server from '@src/app';
import request from 'supertest';

import { Environment } from '@consts';
import * as COMMONS from '@test/datas/commons';
import * as REPORTS from '@test/datas/reports/curriculumStatus';
import { APIs } from 'typings';
import { DynamoDBClient } from '@test/Commons';

jest.setTimeout(10000);

const client = DynamoDBClient;

describe('Curriculums', () => {
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

  test('CurriculumStatus001: 学習進捗取得_期間あり', async () => {
    const apiPath = '/v1/reports/status/curriculums';
    const startDate = '20200101';
    const endDate = '20211231';
    const curriculums = ['vB6cUPdMB8TJFSrypGwoML', 'aaYHb4GyjxfYWYAaKMyG53'];

    const res = await request(server)
      .post(apiPath)
      .send({
        curriculums: curriculums,
        startDate: startDate,
        endDate: endDate,
      } as APIs.CurriculumStatusRequest);

    // status code
    expect(res.statusCode).toBe(200);

    expect(res.body).toEqual(REPORTS.CURRICULUM_STATUS001_EXPECTS);
  });

  test('CurriculumStatus002: 学習進捗取得_期間なし', async () => {
    const apiPath = '/v1/reports/status/curriculums';
    const curriculums = ['vB6cUPdMB8TJFSrypGwoML'];

    const res = await request(server)
      .post(apiPath)
      .send({
        curriculums: curriculums,
        unlearned: '1',
      } as APIs.CurriculumStatusRequest);

    // status code
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(REPORTS.CURRICULUM_STATUS002_EXPECTS);
  });

  test('CurriculumStatus003: カリキュラム未指定', async () => {
    const apiPath = '/v1/reports/status/curriculums';

    const res = await request(server).post(apiPath).send();

    // status code
    expect(res.statusCode).toBe(400);
  });
});
