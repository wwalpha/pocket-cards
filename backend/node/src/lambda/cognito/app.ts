import { DynamoDB } from 'aws-sdk';
import { PostAuthenticationTriggerEvent } from 'aws-lambda';
import { Table } from 'typings';

const db = new DynamoDB.DocumentClient();

export default async (e: PostAuthenticationTriggerEvent) => {
  const item: Table.TUsers = {
    id: e.userName,
    email: e.request.userAttributes['email'],
    name: e.request.userAttributes['name'],
    icon: e.request.userAttributes['picture'],
  };

  // ユーザ登録
  try {
    await db.put(put(item)).promise();
  } catch (e) {
    // 条件チェックエラーの場合、無視する
    if (e.code === 'ConditionalCheckFailedException') {
      return;
    }

    throw e;
  }
};

/** データ更新 */
const put = (item: Table.TUsers) =>
  ({
    TableName: process.env.TABLE_USERS as string,
    Item: item,
    ConditionExpression: 'attribute_not_exists(id)',
  } as DynamoDB.DocumentClient.PutItemInput);
