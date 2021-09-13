import * as React from 'react';
import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import Auth from '@aws-amplify/auth';
import { UserActions } from '@actions';
import SignIn from './SignIn';
import App from '../../App';

const Authenticator: React.FunctionComponent = () => {
  const [isLogin, setLogin] = React.useState(false);
  const [isLoading, setLoading] = React.useState(true);
  const actions = bindActionCreators(UserActions, useDispatch());

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

  return <App />;
};

export default Authenticator;
