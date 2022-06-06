import axios, { AxiosStatic } from 'axios';
import request from 'supertest';
import { DynamodbHelper } from '@alphax/dynamodb';
import server from '@src/app';
import { HEADER_AUTH } from '@test/Commons';
import * as E0 from '../../datas/e0';
import { Environment } from '@consts';

jest.mock('axios');

const api = axios as jest.Mocked<AxiosStatic>;
const client = new DynamodbHelper({ options: { endpoint: process.env['AWS_ENDPOINT_DYNAMODB'] } });

describe.skip('e0', () => {
  afterEach(async () => {
    await client.truncateAll(Environment.TABLE_NAME_WORD_MASTER);
  });

  test('E001:単語詳細情報取得', async () => {
    await client.bulk(Environment.TABLE_NAME_WORD_MASTER, E0.E001_01_DB);

    const apiPath = '/v1/words/AAA';
    const res = await request(server).get(apiPath).set('username', HEADER_AUTH);

    // status code
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(E0.E001_01_Res);
  });

  test('E002:単語詳細情報更新', async () => {
    await client.bulk(Environment.TABLE_NAME_WORD_MASTER, E0.E002_02_DB);

    const apiPath = '/v1/words/AAA';
    const res = await request(server).put(apiPath).set('username', HEADER_AUTH).send(E0.E002_01_Req);

    // status code
    expect(res.statusCode).toBe(200);
  });

  test('E002:Original不一致', async () => {
    await client.bulk(Environment.TABLE_NAME_WORD_MASTER, E0.E002_02_DB);

    api.get.mockImplementationOnce(() => Promise.resolve({ status: 200, data: E0.E002_02_IPA }));
    api.post.mockImplementationOnce(() => Promise.resolve({ status: 200, data: E0.E002_02_Translate }));
    api.post.mockImplementationOnce(() => Promise.resolve({ status: 200, data: E0.E002_02_Translate }));

    const apiPath = '/v1/words/AAA';
    const res = await request(server).put(apiPath).set('username', HEADER_AUTH).send(E0.E002_02_Req);

    // status code
    expect(res.statusCode).toBe(200);
  });

  test('E002:ID不一致', async () => {
    await client.bulk(Environment.TABLE_NAME_WORD_MASTER, E0.E002_03_DB);

    api.get.mockImplementationOnce(() => Promise.resolve({ status: 200, data: E0.E002_03_IPA }));
    api.post.mockImplementationOnce(() => Promise.resolve({ status: 200, data: E0.E002_03_Translate }));
    api.post.mockImplementationOnce(() => Promise.resolve({ status: 200, data: E0.E002_03_Translate }));

    const apiPath = '/v1/words/BBB';
    const res = await request(server).put(apiPath).set('username', HEADER_AUTH).send(E0.E002_03_Req);

    // status code
    expect(res.statusCode).toBe(200);
  });

  test('E002:Validation', async () => {
    const apiPath = '/v1/words/AAA';
    const res = await request(server).put(apiPath).set('username', HEADER_AUTH).send(E0.E002_04_Req);

    // status code
    expect(res.statusCode).toBe(500);
    expect(res.text).toEqual('Original not found');
  });
});
