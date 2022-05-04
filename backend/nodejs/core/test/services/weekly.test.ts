import server from '@src/app';
import request from 'supertest';
import * as DATAS from '../datas/weekly';
import { HEADER_AUTH2 } from '@test/Commons';
import { DynamodbHelper } from '@alphax/dynamodb';
import { Environment } from '@consts';
import { DBHelper } from '@utils';

const client = new DynamodbHelper({ options: { endpoint: process.env['AWS_ENDPOINT'] } });

jest.setTimeout(10000);

describe('weekly', () => {
  afterEach(async () => {
    await client.truncateAll(Environment.TABLE_NAME_WEEKLY_ABILITY);
    await client.truncateAll(Environment.TABLE_NAME_QUESTIONS);
  });

  test('001_週テスト対策問題一括取得:データなし、resetなし', async () => {
    await client.bulk(Environment.TABLE_NAME_WEEKLY_ABILITY, DATAS.WEEKLY01_DB_WEEKLY_ABILITY);

    const apiPath = '/v1/groups/G001/weekly';
    const res = await request(server).get(apiPath).set('authorization', HEADER_AUTH2);

    // status code
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(DATAS.WEEKLY01_RESPONSE);
  });

  test('002_週テスト対策問題一括取得:データあり、resetなし、times = -1', async () => {
    await client.bulk(Environment.TABLE_NAME_WEEKLY_ABILITY, DATAS.WEEKLY02_DB_WEEKLY_ABILITY);
    await client.bulk(Environment.TABLE_NAME_QUESTIONS, DATAS.WEEKLY02_DB_QUESTIONS);

    const apiPath = '/v1/groups/G001/weekly';
    const res = await request(server).get(apiPath).set('authorization', HEADER_AUTH2);

    // status code
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(DATAS.WEEKLY02_RESPONSE);
  });

  test('003_週テスト対策問題一括取得:データあり、resetあり、times = -1', async () => {
    await client.bulk(Environment.TABLE_NAME_WEEKLY_ABILITY, DATAS.WEEKLY03_DB_WEEKLY_ABILITY);
    await client.bulk(Environment.TABLE_NAME_QUESTIONS, DATAS.WEEKLY03_DB_QUESTIONS);

    const apiPath = '/v1/groups/G001/weekly?reset=1';
    const res = await request(server).get(apiPath).set('authorization', HEADER_AUTH2);

    const ability = await DBHelper().scan({ TableName: Environment.TABLE_NAME_WEEKLY_ABILITY });

    // console.log(JSON.stringify(res.body));

    // status code
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(DATAS.WEEKLY03_RESPONSE);
    expect(ability.Items).toEqual(DATAS.WEEKLY03_EXPECT_WEEKLY_ABILITY);
  });

  test('004_週テスト対策問題一括取得:データあり、resetなし、times = 0', async () => {
    await client.bulk(Environment.TABLE_NAME_WEEKLY_ABILITY, DATAS.WEEKLY04_DB_WEEKLY_ABILITY);
    await client.bulk(Environment.TABLE_NAME_QUESTIONS, DATAS.WEEKLY04_DB_QUESTIONS);

    const apiPath = '/v1/groups/G001/weekly';
    const res = await request(server).get(apiPath).set('authorization', HEADER_AUTH2);

    // status code
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(DATAS.WEEKLY04_RESPONSE);
  });

  // test.skip('Question02:学習問題一覧', async () => {
  //   await client.bulk(Environment.TABLE_NAME_DATAS, DATAS.STUDY002_DB_DATAS);
  //   await client.bulk(Environment.TABLE_NAME_LEARNING, DATAS.STUDY002_DB_LEARNING);

  //   const apiPath = '/v1/DATAS/study';

  //   const res = await request(server)
  //     .get(apiPath)
  //     .query({
  //       subject: '2',
  //     })
  //     .set('authorization', HEADER_AUTH);

  //   // status code
  //   expect(res.statusCode).toBe(200);

  //   expect(res.body).toEqual(DATAS.STUDY002_EXPECT01);
  // });

  // test.skip('Question03:テスト問題一覧', async () => {
  //   await client.bulk(Environment.TABLE_NAME_DATAS, DATAS.TEST003_DB_DATAS);
  //   await client.bulk(Environment.TABLE_NAME_LEARNING, DATAS.TEST003_DB_LEARNING);

  //   const apiPath = '/v1/DATAS/test';

  //   const res = await request(server)
  //     .get(apiPath)
  //     .query({
  //       subject: '2',
  //     })
  //     .set('authorization', HEADER_AUTH);

  //   // status code
  //   expect(res.statusCode).toBe(200);

  //   expect(res.body).toEqual(DATAS.TEST003_EXPECT01);
  // });

  // test.skip('Question04:問題回答_正解', async () => {
  //   await client.bulk(Environment.TABLE_NAME_LEARNING, DATAS.ANSWER04_DB_LEARNING);

  //   const apiPath = '/v1/DATAS/Q001/answer';

  //   const res = await request(server)
  //     .post(apiPath)
  //     .set('authorization', HEADER_AUTH)
  //     .send({
  //       correct: '1',
  //     } as APIs.QuestionAnswerRequest);

  //   // status code
  //   expect(res.statusCode).toBe(200);

  //   const result = await DBHelper().get(Learning.get({ qid: 'Q001', userId: '84d95083-9ee8-4187-b6e7-8123558ef2c1' }));

  //   expect(result?.Item).toMatchObject(DATAS.ANSWER04_EXPECT01);
  // });

  // test.skip('Question05:問題回答_不正解', async () => {
  //   await client.bulk(Environment.TABLE_NAME_LEARNING, DATAS.ANSWER05_DB_LEARNING);

  //   const apiPath = '/v1/DATAS/Q001/answer';

  //   const res = await request(server)
  //     .post(apiPath)
  //     .set('authorization', HEADER_AUTH)
  //     .send({
  //       correct: '0',
  //     } as APIs.QuestionAnswerRequest);

  //   // status code
  //   expect(res.statusCode).toBe(200);

  //   const result = await DBHelper().get(Learning.get({ qid: 'Q001', userId: '84d95083-9ee8-4187-b6e7-8123558ef2c1' }));

  //   expect(result?.Item).toMatchObject(DATAS.ANSWER05_EXPECT01);
  // });

  // test.skip('Question06:質問一覧', async () => {
  //   await client.bulk(Environment.TABLE_NAME_DATAS, DATAS.DETAILS05_DB_DATAS);

  //   const apiPath = '/v1/groups/G001/DATAS';

  //   const res = await request(server).get(apiPath).set('authorization', HEADER_AUTH);

  //   // status code
  //   expect(res.statusCode).toBe(200);

  //   expect(res.body).toEqual(DATAS.DETAILS05_EXPECT01);
  // });
});
