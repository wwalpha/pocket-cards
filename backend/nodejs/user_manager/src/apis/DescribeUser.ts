import express from 'express';
import { DBHelper, getUserId, Logger } from '@utils';
import { Users as UserQueries } from '@queries';
import { Tables, Users } from 'typings';
import { GetItemOutput } from '@alphax/dynamodb';

export const DescribeUser = async (
  req: express.Request<Users.DescribeUserParameter, any, Users.DescribeUserRequest>
): Promise<Users.DescribeUserResponse> => {
  const userId = req.params.userId;
  const request = getUserId(req);

  Logger.debug(`Describe user: ${userId}`);

  let result: GetItemOutput<Tables.TUsers> | undefined;

  if (request === userId) {
    result = await DBHelper.get<Tables.TUsers>(UserQueries.get(userId));
  }

  const item = result?.Item;

  // validation
  if (!item) {
    throw new Error('User not found.');
  }

  return item;
};
