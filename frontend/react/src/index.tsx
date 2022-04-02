import * as React from 'react';
import { Provider } from 'react-redux';
import { render } from 'react-dom';
import API from '@aws-amplify/api-rest';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { ThemeProvider } from '@mui/material/styles';
import { ConnectedRouter } from 'connected-react-router';
import Authenticator from './containers/auth/Authenticator';
import { Consts } from '@constants';
import { Credentials } from '@utils';
import store, { history } from './store';
import theme from './Theme';

// Auth.configure({
//   // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
//   identityPoolId: process.env.IDENTITY_POOL_ID,
//   // REQUIRED - Amazon Cognito Region
//   region: process.env.AWS_REGION,
//   // OPTIONAL - Amazon Cognito Federated Identity Pool Region
//   // Required only if it's different from Amazon Cognito Region
//   identityPoolRegion: process.env.AWS_REGION,
//   // OPTIONAL - Amazon Cognito User Pool ID
//   userPoolId: process.env.USER_POOL_ID,
//   // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
//   userPoolWebClientId: process.env.USER_POOL_WEB_CLIENT_ID,
//   // OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
//   mandatorySignIn: false,
//   // OPTIONAL - Hosted UI configuration
//   oauth: {
//     domain: process.env.AUTH_DOMAIN,
//     scope: ['phone', 'email', 'profile', 'openid', 'aws.cognito.signin.user.admin'],
//     redirectSignIn: process.env.AUTH_SIGN_IN_URL,
//     redirectSignOut: process.env.AUTH_SIGN_OUT_URL,
//     responseType: 'code', // or 'token', note that REFRESH token will only be generated when the responseType is code
//   },
// });

API.configure({
  endpoints: [
    {
      name: Consts.API_NAME,
      endpoint: Consts.API_URL,
      region: process.env.AWS_REGION,
      custom_header: async () => {
        return { Authorization: (await Credentials.getSession())?.idToken };
      },
    },
  ],
});

const persistor = persistStore(store);

const provider = (
  <Provider store={store}>
    {/* <PersistGate loading={null} persistor={persistor}> */}
    <ThemeProvider theme={theme}>
      <ConnectedRouter history={history}>
        <Authenticator />
      </ConnectedRouter>
    </ThemeProvider>
    {/* </PersistGate> */}
  </Provider>
);

const root = document.getElementById('root');

render(provider, root);

// window.addEventListener('unhandledrejection', function (event) {
//   console.log(event.promise);
//   console.log(event.reason);
// });
