import server from '@src/app';
import request from 'supertest';
import * as COMMONS from '../../datas/commons';
import * as INQUIRES from '../../datas/inquires/remove';
import { HEADER_AUTH } from '@test/Commons';
import { DynamodbHelper } from '@alphax/dynamodb';
import { Environment } from '@consts';
import { InquiryService } from '@services';

const client = new DynamodbHelper({ options: { endpoint: process.env['AWS_ENDPOINT_DYNAMODB'] } });

jest.setTimeout(10000);

describe('Inquiry', () => {
  beforeEach(async () => {
    await Promise.all([client.bulk(Environment.TABLE_NAME_INQUIRY, COMMONS.DB_INQUIRY)]);
    await Promise.all([client.bulk(Environment.TABLE_NAME_INQUIRY, COMMONS.DB_INQUIRY)]);
  });

  afterEach(async () => {
    await Promise.all([client.truncateAll(Environment.TABLE_NAME_INQUIRY)]);
  });

  test('Remove01: 削除', async () => {
    const api = `/v1/inquiries/fBTFsyZGVkknQtKBBpfuhJ`;

    const res = await request(server).delete(api).set('username', HEADER_AUTH);

    // status code
    expect(res.statusCode).toBe(200);

    const results = await InquiryService.getAll();

    expect(results).toEqual(INQUIRES.REMOVE_001_EXPECT);
  });
});
