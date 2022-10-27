import server from '@src/app';
import request from 'supertest';
import * as COMMONS from '../../datas/commons';
import * as REPORTS from '../../datas/reports/groupStatus';

import { HEADER_GUARDIAN, HEADER_USER } from '@test/Commons';
import { DynamodbHelper } from '@alphax/dynamodb';
import { Environment } from '@consts';
import { APIs } from '../../../../typings';

jest.setTimeout(10000);

const client = new DynamodbHelper({ options: { endpoint: process.env['AWS_ENDPOINT_DYNAMODB'] } });

describe('Curriculums', () => {
  beforeAll(async () => {
    await Promise.all([
      client.bulk(Environment.TABLE_NAME_GROUPS, COMMONS.DB_GROUPS),
      client.bulk(Environment.TABLE_NAME_LEARNING, COMMONS.DB_LEARNING),
    ]);
  });

  afterAll(async () => {
    await Promise.all([
      client.truncateAll(Environment.TABLE_NAME_GROUPS),
      client.truncateAll(Environment.TABLE_NAME_LEARNING),
    ]);
  });

  test('CurriculumStatus001: 学習進捗取得', async () => {
    const curriculumId = 'f55JhAg711uNpW8DFT54fh';
    const apiPath = `/v1/reports/curriculums/${curriculumId}`;

    const res = await request(server).get(apiPath).set('username', HEADER_GUARDIAN);

    // status code
    expect(res.statusCode).toBe(200);

    expect(res.body).toMatchObject(REPORTS.GROUPSTATUS001_EXPECTS);
  });

  test('GroupStatus002: グループ存在しない', async () => {
    const groupId = 'DUMMY';
    const apiPath = `/v1/reports/status/groups/${groupId}`;

    const res = await request(server)
      .post(apiPath)
      .set('username', HEADER_USER)
      .send({
        userId: 'DUMMY',
      } as APIs.CurriculumStatusRequest);

    // status code
    expect(res.statusCode).toBe(400);
    expect(res.text).toEqual('Group informations not found.');
  });

  test('GroupStatus003: パラメータ不足(UID)', async () => {
    const groupId = 'DUMMY';
    const apiPath = `/v1/reports/status/groups/${groupId}`;

    const res = await request(server).post(apiPath).set('username', HEADER_USER);

    // status code
    expect(res.statusCode).toBe(400);
    expect(res.text).toEqual('User id required.');
  });
});
