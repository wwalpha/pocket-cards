import * as React from 'react';
import { bindActionCreators } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { SignIn, SignUp, NewPassword } from '.';
import { AppActions } from '@actions';
import { Consts, Paths } from '@constants';
import { Dashboard } from '@containers/admin';
import { GuardianTop } from '@containers/guardian';

import { RootState } from 'typings';
import App from '../../App';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const app = (state: RootState) => state.app;
const user = (state: RootState) => state.user;

const Authenticator: React.FunctionComponent = () => {
  const { showSnackbar, severity, message } = useSelector(app);
  const { loginStatus } = useSelector(user);
  const actions = bindActionCreators(AppActions, useDispatch());

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason !== 'clickaway') {
      actions.closeSnackbar();
    }
  };

  if (loginStatus === Consts.SIGN_STATUS.NEW_PASSWORD_REQUIRED) {
    return <NewPassword />;
  }

  return (
    <React.Fragment>
      <Switch>
        <Route exact path="/">
          {loginStatus === Consts.SIGN_STATUS.LOGINED ? <App /> : <SignIn />}
        </Route>
        <Route path={Paths.PATHS_SIGN_UP} component={SignUp} />
        <Route path={Paths.PATHS_ADMIN_DASHBOARD}>
          {loginStatus === Consts.SIGN_STATUS.LOGINED ? <Dashboard /> : <SignIn />}
        </Route>
        <Route path={Paths.PATHS_GUARDIAN_TOP}>
          {loginStatus === Consts.SIGN_STATUS.LOGINED ? <GuardianTop /> : <SignIn />}
        </Route>
        <Route>
          <Redirect to={Paths.PATHS_SIGN_IN} />
        </Route>
      </Switch>

      {/* {(() => {
        if (loginStatus === Consts.SIGN_STATUS.LOGINED) return <App />;
        if (loginStatus === Consts.SIGN_STATUS.NOT_LOGIN) {
          return <Redirect to={Paths.PATHS_SIGN_IN} />;
        }

        return (
          <Switch>
            <Route exact path="/" component={SignIn} />
            <Route path={Paths.PATHS_SIGN_UP} component={SignUp} />
          </Switch>
        );
      })()} */}
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={showSnackbar}
        autoHideDuration={6000}
        onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
};

export default Authenticator;
