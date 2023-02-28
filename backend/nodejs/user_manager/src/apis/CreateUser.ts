import express from 'express';
import { Authority } from '@consts';
import { createCognitoUser } from '@cognito';
import { DBHelper, getSettings, Logger } from '@utils';
import { Users as UserQueries } from '@queries';
import { Tables, Users } from 'typings';
import { UsernameExistsException } from '@aws-sdk/client-cognito-identity-provider';
import { SES, VerifyEmailAddressCommand } from '@aws-sdk/client-ses';

const sesClient = new SES({});

/**
 * Create a new user
 *
 * @param req request
 * @returns created user details
 */
export const CreateUser = async (
  req: express.Request<any, any, Users.CreateUserRequest>
): Promise<Users.CreateUserResponse> => {
  Logger.debug(`Creating user: ${req.body.email}`);

  const settings = await getSettings();
  const { userPoolId } = settings;
  const { email } = req.body;

  try {
    const tenantUser: Tables.TUsers = {
      id: email,
      authority: Authority.PARENT,
      role: 'TENANT_USER',
      username: email,
      notification: [email],
    };

    // create new user
    const newUser = await createCognitoUser(userPoolId, tenantUser);

    // send verify address email
    await sesClient.send(
      new VerifyEmailAddressCommand({
        EmailAddress: email,
      })
    );

    // set sub
    if (newUser.Attributes) {
      tenantUser.sub = newUser.Attributes[0].Value;
    }

    // add user record
    await DBHelper.put(UserQueries.put(tenantUser));

    return {
      success: true,
      userId: tenantUser.email,
    };
  } catch (err) {
    Logger.error((err as unknown as any).message);
    let message = 'Unknown Error.';

    // user exists
    if (err instanceof UsernameExistsException) {
      message = (err as UsernameExistsException).message;
    }

    return {
      success: false,
      message: message,
    };
  }
};
