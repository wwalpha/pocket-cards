import * as React from 'react';
import { useSelector } from 'react-redux';
import SignIn from './SignIn';
import App from '../../App';
import { RootState } from 'typings';

const app = (state: RootState) => state.app;

const Authenticator: React.FunctionComponent = () => {
  const { isLogined } = useSelector(app);

  // login status
  if (!isLogined) return <SignIn />;

  return <App />;
};

export default Authenticator;
