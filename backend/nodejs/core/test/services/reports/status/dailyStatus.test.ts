import server from '@src/app';
import request from 'supertest';
import * as COMMONS from '@test/datas/commons';
import * as REPORTS from '@test/datas/reports/dailystatus';
import { DynamodbHelper } from '@alphax/dynamodb';
import { Environment } from '@consts';
import { HEADER_USER } from '@test/Commons';
import { DateUtils } from '@utils';

jest.setTimeout(10000);

const client = new DynamodbHelper({ options: { endpoint: process.env['AWS_ENDPOINT_DYNAMODB'] } });

describe('Reports', () => {
  beforeAll(async () => {
    const item1 = COMMONS.DB_LEARNING.find((item) => item.qid === 'eyKBX66pJSpZ4H4nCGHNKq');
    const item2 = COMMONS.DB_LEARNING.find((item) => item.qid === 'iH5npmyKLnsmVFN7vK1tZL');

    if (item1 && item2) {
      item1.lastTime = DateUtils.getNow();
      item1.nextTime = DateUtils.getNow();
      item2.lastTime = DateUtils.getNow();
      item2.nextTime = DateUtils.getNextTime(1);
    }

    await Promise.all([client.bulk(Environment.TABLE_NAME_LEARNING, COMMONS.DB_LEARNING)]);
  });

  afterAll(async () => {
    await Promise.all([client.truncateAll(Environment.TABLE_NAME_LEARNING)]);
  });

  test('DailyStatus001: 復習状況一覧', async () => {
    const apiPath = `/v1/reports/status/daily`;
    const username = HEADER_USER;

    const res = await request(server).get(apiPath).set('username', username);

    // status code
    expect(res.statusCode).toBe(200);

    expect(res.body).toEqual(REPORTS.DAILYSTATUS_001_EXPECTS);
  });
});
