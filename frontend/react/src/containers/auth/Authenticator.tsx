import * as React from 'react';
import { useSelector } from 'react-redux';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { SignIn, SignUp } from '.';
import App from '../../App';
import { RootState } from 'typings';
import { Consts, Paths } from '@constants';
import NewPassword from './NewPassword';
import { Route, Switch } from 'react-router-dom';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const app = (state: RootState) => state.app;
const user = (state: RootState) => state.user;

const Authenticator: React.FunctionComponent = () => {
  const { isShowStack, message } = useSelector(app);
  const { loginStatus } = useSelector(user);

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    // setOpen(false);
  };

  return (
    <React.Fragment>
      {(() => {
        if (loginStatus === Consts.SIGN_STATUS.LOGINED) return <App />;

        return (
          <Switch>
            <Route exact path="/" component={SignIn} />
            <Route path={Paths.PATHS_SIGN_UP} component={SignUp} />
          </Switch>
        );
      })()}
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={isShowStack}
        autoHideDuration={6000}
        onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
};

export default Authenticator;
