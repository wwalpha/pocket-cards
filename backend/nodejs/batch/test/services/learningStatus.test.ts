import { default as LearningStatus } from '@src/func/learningStatus';
import * as COMMONS from '../datas/commons';
import * as DATAS from '../datas/learningStatus';
import { DynamodbHelper } from '@alphax/dynamodb';
import { DateUtils, Environments } from '@utils';
import { HEADER_USER } from '@test/Commons';
import { LearningService } from '@src/services';
import moment from 'moment';

const client = new DynamodbHelper({ options: { endpoint: process.env['AWS_ENDPOINT_DYNAMODB'] } });

jest.setTimeout(10000);

describe('LearningStatus', () => {
  beforeEach(async () => {
    await Promise.all([
      client.bulk(Environments.TABLE_NAME_USERS, COMMONS.DB_USERS),
      client.bulk(Environments.TABLE_NAME_LEARNING, COMMONS.DB_LEARNING),
    ]);
  });

  afterEach(async () => {
    await Promise.all([
      client.truncateAll(Environments.TABLE_NAME_USERS),
      client.truncateAll(Environments.TABLE_NAME_LEARNING),
    ]);
  });

  test('LearningStatus001: 当日、且つ times > 0', async () => {
    const qid = '85EuLteEPQ4pzcYN442PUX';
    const date = DateUtils.getNow();
    // get item
    const item = await LearningService.describe(qid, HEADER_USER);

    // if not found
    if (!item) throw new Error('');

    item.nextTime = date;

    // update data
    await LearningService.update(item);

    // テスト実行
    await LearningStatus();

    const result = await LearningService.describe(qid, HEADER_USER);

    expect(result).toMatchObject(DATAS.LEARNINGSTATUS_001_EXCEPTS);
    expect(result?.subject_status).not.toBeUndefined();
  });

  test('LearningStatus002: 当日、且つ times = 0', async () => {
    const qid = '85EuLteEPQ4pzcYN442PUX';
    const date = DateUtils.getNow();
    // get item
    const item = await LearningService.describe(qid, HEADER_USER);

    // if not found
    if (!item) throw new Error('');

    item.nextTime = date;
    item.times = 0;

    // update data
    await LearningService.update(item);

    // テスト実行
    await LearningStatus();

    const result = await LearningService.describe(qid, HEADER_USER);

    expect(result).toMatchObject(DATAS.LEARNINGSTATUS_002_EXCEPTS);
    expect(result?.subject_status).toBeUndefined();
  });

  test('LearningStatus003: 前日、且つ times = 0', async () => {
    const qid = '85EuLteEPQ4pzcYN442PUX';
    const yesterday = moment().add(-1, 'days').format('YYYYMMDD');
    // get item
    const item = await LearningService.describe(qid, HEADER_USER);

    // if not found
    if (!item) throw new Error('');

    item.nextTime = yesterday;
    item.lastTime = yesterday;
    item.times = 0;
    item.subject_status = '3_TEST';

    // update data
    await LearningService.update(item);

    // テスト実行
    await LearningStatus();

    const result = await LearningService.describe(qid, HEADER_USER);

    expect(result).not.toBeUndefined();
    expect(result).toMatchObject(DATAS.LEARNINGSTATUS_003_EXCEPTS);
    expect(result?.subject_status).toBeUndefined();
  });

  test('LearningStatus004: 未来、且つ lastTime = yesterday', async () => {
    const qid = '85EuLteEPQ4pzcYN442PUX';
    const yesterday = moment().add(-1, 'days').format('YYYYMMDD');
    const tomorrow = moment().add(1, 'days').format('YYYYMMDD');

    // get item
    const item = await LearningService.describe(qid, HEADER_USER);

    // if not found
    if (!item) throw new Error('');

    item.nextTime = tomorrow;
    item.lastTime = yesterday;
    item.times = 3;
    item.subject_status = '3_TEST';

    // update data
    await LearningService.update(item);

    // テスト実行
    await LearningStatus();

    const result = await LearningService.describe(qid, HEADER_USER);

    expect(result).not.toBeUndefined();
    expect(result).toMatchObject(DATAS.LEARNINGSTATUS_004_EXCEPTS);
    expect(result?.subject_status).toBeUndefined();
  });
});
