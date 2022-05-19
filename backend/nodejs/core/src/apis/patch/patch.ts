import { Environment } from '@consts';
import { DBHelper } from '@utils';
import { CurriculumService } from '@services';

import { DynamoDB } from 'aws-sdk';
import { Tables } from 'typings';
import groupBy from 'lodash/groupBy';

export default async (): Promise<void> => {
  const query: DynamoDB.DocumentClient.ScanInput = {
    TableName: Environment.TABLE_NAME_LEARNING,
    FilterExpression: '#lastTime = :lastTime',
    ExpressionAttributeNames: {
      '#lastTime': 'lastTime',
    },
    ExpressionAttributeValues: {
      ':lastTime': '19900101',
    },
  };

  const results = await DBHelper().scan<Tables.TLearning>(query);

  // results.Items
  const groups = groupBy(results.Items, (item) => `${item.groupId}|${item.userId}`);

  await Promise.all(
    Object.keys(groups).map(async (key) => {
      const keys = key.split('|');
      const groupId = keys[0];
      const userId = keys[1];

      if (!groupId || !userId) return;

      const items = await CurriculumService.getListByGroup(groupId);

      if (items.length === 0) return;

      const datas = items.filter((item) => item.userId === userId);

      if (datas.length === 0) return;

      const cid = datas[0]?.id;

      const item = await CurriculumService.describe(cid!);

      if (!item) return;

      item.unlearned = groups[key]!.length;

      await CurriculumService.update(item);
    })
  );
};
