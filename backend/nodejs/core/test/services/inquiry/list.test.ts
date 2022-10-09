import server from '@src/app';
import request from 'supertest';
import * as COMMONS from '../../datas/commons';
import * as INQUIRES from '../../datas/inquires/list';
import { HEADER_AUTH } from '@test/Commons';
import { DynamodbHelper } from '@alphax/dynamodb';
import { Environment } from '@consts';

const client = new DynamodbHelper({ options: { endpoint: process.env['AWS_ENDPOINT_DYNAMODB'] } });

jest.setTimeout(10000);

describe('Inquiry', () => {
  beforeEach(async () => {
    await Promise.all([client.bulk(Environment.TABLE_NAME_INQUIRY, COMMONS.DB_INQUIRY)]);
    await Promise.all([client.bulk(Environment.TABLE_NAME_QUESTIONS, COMMONS.DB_QUESTIONS)]);
  });

  afterEach(async () => {
    await Promise.all([client.truncateAll(Environment.TABLE_NAME_INQUIRY)]);
    await Promise.all([client.truncateAll(Environment.TABLE_NAME_QUESTIONS)]);
  });

  test('List01: 一覧', async () => {
    const api = `/v1/inquiries`;

    const res = await request(server).get(api).set('username', HEADER_AUTH);

    // status code
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(INQUIRES.LIST_001_EXPECT);
  });
});
