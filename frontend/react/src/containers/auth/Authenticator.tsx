import * as React from 'react';
import { useDispatch } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import Auth from '@aws-amplify/auth';
import { Paths } from '@constants';
import * as Actions from '@actions/app';
import SignIn from './SignIn';

const Authenticator: React.FunctionComponent = ({ children }) => {
  const [isLogin, setLogin] = React.useState(false);
  const [isLoading, setLoading] = React.useState(true);
  const actions = bindActionCreators(Actions, useDispatch());

  React.useEffect(() => {
    if (isLogin) return;

    const checkUser = async () => {
      try {
        const user = await Auth.currentAuthenticatedUser();

        // set login status
        setLogin(user !== undefined);

        actions.loggedIn(user);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  // loading...
  if (isLoading) return <div />;

  // login status
  if (!isLogin) return <SignIn />;

  return <React.Fragment>{children}</React.Fragment>;
};

export default Authenticator;
