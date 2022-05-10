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

    const apiPath = '/v1/study/weekly/G001/questions';
    const res = await request(server).get(apiPath).set('authorization', HEADER_AUTH2);

    // status code
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(DATAS.WEEKLY01_RESPONSE);
  });

  test('002_週テスト対策問題一括取得:データあり、resetなし、times = -1', async () => {
    await client.bulk(Environment.TABLE_NAME_WEEKLY_ABILITY, DATAS.WEEKLY02_DB_WEEKLY_ABILITY);
    await client.bulk(Environment.TABLE_NAME_QUESTIONS, DATAS.WEEKLY02_DB_QUESTIONS);

    const apiPath = '/v1/study/weekly/G001/questions';
    const res = await request(server).get(apiPath).set('authorization', HEADER_AUTH2);

    // status code
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(DATAS.WEEKLY02_RESPONSE);
  });

  test('003_週テスト対策問題一括取得:データあり、resetあり、times = -1', async () => {
    await client.bulk(Environment.TABLE_NAME_WEEKLY_ABILITY, DATAS.WEEKLY03_DB_WEEKLY_ABILITY);
    await client.bulk(Environment.TABLE_NAME_QUESTIONS, DATAS.WEEKLY03_DB_QUESTIONS);

    const apiPath = '/v1/study/weekly/G001/questions?reset=1';
    const res = await request(server).get(apiPath).set('authorization', HEADER_AUTH2);

    const ability = await DBHelper().scan({ TableName: Environment.TABLE_NAME_WEEKLY_ABILITY });

    // status code
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(DATAS.WEEKLY03_RESPONSE);
    expect(ability.Items).toEqual(DATAS.WEEKLY03_EXPECT_WEEKLY_ABILITY);
  });

  test('004_週テスト対策問題一括取得:データあり、resetなし、times = 0', async () => {
    await client.bulk(Environment.TABLE_NAME_WEEKLY_ABILITY, DATAS.WEEKLY04_DB_WEEKLY_ABILITY);
    await client.bulk(Environment.TABLE_NAME_QUESTIONS, DATAS.WEEKLY04_DB_QUESTIONS);

    const apiPath = '/v1/study/weekly/G001/questions';
    const res = await request(server).get(apiPath).set('authorization', HEADER_AUTH2);

    // status code
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(DATAS.WEEKLY04_RESPONSE);
  });

  test('005_週テスト対策の実力テストの回答:Yes', async () => {
    await client.bulk(Environment.TABLE_NAME_WEEKLY_ABILITY, DATAS.WEEKLY05_DB_WEEKLY_ABILITY);
    await client.bulk(Environment.TABLE_NAME_GROUPS, DATAS.WEEKLY05_DB_GROUP);

    const apiPath = '/v1/study/weekly/G001/questions/gr4RJGXne2p68Q6oyYcwoN';
    const res = await request(server).post(apiPath).set('authorization', HEADER_AUTH2).send({
      correct: '1',
      mode: 'test',
    });

    const ability = await DBHelper().scan({ TableName: Environment.TABLE_NAME_WEEKLY_ABILITY });
    const groups = await DBHelper().scan({ TableName: Environment.TABLE_NAME_GROUPS });

    // status code
    expect(res.statusCode).toBe(200);
    expect(ability.Items).toEqual(DATAS.WEEKLY05_EXPECT_WEEKLY_ABILITY);
    expect(groups.Items).toEqual(DATAS.WEEKLY05_EXPECT_GROUPS);
  });

  test('006_週テスト対策の実力テストの回答:No', async () => {
    await client.bulk(Environment.TABLE_NAME_WEEKLY_ABILITY, DATAS.WEEKLY06_DB_WEEKLY_ABILITY);
    await client.bulk(Environment.TABLE_NAME_QUESTIONS, DATAS.WEEKLY06_DB_GROUP);

    const apiPath = '/v1/study/weekly/G001/questions/gr4RJGXne2p68Q6oyYcwoN';

    const res = await request(server).post(apiPath).set('authorization', HEADER_AUTH2).send({
      correct: '0',
      mode: 'test',
    });

    const ability = await DBHelper().scan({ TableName: Environment.TABLE_NAME_WEEKLY_ABILITY });
    const groups = await DBHelper().scan({ TableName: Environment.TABLE_NAME_GROUPS });

    // status code
    expect(res.statusCode).toBe(200);
    expect(ability.Items).toEqual(DATAS.WEEKLY06_EXPECT_WEEKLY_ABILITY);
    expect(groups.Items).toEqual(DATAS.WEEKLY06_EXPECT_GROUPS);
  });

  test('007_週テスト対策の練習問題の回答:Yes, 3回未満', async () => {
    await client.bulk(Environment.TABLE_NAME_WEEKLY_ABILITY, DATAS.WEEKLY07_DB_WEEKLY_ABILITY);

    const apiPath = '/v1/study/weekly/G001/questions/87fu6UiJNECBPebKGJcxh1';

    const res = await request(server).post(apiPath).set('authorization', HEADER_AUTH2).send({
      correct: '1',
      mode: 'practice',
    });

    const ability = await DBHelper().scan({ TableName: Environment.TABLE_NAME_WEEKLY_ABILITY });

    // status code
    expect(res.statusCode).toBe(200);
    expect(ability.Items).toEqual(DATAS.WEEKLY07_EXPECT_WEEKLY_ABILITY);
  });

  test('008_週テスト対策の練習問題の回答:Yes, 3回', async () => {
    await client.bulk(Environment.TABLE_NAME_WEEKLY_ABILITY, DATAS.WEEKLY08_DB_WEEKLY_ABILITY);

    const apiPath = '/v1/study/weekly/G001/questions/87fu6UiJNECBPebKGJcxh1';

    const res = await request(server).post(apiPath).set('authorization', HEADER_AUTH2).send({
      correct: '1',
      mode: 'practice',
    });

    const ability = await DBHelper().scan({ TableName: Environment.TABLE_NAME_WEEKLY_ABILITY });

    // status code
    expect(res.statusCode).toBe(200);
    expect(ability.Items).toEqual(DATAS.WEEKLY08_EXPECT_WEEKLY_ABILITY);
  });

  test('009_週テスト対策の練習問題の回答:No', async () => {
    await client.bulk(Environment.TABLE_NAME_WEEKLY_ABILITY, DATAS.WEEKLY09_DB_WEEKLY_ABILITY);

    const apiPath = '/v1/study/weekly/G001/questions/87fu6UiJNECBPebKGJcxh1';

    const res = await request(server).post(apiPath).set('authorization', HEADER_AUTH2).send({
      correct: '0',
      mode: 'practice',
    });

    const ability = await DBHelper().scan({ TableName: Environment.TABLE_NAME_WEEKLY_ABILITY });

    // status code
    expect(res.statusCode).toBe(200);
    expect(ability.Items).toEqual(DATAS.WEEKLY09_EXPECT_WEEKLY_ABILITY);
  });

  test('010_週テスト対策の練習問題の回答:問題存在しない', async () => {
    await client.bulk(Environment.TABLE_NAME_WEEKLY_ABILITY, DATAS.WEEKLY10_DB_WEEKLY_ABILITY);

    const apiPath = '/v1/study/weekly/G001/questions/97fu6UiJNECBPebKGJcxh1';

    const res = await request(server).post(apiPath).set('authorization', HEADER_AUTH2).send({
      correct: '0',
      mode: 'practice',
    });

    // status code
    expect(res.statusCode).toBe(400);
  });
});
