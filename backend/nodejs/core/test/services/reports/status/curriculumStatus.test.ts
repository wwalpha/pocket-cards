import server from '@src/app';
import request from 'supertest';
import { DynamodbHelper } from '@alphax/dynamodb';
import { Environment } from '@consts';
import * as COMMONS from '@test/datas/commons';
import * as REPORTS from '@test/datas/reports/curriculumStatus';
import { APIs } from 'typings';

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
    const apiPath = '/v1/reports/status/curriculums';
    const startDate = '';
    const endDate = '';
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

  // test('CurriculumStatus002: カリキュラムが存在しない', async () => {
  //   const curriculumId = 'DUMMY';
  //   const apiPath = `/v1/reports/curriculums/${curriculumId}`;

  //   const res = await request(server).get(apiPath);

  //   // status code
  //   expect(res.statusCode).toBe(400);
  //   expect(res.text).toEqual('Curriculum was not found.');
  // });
});
