import express from 'express';
import { Authority } from '@consts';
import { adminDeleteUser, adminSetUserPassword, createCognitoUser } from '@cognito';
import { DBHelper, getSettings, getUserId, Logger } from '@utils';
import { Users as UserQueries } from '@queries';
import { Tables, Users } from 'typings';
import { InvalidPasswordException } from '@aws-sdk/client-cognito-identity-provider';

export const CreateStudent = async (
  req: express.Request<any, any, Users.CreateStudentRequest>
): Promise<Users.CreateStudentResponse> => {
  Logger.debug(`Creating user: ${req.body.username}`);

  const { username, password } = req.body;
  const teacherId = getUserId(req);
  const settings = await getSettings();
  const { userPoolId } = settings;

  try {
    const student: Tables.TUsers = {
      id: username,
      authority: Authority.STUDENT,
      role: 'TENANT_USER',
      username: username,
      teacher: teacherId,
    };

    // create new user
    const newUser = await createCognitoUser(userPoolId, student);

    // reset default password
    await adminSetUserPassword(userPoolId, username, password);

    if (newUser.Attributes) {
      student.sub = newUser.Attributes[0].Value;
    }

    // add user
    await DBHelper.put(UserQueries.put(student));

    // success
    return { success: 'true' };
  } catch (err) {
    if (err instanceof InvalidPasswordException) {
      await adminDeleteUser(userPoolId, username);

      // failure
      return { success: 'false' };
    }

    throw err;
  }
};
