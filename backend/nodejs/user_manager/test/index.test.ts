import { DynamodbHelper } from '@alphax/dynamodb';
import { CognitoIdentityProviderClient, ListUsersCommand } from '@aws-sdk/client-cognito-identity-provider';
import { mockClient } from 'aws-sdk-client-mock';
import { Users as UserQuery } from '../src/queries';
import request from 'supertest';
import { Users } from 'typings';
import Server from '../src/server';

const client = new DynamodbHelper({ options: { endpoint: process.env.AWS_ENDPOINT } });
const cognitoMock = mockClient(CognitoIdentityProviderClient);

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
    cognitoMock.reset();
    cognitoMock.on(ListUsersCommand).resolves({
      Users: [
        { Attributes: [{ Name: 'name', Value: 'test001@test.com' }] },
        { Attributes: [{ Name: 'name', Value: 'test002@test.com' }] },
      ],
    });

    const response = await request(Server).get('/v1/users/admins');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      users: ['test001@test.com', 'test002@test.com'],
    } as Users.ListAdminUsersResponse);
  });

  test.skip('Create student success', async () => {
    cognitoMock.reset();
    cognitoMock.onAnyCommand().resolves({
      User: {
        Enabled: true,
        UserStatus: 'TTT',
        Username: 'aaaa',
      },
    });

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
