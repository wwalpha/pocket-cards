// import { DeleteItemInput, GetItemInput, PutItemInput } from '@alphax/dynamodb';
// import * as query from './query';
// import * as update from './update';
// import { Environment } from '@consts';
// import { Tables } from 'typings';

// /** データ取得 */
// export const get = (key: Tables.TWordsKey) =>
//   ({
//     TableName: Environment.TABLE_NAME_WORDS,
//     Key: key,
//   } as GetItemInput);

// /** データ登録 */
// export const put = (item: Tables.TWords): PutItemInput<Tables.TWords> => ({
//   TableName: Environment.TABLE_NAME_WORDS,
//   Item: item,
// });

// export const putNotExist = (item: Tables.TWords): PutItemInput<Tables.TWords> => ({
//   TableName: Environment.TABLE_NAME_WORDS,
//   Item: item,
//   ConditionExpression: 'attribute_not_exists(id)',
// });

// /** データ削除 */
// export const del = (key: Tables.TWordsKey): DeleteItemInput => ({
//   TableName: Environment.TABLE_NAME_WORDS,
//   Key: key,
// });

// export { query, update };
