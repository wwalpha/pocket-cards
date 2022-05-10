import { Environment } from '@consts';
import { Commons, DBHelper } from '@utils';
import { DynamoDB } from 'aws-sdk';
import { Tables } from 'typings';

export default async (): Promise<void> => {
  const query: DynamoDB.DocumentClient.ScanInput = {
    TableName: Environment.TABLE_NAME_QUESTIONS,
    FilterExpression: 'attribute_not_exists(voiceTitle)',
  };

  const results = await DBHelper().scan<Tables.TQuestions>(query);

  await Commons.updateQuestion(results.Items);
};
