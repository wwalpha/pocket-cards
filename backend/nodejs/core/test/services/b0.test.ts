import { Groups } from '@queries';
import { Commons, DBHelper } from '@utils';
import server from '@src/server';
import request from 'supertest';
import * as B0 from '../datas/b0';
import { APIs } from 'typings';
import { HEADER_AUTH } from '@test/Commons';
import { DynamodbHelper } from '@alphax/dynamodb';

const client = new DynamodbHelper({ options: { endpoint: process.env.AWS_ENDPOINT } });
const TABLE_NAME_GROUPS = process.env.TABLE_NAME_GROUPS as string;

describe('b0', () => {
  afterEach(async () => {
    await client.truncateAll(TABLE_NAME_GROUPS);
  });

  test('b001', async () => {
    const res = await request(server).put('/groups').set('authorization', HEADER_AUTH).send(B0.B001Req);

    // status code
    expect(res.statusCode).toBe(200);

    const { groupId } = res.body as APIs.B001Response;
    const userId = Commons.getUserInfo(HEADER_AUTH);
    const result = await DBHelper().get(Groups.get({ id: groupId, userId: userId }));

    expect(result?.Item).toMatchObject(B0.B001Res);
  });

  test('b002: get list success', async () => {
    await client.bulk(TABLE_NAME_GROUPS, B0.B002DB);

    const res = await request(server).get('/groups').set('authorization', HEADER_AUTH);

    // status code
    expect(res.statusCode).toBe(200);
    // found 2 records
    expect(res.body).toEqual(B0.B002Res01);
  });

  test('b002: empty list', async () => {
    const res = await request(server).get('/groups').set('authorization', HEADER_AUTH);

    // status code
    expect(res.statusCode).toBe(200);
    // found 2 records
    expect(res.body).toEqual(B0.B002Res02);
  });

  test('b003', async () => {
    // initialize table
    await client.bulk(TABLE_NAME_GROUPS, B0.B003DB);

    const res = await request(server).get('/groups/B003').set('authorization', HEADER_AUTH);

    // status code
    expect(res.statusCode).toBe(200);
    // found 2 records
    expect(res.body).toEqual(B0.B003Res01);
  });

  test('b004', async () => {
    // initialize table
    await client.bulk(TABLE_NAME_GROUPS, B0.B004DB01);

    // api call
    const res = await request(server).put('/groups/B004').set('authorization', HEADER_AUTH).send(B0.B004Req01);

    // database
    const result = await DBHelper().get(Groups.get({ id: 'B004', userId: 'B004' }));
    // status code
    expect(res.statusCode).toBe(200);
    // found 2 records
    expect(result?.Item).toEqual(B0.B004Res01);
  });

  test('b005', async () => {
    // initialize table
    await client.bulk(TABLE_NAME_GROUPS, B0.B005DB01);

    // api call
    const res = await request(server).delete('/groups/B005').set('authorization', HEADER_AUTH).send(B0.B004Req01);

    // database
    const userId = Commons.getUserInfo(HEADER_AUTH);
    const result = await DBHelper().get(Groups.get({ id: 'B005', userId: userId }));
    // status code
    expect(res.statusCode).toBe(200);
    // database
    expect(result?.Item).toBeUndefined();
  });
});
