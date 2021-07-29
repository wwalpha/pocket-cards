import { Groups, Histories, Words } from '@queries';
import { Commons, DateUtils, DBHelper } from '@utils';
import server from '@src/app';
import request from 'supertest';
import * as C0 from '../datas/c0';
import { APIs } from 'typings';
import { HEADER_AUTH } from '@test/Commons';
import { DynamodbHelper } from '@alphax/dynamodb';
import { TABLE_NAME_HISTORIES } from '@src/consts/Environment';

const client = new DynamodbHelper({ options: { endpoint: process.env.AWS_ENDPOINT } });
const TABLE_NAME_WORDS = process.env.TABLE_NAME_WORDS as string;
const TABLE_NAME_WORD_MASTER = process.env.TABLE_NAME_WORD_MASTER as string;

describe('c0', () => {
  afterEach(async () => {
    await client.truncateAll(TABLE_NAME_WORDS);
    await client.truncateAll(TABLE_NAME_WORD_MASTER);
    await client.truncateAll(TABLE_NAME_HISTORIES);
  });

  test.skip('c001', async () => {
    const res = await request(server).post('/groups/group001/words').set('authorization', HEADER_AUTH).send(C0.C001Req);

    // status code
    expect(res.statusCode).toBe(200);

    console.log(res.body);
    // const { groupId } = res.body as APIs.B001Response;
    // const userId = Commons.getUserInfo(HEADER_AUTH);
    // const result = await DBHelper().get(Groups.get({ id: groupId, userId: userId }));

    // expect(result?.Item).toMatchObject(B0.B001Res);
  });

  test.skip('c001', async () => {
    const res = await request(server).post('/groups/group001/words').set('authorization', HEADER_AUTH).send(C0.C002Req);

    // status code
    expect(res.statusCode).toBe(200);

    console.log(res.body);
    // const { groupId } = res.body as APIs.B001Response;
    // const userId = Commons.getUserInfo(HEADER_AUTH);
    // const result = await DBHelper().get(Groups.get({ id: groupId, userId: userId }));

    // expect(result?.Item).toMatchObject(B0.B001Res);
  });

  test('C002_1', async () => {
    await client.bulk(TABLE_NAME_WORDS, C0.C002DB01);

    const res = await request(server).get('/groups/C002/words').set('authorization', HEADER_AUTH);

    // status code
    expect(res.statusCode).toBe(200);
    // found 2 records
    expect(res.body).toEqual(C0.C002Res01);
  });

  test('C002:02', async () => {
    const res = await request(server).get('/groups/C003/words').set('authorization', HEADER_AUTH);

    // status code
    expect(res.statusCode).toBe(200);
    // found 2 records
    expect(res.body).toEqual(C0.C002Res02);
  });

  test('C003', async () => {
    await client.bulk(TABLE_NAME_WORDS, C0.C003DB01);

    const res = await request(server).get('/groups/C003/words/C003-1').set('authorization', HEADER_AUTH).expect(200);

    // response
    expect(res.body).toEqual(C0.C003Res01);
  });

  test('C004:001:Study success', async () => {
    await client.bulk(TABLE_NAME_WORDS, C0.C004DB01);

    await request(server)
      .put('/groups/C004/words/WORD-4')
      .set('authorization', HEADER_AUTH)
      .send(C0.C004Req01)
      .expect(200);

    const wordItem = (await client.get(Words.get({ id: 'WORD-4', groupId: 'C004' })))?.Item;
    const historyItem = await (await client.scan({ TableName: TABLE_NAME_HISTORIES })).Items[0];

    const expectWord = C0.C004Res01_Word;
    // @ts-ignore
    expectWord.lastTime = DateUtils.getNow();
    // @ts-ignore
    expectWord.nextTime = DateUtils.getNextTime(2);

    // found 2 records
    expect(wordItem).toEqual(expectWord);
    expect(historyItem).toMatchObject(C0.C004Res01_History);
  });

  test('C004:002:Study failed', async () => {
    await client.bulk(TABLE_NAME_WORDS, C0.C004DB02);

    await request(server)
      .put('/groups/C004/words/WORD-4')
      .set('authorization', HEADER_AUTH)
      .send(C0.C004Req02)
      .expect(200);

    const wordItem = (await client.get(Words.get({ id: 'WORD-4', groupId: 'C004' })))?.Item;
    const historyItem = (await client.scan({ TableName: TABLE_NAME_HISTORIES })).Items[0];

    const expectWord = C0.C004Res02_Word;
    // @ts-ignore
    expectWord.lastTime = DateUtils.getNow();
    // @ts-ignore
    expectWord.nextTime = DateUtils.getNow();

    expect(wordItem).toEqual(expectWord);
    expect(historyItem).toMatchObject(C0.C004Res02_History);
  });

  test.only('C004:003:New word', async () => {
    await client.bulk(TABLE_NAME_WORDS, C0.C004DB02);

    const res = await request(server)
      .put('/groups/C004/words/WORD4')
      .set('authorization', HEADER_AUTH)
      .send(C0.C004Req03);

    // status code
    expect(res.statusCode).toBe(200);
    // found 2 records
    expect(res.body).toEqual(C0.C003Res01);
  });

  test('c004:04', async () => {
    const res = await request(server)
      .put('/groups/C004/words/WORD4')
      .set('authorization', HEADER_AUTH)
      .send(C0.C004Req04);

    // status code
    expect(res.statusCode).toBe(200);
    // found 2 records
    expect(res.body).toEqual(C0.C003Res01);
  });

  // test('b002: empty list', async () => {
  //   const res = await request(server).get('/groups').set('authorization', HEADER_AUTH);

  //   // status code
  //   expect(res.statusCode).toBe(200);
  //   // found 2 records
  //   expect(res.body).toEqual(B0.B002Res02);
  // });

  // test('b003', async () => {
  //   // initialize table
  //   await client.bulk(TABLE_NAME_GROUPS, B0.B003DB);

  //   const res = await request(server).get('/groups/B003').set('authorization', HEADER_AUTH);

  //   // status code
  //   expect(res.statusCode).toBe(200);
  //   // found 2 records
  //   expect(res.body).toEqual(B0.B003Res01);
  // });

  // test('b004', async () => {
  //   // initialize table
  //   await client.bulk(TABLE_NAME_GROUPS, B0.B004DB01);

  //   // api call
  //   const res = await request(server).put('/groups/B004').set('authorization', HEADER_AUTH).send(B0.B004Req01);

  //   // database
  //   const result = await DBHelper().get(Groups.get({ id: 'B004', userId: 'B004' }));
  //   // status code
  //   expect(res.statusCode).toBe(200);
  //   // found 2 records
  //   expect(result?.Item).toEqual(B0.B004Res01);
  // });

  // test('b005', async () => {
  //   // initialize table
  //   await client.bulk(TABLE_NAME_GROUPS, B0.B005DB01);

  //   // api call
  //   const res = await request(server).delete('/groups/B005').set('authorization', HEADER_AUTH).send(B0.B004Req01);

  //   // database
  //   const userId = Commons.getUserInfo(HEADER_AUTH);
  //   const result = await DBHelper().get(Groups.get({ id: 'B005', userId: userId }));
  //   // status code
  //   expect(res.statusCode).toBe(200);
  //   // database
  //   expect(result?.Item).toBeUndefined();
  // });
});
