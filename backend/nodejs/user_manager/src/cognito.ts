import { DynamodbHelper } from '@alphax/dynamodb';
import { CognitoIdentityServiceProvider, Credentials } from 'aws-sdk';
import express from 'express';
import { decode } from 'jsonwebtoken';
import { Tables, Users } from 'typings';
import { Environments, Authority } from './consts';

const helper = new DynamodbHelper({ options: { endpoint: process.env.AWS_ENDPOINT } });
// init service provider
const provider = new CognitoIdentityServiceProvider();

/**
 * Lookup a user's pool data in the user table
 *
 * @param userId The id of the user being looked up
 */
export const lookupUserPoolData = async (userId: string): Promise<Users.CognitoInfos | undefined> => {
  const searchParams: Tables.TUsersKey = {
    id: userId,
  };

  // get the item from the database
  const results = await helper.get<Tables.TUsers>({
    TableName: Environments.TABLE_NAME_USERS,
    Key: searchParams,
  });

  // not found
  if (!results || !results.Item) {
    return undefined;
  }

  const role = results.Item.role;
  const key: Tables.TSettingsKey = {
    id: role,
  };

  const settings = await helper.get<Tables.TSettingsCognito>({
    TableName: Environments.TABLE_NAME_SETTINGS,
    Key: key,
  });

  // user founded
  return {
    Authority: results.Item.authority,
    ClientId: settings?.Item?.clientId,
    UserPoolId: settings?.Item?.userPoolId,
    IdentityPoolId: settings?.Item?.identityPoolId,
  };
};

/**
 * Create a new user using the supplied credentials/user
 *
 * @param credentials The creds used for the user creation
 * @param userInfo the tenant admin regist request
 * @param cognito The cognito infomations
 */
export const createNewUser = async (
  userInfo: Users.TenantUser,
  userPoolId: string,
  role: 'TENANT_ADMIN' | 'TENANT_USER',
  authority = 'TENANT_ADMIN'
) => {
  const userItem: Tables.TUsers = {
    id: userInfo.email,
    username: userInfo.userName,
    email: userInfo.email,
    role,
    authority,
  };

  // create cognito user;
  const user = await createCognitoUser(userPoolId, userItem);

  // set sub
  if (user.Attributes) {
    userItem.sub = user.Attributes[0].Value;
  }

  const helper = new DynamodbHelper();

  // add user
  await helper.put({
    TableName: Environments.TABLE_NAME_USERS,
    Item: userItem,
  });

  return userItem;
};

/**
 * Extract a token from the header and return its embedded user pool id
 *
 * @param req The request with the token
 * @returns The user pool id from the token
 */
export const getUserPoolIdFromToken = (req: express.Request) => {
  // get token from request
  const token = req.get('Authorization');
  // decode token
  const decodedToken = decodeToken(token);
  // get iss
  const iss = decodedToken.iss;

  if (!iss) {
    throw new Error('Token decode failed.');
  }

  // get user pool id
  return iss.substring(iss.lastIndexOf('/') + 1);
};

/**
 * decode bearer token
 *
 * @param token bearer token
 */
const decodeToken = (token?: string) => {
  // not found
  if (!token) throw new Error(`BearerToken token not exist.`);

  // decode jwt token
  const decodedToken = decode(token, { complete: true });

  // decode failed
  if (decodedToken === null) throw new Error(`Decode token failed. ${token}`);

  if (typeof decodedToken.payload === 'string') {
    throw new Error(`Decode token failed. ${token}`);
  }

  return decodedToken.payload;
};

/**
 * Create a new user
 *
 * @param credentials credentials
 * @param userPoolId user pool id
 * @param user user attributes
 *
 */
export const createCognitoUser = async (userPoolId: string, user: Tables.TUsers) => {
  const attributes: CognitoIdentityServiceProvider.AttributeListType = [
    { Name: 'name', Value: user.username },
    { Name: 'email', Value: user.email },
    { Name: 'custom:role', Value: user.role },
  ];

  // create new user
  const result = await provider
    .adminCreateUser({
      MessageAction: user.authority === Authority.STUDENT ? 'SUPPRESS' : undefined,
      UserPoolId: userPoolId,
      Username: user.email,
      DesiredDeliveryMediums: ['EMAIL'],
      ForceAliasCreation: true,
      UserAttributes: attributes,
    })
    .promise();

  const cognitoUser = result.User;

  if (!cognitoUser) throw new Error('Create new user failed.');

  return cognitoUser;
};

export const getUsers = async (userPoolId: string) => {
  return listUsers(provider, userPoolId);
};

/**
 * list users
 *
 * @param provider
 * @param userPoolId
 * @param token
 * @returns
 */
const listUsers = async (
  provider: CognitoIdentityServiceProvider,
  userPoolId: string,
  token?: string
): Promise<string[]> => {
  const result = await provider
    .listUsers({
      UserPoolId: userPoolId,
      PaginationToken: token,
    })
    .promise();

  // validation
  if (!result.Users) return [];

  const usernames = result.Users.map((item) => item.Attributes)
    .filter((item): item is Exclude<typeof item, undefined> => item !== undefined)
    .map((item) => item.find((user) => user.Name === 'name'))
    .map((item) => item?.Value)
    .filter((item): item is Exclude<typeof item, undefined> => item !== undefined);

  // has more users
  if (result.PaginationToken) {
    const nextUsers = await listUsers(provider, userPoolId, result.PaginationToken);

    return [...usernames, ...nextUsers];
  }

  return usernames;
};

/** force change password */
export const adminSetUserPassword = async (UserPoolId: string, Username: string, Password: string) => {
  await provider
    .adminSetUserPassword({
      UserPoolId,
      Username,
      Password,
      Permanent: true,
    })
    .promise();
};

export const createCognitoUserSilence = async (
  UserPoolId: string,
  Username: string
): Promise<CognitoIdentityServiceProvider.Types.UserType> => {
  const attributes: CognitoIdentityServiceProvider.Types.AttributeListType = [
    { Name: 'name', Value: Username },
    { Name: 'custom:role', Value: 'TENANT_USER' },
  ];

  const res = await provider
    .adminCreateUser({
      UserPoolId,
      Username,
      MessageAction: 'SUPPRESS',
      ForceAliasCreation: true,
      UserAttributes: attributes,
    })
    .promise();

  if (!res.User) {
    throw new Error(`Create cognito user failure. ${Username}`);
  }

  return res.User;
};

/** remove cognito user */
export const adminDeleteUser = async (UserPoolId: string, Username: string) => {
  await provider
    .adminDeleteUser({
      UserPoolId,
      Username,
    })
    .promise();
};
