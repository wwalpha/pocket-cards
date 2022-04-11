import express from 'express';
import { createCognitoUser } from '@cognito';
import { DBHelper, getSettings, Logger } from '@utils';
import { Users as UserQueries } from '@queries';
import { Tables, Users } from 'typings';

/**
 * Create a new admin user
 *
 * @param req request
 * @returns
 */
export const CreateAdminUser = async (
  req: express.Request<any, any, Users.CreateAdminRequest>
): Promise<Users.CreateAdminResponse> => {
  Logger.debug(`Creating user: ${req.body.email}`);

  const settings = await getSettings('TENANT_ADMIN');
  const { email } = req.body;
  const { userPoolId } = settings;

  const tenantUser: Tables.TUsers = {
    id: email,
    authority: 'TENANT_ADMIN',
    role: 'TENANT_ADMIN',
    username: email,
  };

  // create new user
  const newUser = await createCognitoUser(userPoolId, tenantUser);

  // set sub
  if (newUser.Attributes) {
    tenantUser.sub = newUser.Attributes[0].Value;
  }

  // add user record
  await DBHelper.put(UserQueries.put(tenantUser));

  return { userId: tenantUser.id, email: tenantUser.email, userName: tenantUser.username };
};
