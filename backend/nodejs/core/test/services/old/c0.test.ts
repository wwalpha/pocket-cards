import { DynamodbHelper } from '@alphax/dynamodb';
import request from 'supertest';
import { Words } from '@queries';
import { Environment } from '@consts';
import { DateUtils } from '@utils';
import server from '@src/app';
import * as C0 from '../../datas/c0';
import { HEADER_AUTH } from '@test/Commons';
import { GroupService } from '@services';

jest.mock('axios');

const client = new DynamodbHelper({ options: { endpoint: process.env['AWS_ENDPOINT_DYNAMODB'] } });

describe.skip('C0', () => {
  afterEach(async () => {
    await client.truncateAll(Environment.TABLE_NAME_WORDS);
    await client.truncateAll(Environment.TABLE_NAME_WORD_MASTER);
    await client.truncateAll(Environment.TABLE_NAME_TRACES);
    await client.truncateAll(Environment.TABLE_NAME_GROUPS);
  });

  test.skip('C001:単語新規追加(複数)', async () => {
    // const user: User.GetUserResponse = require('./expect/Decode.json');
    // api.get.mockResolvedValueOnce({ status: 200, data: user });

    const res = await request(server)
      .post('/v1/groups/group001/words')
      .set('authorization', HEADER_AUTH)
      .send(C0.C001Req01);

    // status code
    expect(res.statusCode).toBe(200);

    console.log(res.body);
  });

  test.skip('C001:単語新規追加(1つ)', async () => {
    const res = await request(server)
      .post('/v1/groups/group001/words')
      .set('authorization', HEADER_AUTH)
      .send(C0.C001Req02);

    // status code
    expect(res.statusCode).toBe(200);

    console.log(res.body);
  });

  test('C002:グループ単語一覧_データあり', async () => {
    await client.bulk(Environment.TABLE_NAME_WORDS, C0.C002DB01);

    const apiPath = '/v1/groups/C002/words';
    const res = await request(server).get(apiPath).set('authorization', HEADER_AUTH);

    // status code
    expect(res.statusCode).toBe(200);
    // found 2 records
    expect(res.body).toEqual(C0.C002Res01);
  });

  test('C002:グループ単語一覧_データなし', async () => {
    const apiPath = '/v1/groups/C003/words';
    const res = await request(server).get(apiPath).set('authorization', HEADER_AUTH);

    // status code
    expect(res.statusCode).toBe(200);
    // found 2 records
    expect(res.body).toEqual(C0.C002Res02);
  });

  test('C003:単語詳細取得', async () => {
    await client.bulk(Environment.TABLE_NAME_WORDS, C0.C003DB01);

    const apiPath = '/v1/groups/C003/words/C003-1';
    const res = await request(server).get(apiPath).set('authorization', HEADER_AUTH).expect(200);

    // response
    expect(res.body).toEqual(C0.C003Res01);
  });

  test('C004_001:学習成功', async () => {
    await client.bulk(Environment.TABLE_NAME_WORDS, C0.C004DB01);

    await request(server)
      .put('/v1/groups/C004/words/WORD-4')
      .set('authorization', HEADER_AUTH)
      .send(C0.C004Req01)
      .expect(200);

    const wordItem = (await client.get(Words.get({ id: 'WORD-4', groupId: 'C004' })))?.Item;

    const expectWord = C0.C004Res01_Word;
    // @ts-ignore
    expectWord.lastTime = DateUtils.getNow();
    // @ts-ignore
    expectWord.nextTime = DateUtils.getNextTime(2);

    // found 2 records
    expect(wordItem).toEqual(expectWord);
  });

  test('C004_002:学習失敗', async () => {
    await client.bulk(Environment.TABLE_NAME_WORDS, C0.C004DB02);

    await request(server)
      .put('/v1/groups/C004/words/WORD-4')
      .set('authorization', HEADER_AUTH)
      .send(C0.C004Req02)
      .expect(200);

    const wordItem = (await client.get(Words.get({ id: 'WORD-4', groupId: 'C004' })))?.Item;

    const expectWord = C0.C004Res02_Word;
    // @ts-ignore
    expectWord.lastTime = DateUtils.getNow();
    // @ts-ignore
    expectWord.nextTime = DateUtils.getNow();

    expect(wordItem).toEqual(expectWord);
  });

  test('C004_003:単語情報更新_既存単語あり', async () => {
    await client.bulk(Environment.TABLE_NAME_WORDS, C0.C004DB03);

    const res = await request(server)
      .put('/v1/groups/C004/words/WORD4')
      .set('authorization', HEADER_AUTH)
      .send(C0.C004Req03);

    // status code
    expect(res.statusCode).toBe(200);
  });

  test('C004_004:単語情報更新_単語更新', async () => {
    await client.bulk(Environment.TABLE_NAME_WORDS, C0.C004DB04);

    const res = await request(server)
      .put('/v1/groups/C004/words/WORD4')
      .set('authorization', HEADER_AUTH)
      .send(C0.C004Req04);

    // status code
    expect(res.statusCode).toBe(200);
  });

  test('C005:グループ単語削除', async () => {
    await client.bulk(Environment.TABLE_NAME_GROUPS, C0.C005DB01_Group);
    await client.bulk(Environment.TABLE_NAME_WORDS, C0.C005DB01_Word);

    const apiPath = '/v1/groups/C005/words/C005-1';
    const res = await request(server).delete(apiPath).set('authorization', HEADER_AUTH);

    // status code
    expect(res.statusCode).toBe(200);
    // found 2 records
    const group = await GroupService.describe('C005');
    const word = await client.get(Words.get({ id: 'C005-1', groupId: 'C005' }));

    expect(group).toEqual(C0.C005Except);
    expect(word).toBeUndefined;
  });

  test('C006:新規学習あり', async () => {
    await client.bulk(Environment.TABLE_NAME_WORDS, C0.C006DB01_WORD);
    await client.bulk(Environment.TABLE_NAME_WORD_MASTER, C0.C006DB01_WORD_MASTER);

    const apiPath = '/v1/groups/C006/new';
    const res = await request(server).get(apiPath).set('authorization', HEADER_AUTH);

    // status code
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(C0.C006Res01);
  });

  test('C006:新規学習なし', async () => {
    const apiPath = '/v1/groups/C006/new';
    const res = await request(server).get(apiPath).set('authorization', HEADER_AUTH);

    // status code
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(C0.C006Res02);
  });

  test('C007:テストあり', async () => {
    await client.bulk(Environment.TABLE_NAME_WORDS, C0.C007DB01_WORD);
    await client.bulk(Environment.TABLE_NAME_WORD_MASTER, C0.C007DB01_WORD_MASTER);

    const apiPath = '/v1/groups/C007/test';
    const res = await request(server).get(apiPath).set('authorization', HEADER_AUTH);

    // status code
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(C0.C007Res01);
  });

  test('C007:テストなし', async () => {
    const apiPath = '/v1/groups/C007/test';
    const res = await request(server).get(apiPath).set('authorization', HEADER_AUTH);

    // status code
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(C0.C007Res02);
  });

  test('C008:レビューあり', async () => {
    const dataRows = C0.C008DB01_WORD.map((item) => {
      item.nextTime = DateUtils.getNow();
      return item;
    });

    await client.bulk(Environment.TABLE_NAME_WORDS, dataRows);
    await client.bulk(Environment.TABLE_NAME_WORD_MASTER, C0.C008DB01_WORD_MASTER);

    const apiPath = '/v1/groups/C008/review';
    const res = await request(server).get(apiPath).set('authorization', HEADER_AUTH);

    // status code
    expect(res.statusCode).toBe(200);
    expect(res.body.count).toEqual(C0.C008Res01.count);
    // expect(res.body.words).toIncludeSameMembers(C0.C008Res01.words);
  });

  test('C008:レビューなし', async () => {
    const apiPath = '/v1/groups/C008/review';
    const res = await request(server).get(apiPath).set('authorization', HEADER_AUTH);

    // status code
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(C0.C008Res02);
  });
});
