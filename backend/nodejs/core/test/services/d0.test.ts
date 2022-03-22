import { Groups, WordIgnore } from '@queries';
import { DBHelper } from '@utils';
import server from '@src/server';
import request from 'supertest';
import * as D0 from '../datas/d0';
import { HEADER_AUTH } from '@test/Commons';
import { DynamodbHelper } from '@alphax/dynamodb';
import { Environment } from '@consts';
import { Tables } from 'typings';

const client = new DynamodbHelper({ options: { endpoint: process.env.AWS_ENDPOINT } });

jest.setTimeout(10000);

describe('d0', () => {
  afterEach(async () => {
    await client.truncateAll(Environment.TABLE_NAME_WORD_IGNORE);
    await client.truncateAll(Environment.TABLE_NAME_WORDS);
    await client.truncateAll(Environment.TABLE_NAME_WORD_MASTER);
    await client.truncateAll(Environment.TABLE_NAME_TRACES);
    await client.truncateAll(Environment.TABLE_NAME_GROUPS);
  });

  test.skip('D003:単語無視機能', async () => {
    await client.bulk(Environment.TABLE_NAME_GROUPS, D0.D003DB_GROUP);
    await client.bulk(Environment.TABLE_NAME_WORDS, D0.D003DB_WORDS);

    const apiPath = '/v1/user/wordignore';
    const res = await request(server).post(apiPath).set('authorization', HEADER_AUTH).send(D0.D003Req01);
    const userId = '84d95083-9ee8-4187-b6e7-8123558ef2c1';

    // status code
    expect(res.statusCode).toBe(200);

    const ignore = await DBHelper().get(
      WordIgnore.get({
        id: userId,
        word: D0.D003Req01.word,
      })
    );
    const words = await DBHelper().scan({ TableName: Environment.TABLE_NAME_WORDS });
    const groups = await DBHelper().get<Tables.TGroups>(Groups.get({ id: 'G001', userId: userId }));

    expect(ignore?.Item).toEqual(D0.D003Expect01);
    expect(words.Items).toEqual(D0.D003Expect02);
    expect(groups?.Item?.count).toBe(0);
  });

  test.skip('D004:今日のテスト', async () => {
    await client.bulk(Environment.TABLE_NAME_GROUPS, D0.D004DB_GROUP);
    await client.bulk(Environment.TABLE_NAME_WORDS, D0.D004DB_WORDS);
    await client.bulk(Environment.TABLE_NAME_WORD_MASTER, D0.D004DB_WORD_MASTER);

    const apiPath = '/v1/today/test';
    const res = await request(server).get(apiPath).set('authorization', HEADER_AUTH);
    const userId = '84d95083-9ee8-4187-b6e7-8123558ef2c1';

    console.log(res.body);
    console.log(res.statusCode);
  });
});
