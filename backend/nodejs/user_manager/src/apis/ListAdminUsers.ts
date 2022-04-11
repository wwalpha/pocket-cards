import { getUsers } from '@cognito';
import { getSettings } from '@utils';
import { Users } from 'typings';

export const ListAdminUsers = async (): Promise<Users.ListAdminUsersResponse> => {
  const settings = await getSettings();

  const users = await getUsers(settings.userPoolId);

  return {
    users,
  };
};
