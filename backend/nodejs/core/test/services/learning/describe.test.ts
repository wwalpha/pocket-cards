import server from '@src/app';
import request from 'supertest';
import * as COMMONS from '../../datas/commons';
import { DynamoDBClient, HEADER_GUARDIAN, HEADER_USER } from '@test/Commons';

import { Environment } from '@consts';
import { LearningService } from '@services';

const client = DynamoDBClient;

jest.setTimeout(10000);

describe('Learning', () => {
  beforeAll(async () => {
    await Promise.all([client.bulk(Environment.TABLE_NAME_LEARNING, COMMONS.DB_LEARNING)]);
  });

  afterAll(async () => {
    await Promise.all([client.truncateAll(Environment.TABLE_NAME_LEARNING)]);
  });

  test('Describe001: 学習状況参照', async () => {
    const qid = 'xtk4W9TSsxSMmTifVxeFLA';
    const uid = HEADER_USER;
    const apiPath = `/v1/study/learning/${qid}?uid=${uid}`;

    const res = await request(server).get(apiPath).set('guardian', HEADER_GUARDIAN);

    // status code
    expect(res.statusCode).toBe(200);

    const after = await LearningService.describe(qid, uid);

    expect(after).not.toBeUndefined();

    expect(res.body).toEqual(after);
  });

  test('Describe002: パラメータ不足:ユーザID', async () => {
    const qid = 'xtk4W9TSsxSMmTifVxeFLA';
    const apiPath = `/v1/study/learning/${qid}`;

    const res = await request(server).get(apiPath).set('guardian', HEADER_GUARDIAN);

    // status code
    expect(res.statusCode).toBe(400);
    expect(res.text).toEqual('Required parameters were not found.');
  });

  test('Describe003: 問題IDが存在しない', async () => {
    const qid = 'DUMMY';
    const uid = HEADER_USER;
    const apiPath = `/v1/study/learning/${qid}?uid=${uid}`;

    const res = await request(server).get(apiPath).set('guardian', HEADER_GUARDIAN);

    // status code
    expect(res.statusCode).toBe(400);
    expect(res.text).toEqual('Learning information not found.');
  });
});
