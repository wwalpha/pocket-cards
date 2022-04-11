import { DynamodbHelper } from '@alphax/dynamodb';
import { AWSError, CognitoIdentityServiceProvider, Request, Response, HttpRequest, Endpoint } from 'aws-sdk';
import { mocked } from 'jest-mock';
import { Users as UserQuery } from '../src/queries';
import request from 'supertest';
import { Users } from 'typings';
import Server from '../src/server';
import { mockedAdminCreateUser } from './mockUtils';

const client = new DynamodbHelper({ options: { endpoint: process.env.AWS_ENDPOINT } });

describe('user manager', () => {
  test('get /users/health', async () => {
    const response = await request(Server).get('/v1/users/health');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      service: 'User Manager',
      isAlive: true,
    });
  });

  test.skip('get /v1/users/admins', async () => {
    mocked(CognitoIdentityServiceProvider).prototype.listUsers = jest.fn().mockImplementationOnce(() => ({
      promise: () =>
        Promise.resolve({
          Users: [
            { Attributes: [{ Name: 'name', Value: 'test001@test.com' }] },
            { Attributes: [{ Name: 'name', Value: 'test002@test.com' }] },
          ],
        }),
    }));

    const response = await request(Server).get('/v1/users/admins');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      users: ['test001@test.com', 'test002@test.com'],
    } as Users.ListAdminUsersResponse);
  });

  test.skip('Create student success', async () => {
    // mockedAdminCreateUser('test001');
    // mocked(CognitoIdentityServiceProvider).prototype.adminCreateUser = jest.fn().mockImplementationOnce(() => ({
    //   promise: (): Promise<CognitoIdentityServiceProvider.Types.UserType> =>
    //     Promise.resolve({
    //       Enabled: true,
    //       UserStatus: 'TTT',
    //       Username: username,
    //     }),
    // }));

    CognitoIdentityServiceProvider.prototype.adminCreateUser = jest.fn().mockReturnValueOnce({
      promise: () => {
        console.log(1111111);
        return jest.fn().mockResolvedValueOnce({
          User: {
            Enabled: true,
            UserStatus: 'TTT',
            Username: 'aaaa',
          },
        });
      },
    });

    //   promise: (): Promise<CognitoIdentityServiceProvider.Types.UserType> =>
    //     Promise.resolve({
    //       Enabled: true,
    //       UserStatus: 'TTT',
    //       Username: username,
    //     }),
    // }));
    const results = await client.scan({ TableName: 'pkc-settings' });

    console.log(results);
    const username = 'test001';
    const password = 'code001code001';

    const response = await request(Server)
      .post('/v1/users/students')
      .send({
        username: username,
        password: password,
      } as Users.CreateStudentRequest);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: 'true',
    } as Users.CreateStudentResponse);

    const result = await client.get(UserQuery.get(username));

    console.log(result);
  });
});
