import server from '@src/app';
import request from 'supertest';
import * as COMMONS from '../../datas/commons';
import * as INQUIRES from '../../datas/inquires/regist';
import { HEADER_AUTH } from '@test/Commons';
import { DynamodbHelper } from '@alphax/dynamodb';
import { Environment } from '@consts';
import { APIs } from 'typings';
import { InquiryService } from '@services';

const client = new DynamodbHelper({ options: { endpoint: process.env['AWS_ENDPOINT_DYNAMODB'] } });

jest.setTimeout(10000);

describe('Inquiry', () => {
  beforeEach(async () => {
    await Promise.all([client.bulk(Environment.TABLE_NAME_INQUIRY, COMMONS.DB_INQUIRY)]);
  });

  afterEach(async () => {
    await Promise.all([client.truncateAll(Environment.TABLE_NAME_INQUIRY)]);
  });

  test('Regist01: 新規登録', async () => {
    const api = `/v1/inquiries`;
    const id = '2Ng9WAsVZWxJh2gdt6EnNJ';

    const res = await request(server)
      .post(api)
      .set('username', HEADER_AUTH)
      .send({
        id,
      } as APIs.InquiryRegistResquest);

    // status code
    expect(res.statusCode).toBe(200);

    const result = await InquiryService.describe(id);

    expect(result).toEqual(INQUIRES.REGIST_001_EXPECT);
  });
});
