import AWS, { AWSError } from 'aws-sdk';
import express from 'express';
import { DynamodbHelper } from '@alphax/dynamodb';
import { Users, Tables } from 'typings';
import { Environments } from './consts';
import { createNewUser, getUsers, lookupUserPoolData } from './cognito';
import { Logger } from './utils';

// update aws config
AWS.config.update({
  region: Environments.AWS_REGION,
  dynamodb: { endpoint: Environments.AWS_ENDPOINT },
});

const helper = new DynamodbHelper();

// health check
export const healthCheck = async () => ({ service: 'User Manager', isAlive: true });

/**
 * lookup user in cognito
 *
 * @param req request
 */
export const lookupUser = async (req: express.Request): Promise<Users.LookupUserResponse> => {
  Logger.debug('Looking up user pool data for: ' + req.params.id);

  // find user in user pool
  const user = await lookupUserPoolData(req.params.id);

  // lookup user response
  return {
    isExist: user !== undefined,
    identityPoolId: user?.IdentityPoolId,
    userPoolId: user?.UserPoolId,
    clientId: user?.ClientId,
  };
};

/**
 * Create a new user
 *
 * @param req request
 * @returns created user details
 */
export const createUser = async (
  req: express.Request<any, any, Users.CreateUserRequest>
): Promise<Users.CreateUserResponse> => {
  Logger.debug(`Creating user: ${req.body.email}`);

  const settings = await helper.get<Tables.TSettingsCognito>({
    TableName: Environments.TABLE_NAME_SETTINGS,
    Key: {
      id: 'TENANT_USER',
    } as Tables.TSettingsKey,
  });

  // data not found
  if (!settings || !settings.Item) {
    throw new Error('Cannot find cognito settings');
  }

  // create new user
  try {
    const user = await createNewUser(req.body, settings.Item.userPoolId, req.body.role);

    return {
      success: true,
      userId: user.email,
    };
  } catch (err) {
    const error = err as AWSError;
    let message = 'Unknown Error.';

    if (error.code === 'UsernameExistsException') {
      message = error.message;
    }

    return {
      success: false,
      message: message,
    };
  }
};

/**
 * Create a new admin user
 *
 * @param req request
 * @returns
 */
export const createAdminUser = async (
  req: express.Request<any, any, Users.CreateAdminRequest>
): Promise<Users.CreateAdminResponse> => {
  Logger.debug(`Creating user: ${req.body.email}`);

  const request = req.body;

  const settings = await helper.get<Tables.TSettingsCognito>({
    TableName: Environments.TABLE_NAME_SETTINGS,
    Key: {
      id: 'TENANT_ADMIN',
    },
  });

  // data not found
  if (!settings || !settings.Item) {
    throw new Error('Cannot find cognito settings');
  }

  // create admin user
  const userItem = await createNewUser(request, settings.Item.userPoolId, 'TENANT_ADMIN');

  return { userId: userItem.id, email: userItem.email, userName: userItem.username };
};

export const listAdminUsers = async (): Promise<Users.ListAdminUsersResponse> => {
  const settings = await helper.get<Tables.TSettingsCognito>({
    TableName: Environments.TABLE_NAME_SETTINGS,
    Key: {
      id: 'TENANT_ADMIN',
    },
  });

  if (!settings?.Item?.userPoolId) {
    throw new Error('Cannot found admin settings');
  }

  const users = await getUsers(settings.Item.userPoolId);

  return {
    users,
  };
};
