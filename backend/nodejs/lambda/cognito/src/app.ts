import { DynamodbHelper, PutItemInput } from '@alphax/dynamodb';
import { PostConfirmationConfirmSignUpTriggerEvent } from 'aws-lambda';
import { Tables } from 'typings';

const client = new DynamodbHelper({});

export default async (e: PostConfirmationConfirmSignUpTriggerEvent) => {
  console.log(e);

  const item: Tables.TUsers = {
    id: e.userName,
    email: e.request.userAttributes['email'],
    username: e.request.userAttributes['name'],
    role: 'TENANT_USER',
    authority: 'PARENT',
  };

  // ユーザ登録
  try {
    await client.put(put(item));
  } catch (err) {
    // 条件チェックエラーの場合、無視する
    if ((err as any).code === 'ConditionalCheckFailedException') {
      return;
    }

    throw e;
  }
};

/** データ更新 */
const put = (item: Tables.TUsers) =>
  ({
    TableName: process.env.TABLE_USERS as string,
    Item: item,
    ConditionExpression: 'attribute_not_exists(id)',
  } as PutItemInput<Tables.TUsers>);
