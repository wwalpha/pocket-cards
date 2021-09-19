import * as React from 'react';
import { Provider } from 'react-redux';
import { render } from 'react-dom';
import { Auth } from '@aws-amplify/auth';
import { API } from '@aws-amplify/api';
import { PersistGate } from 'redux-persist/integration/react';
import { MuiThemeProvider } from '@material-ui/core';
import { ConnectedRouter } from 'connected-react-router';
import Authenticator from './containers/auth/Authenticator';
import { Consts } from '@constants';
import store from './store';
import theme from './Theme';

Auth.configure({
  // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
  identityPoolId: process.env.IDENTITY_POOL_ID,
  // REQUIRED - Amazon Cognito Region
  region: process.env.AWS_REGION,
  // OPTIONAL - Amazon Cognito Federated Identity Pool Region
  // Required only if it's different from Amazon Cognito Region
  identityPoolRegion: process.env.AWS_REGION,
  // OPTIONAL - Amazon Cognito User Pool ID
  userPoolId: process.env.USER_POOL_ID,
  // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
  userPoolWebClientId: process.env.USER_POOL_WEB_CLIENT_ID,
  // OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
  mandatorySignIn: false,
  // OPTIONAL - Hosted UI configuration
  oauth: {
    domain: process.env.AUTH_DOMAIN,
    scope: ['phone', 'email', 'profile', 'openid', 'aws.cognito.signin.user.admin'],
    redirectSignIn: process.env.AUTH_SIGN_IN_URL,
    redirectSignOut: process.env.AUTH_SIGN_OUT_URL,
    responseType: 'code', // or 'token', note that REFRESH token will only be generated when the responseType is code
  },
});

API.configure({
  endpoints: [
    {
      name: Consts.API_NAME,
      endpoint: Consts.API_URL,
      region: process.env.AWS_REGION,
      custom_header: async () => {
        return { Authorization: (await Auth.currentSession()).getIdToken().getJwtToken() };
      },
    },
  ],
});

const provider = (
  <Provider store={store.store}>
    <PersistGate loading={null} persistor={store.persistor}>
      <MuiThemeProvider theme={theme}>
        <ConnectedRouter history={store.history}>
          <Authenticator />
        </ConnectedRouter>
      </MuiThemeProvider>
    </PersistGate>
  </Provider>
);

const root = document.getElementById('root');

render(provider, root);

// const start = async () => {
//   // const result = await Auth.signUp({
//   //   username: 'wwalphaxx@gmail.com',
//   //   password: 'seSSion99x',
//   //   attributes: {
//   //     email: 'wwalpha@gmail.com',
//   //   },
//   // });

//   // const result = await Auth.confirmSignUp('wwalpha@gmail.com', '867708');

//   // const res = await API.get(API_NAME, '/', {});

//   // console.log(res);
//   // if (res && res.version !== VERSION) {
//   //   window.location.reload(true);
//   //   return;
//   // }

//   render(provider, root);

//   // register();
// };

// start();
