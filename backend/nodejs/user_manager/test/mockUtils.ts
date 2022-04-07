import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { mocked } from 'jest-mock';

export const mockedAdminCreateUser = (
  username: string,
  Attributes?: CognitoIdentityServiceProvider.Types.AttributeListType
) =>
  (mocked(CognitoIdentityServiceProvider).prototype.adminCreateUser = jest.fn().mockImplementationOnce(() => ({
    promise: (): Promise<CognitoIdentityServiceProvider.Types.UserType> =>
      Promise.resolve({
        Enabled: true,
        UserStatus: 'TTT',
        Username: username,
        Attributes,
      }),
  })));
