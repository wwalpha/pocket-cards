import axios from 'axios';
import { Consts } from '@consts';
import { Users } from 'typings';

export const getUserInfo = async (userId: string, token?: string) => {
  // get user information
  const response = await axios.get<Users.DescribeUserResponse>(Consts.API_URLs.describeUser(userId), {
    headers: {
      authorization: token,
    },
  });

  // user not found
  if (response.status !== 200) {
    throw new Error('User not found.');
  }

  return response.data;
};
