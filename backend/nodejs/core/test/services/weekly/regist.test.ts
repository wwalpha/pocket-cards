import server from '@src/app';
import request from 'supertest';
import * as COMMONS from '../../datas/commons';
import * as WEEKLY from '../../datas/weekly';
import { LearningService } from '@services';
import { Environment } from '@consts';
import { HEADER_AUTH, HEADER_USER } from '@test/Commons';
import { DynamodbHelper } from '@alphax/dynamodb';
import { APIs } from 'typings';

const client = new DynamodbHelper({ options: { endpoint: process.env['AWS_ENDPOINT_DYNAMODB'] } });

describe('Weekly', () => {
  beforeAll(async () => {
    await Promise.all([
      client.bulk(Environment.TABLE_NAME_QUESTIONS, COMMONS.DB_QUESTIONS),
      client.bulk(Environment.TABLE_NAME_GROUPS, COMMONS.DB_GROUPS),
    ]);
  });
  afterAll(async () => {
    await Promise.all([
      client.truncateAll(Environment.TABLE_NAME_QUESTIONS),
      client.truncateAll(Environment.TABLE_NAME_GROUPS),
    ]);
  });

  beforeEach(async () => {
    await Promise.all([client.bulk(Environment.TABLE_NAME_LEARNING, COMMONS.DB_LEARNING)]);
  });
  afterEach(async () => {
    await Promise.all([client.truncateAll(Environment.TABLE_NAME_LEARNING)]);
  });

  test('WeeklyRegist01', async () => {
    const apiPath = '/v1/study/weekly';
    const userId = HEADER_USER;
    const groupId = 'sGd6gX36nvnMaSCDTiYZ2Z';

    const res = await request(server)
      .post(apiPath)
      .set('username', HEADER_AUTH)
      .send({
        groupIds: [groupId],
        student: userId,
      } as APIs.WeeklyRegistRequest);

    // status code
    expect(res.statusCode).toBe(200);

    const result = await LearningService.listByWeekly(userId, '3');

    expect(result).toEqual(WEEKLY.REGIST_01_EXPECT);
  });

  test('WeeklyRegist02: Group id required', async () => {
    const apiPath = '/v1/study/weekly';
    const userId = HEADER_USER;

    const res = await request(server)
      .post(apiPath)
      .set('username', HEADER_AUTH)
      .send({
        student: userId,
      } as APIs.WeeklyRegistRequest);

    // status code
    expect(res.statusCode).toBe(400);
    expect(res.text).toEqual('Group id is required.');
  });

  test('WeeklyRegist03: Group is not exists', async () => {
    const apiPath = '/v1/study/weekly';
    const userId = HEADER_USER;

    const res = await request(server)
      .post(apiPath)
      .set('username', HEADER_AUTH)
      .send({
        student: userId,
        groupIds: ['dummy'],
      } as APIs.WeeklyRegistRequest);

    // status code
    expect(res.statusCode).toBe(400);
    expect(res.text).toEqual('Group is not exists.');
  });
});
