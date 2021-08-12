import { WordMaster } from '@queries';
import { DBHelper } from '@utils';
import server from '@src/server';
import request from 'supertest';
import * as E0 from '../datas/e0';
import { HEADER_AUTH } from '@test/Commons';
import { DynamodbHelper } from '@alphax/dynamodb';

const client = new DynamodbHelper({ options: { endpoint: process.env.AWS_ENDPOINT } });
const TABLE_NAME_GROUPS = process.env.TABLE_NAME_GROUPS as string;

describe('e0', () => {
  afterEach(async () => {
    await client.truncateAll(TABLE_NAME_GROUPS);
  });

  test('E001:単語詳細情報取得', async () => {
    const apiPath = '/words/AAA';
    const res = await request(server).get(apiPath).set('authorization', HEADER_AUTH);

    // status code
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(E0.E001Res01);
  });

  test('E002:単語詳細情報更新', async () => {
    const apiPath = '/words/AAA';
    const res = await request(server).put(apiPath).set('authorization', HEADER_AUTH).send(E0.E002Req01);

    // status code
    expect(res.statusCode).toBe(200);
    const value = DBHelper().get(WordMaster.get('AAA'));

    console.log(value);
  });
});
