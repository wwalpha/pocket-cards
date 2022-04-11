import express from 'express';
import { DBHelper, getUserId, Logger } from '@utils';
import { Users as UserQueries } from '@queries';
import { Users } from 'typings';
import { DescribeUser } from '.';

export const UpdateUser = async (
  req: express.Request<Users.UpdateUserParameter, any, Users.UpdateUserRequest>
): Promise<Users.UpdateUserResponse> => {
  const userId = req.params.userId;
  const request = getUserId(req);

  Logger.debug(`Update user: ${userId}`);

  if (request !== userId) {
    throw new Error('Cannot update other user informations.');
  }

  // get user details
  const res = await DescribeUser(req);

  // update user details
  await DBHelper.put(
    UserQueries.put({
      ...res,
      notification: req.body.notifications,
    })
  );
};
