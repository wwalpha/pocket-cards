import axios from 'axios';
import { Consts } from '@consts';
import { Users } from 'typings';
import { IncomingHttpHeaders } from 'http';

export const getUserInfo = async (userId: string, headers: IncomingHttpHeaders) => {
  // get user information
  const response = await axios.get<Users.DescribeUserResponse>(Consts.API_URLs.describeUser(userId), {
    headers: {
      authorization: headers['authorization'],
      username: headers['username'],
    },
  });

  // user not found
  if (response.status !== 200) {
    throw new Error('User not found.');
  }

  return response.data;
};
