import React from 'react';
import { bindActionCreators } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LoadingButton from '@mui/lab/LoadingButton';
import { UserActions } from '@actions';
import { Paths } from '@constants';
import { RootState, SignUpForm } from 'typings';
import { push } from 'connected-react-router';

const app = (state: RootState) => state.app;
const defaultValues: SignUpForm = {
  email: '',
  username: '',
};

const styles = {
  '@global': {
    body: { bgcolor: 'common.white' },
  },
  paper: { mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' },
  avatar: { m: 1, backgroundColor: 'secondary.main' },
  form: { width: '100%', MimeType: 1 },
  submit: { m: 1, flexGrow: 1 },
  button: { p: 0 },
};

const SignUp = () => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector(app);
  const actions = bindActionCreators(UserActions, dispatch);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpForm>({ defaultValues });

  // 編集
  const onSubmit = handleSubmit(({ email, username }) => {
    actions.signup(username, email);
  });

  const onBack = () => dispatch(push(Paths.PATHS_SIGN_IN));

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box sx={styles.paper}>
        <Typography component="h1" variant="h5">
          Sign up to PocketCards
        </Typography>
        <form noValidate onSubmit={onSubmit}>
          <Controller
            name="username"
            control={control}
            rules={{
              required: 'required',
            }}
            render={({ field: { onChange, value } }) => (
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                label="Username"
                autoFocus
                value={value}
                onChange={onChange}
              />
            )}
          />
          <Controller
            name="email"
            control={control}
            rules={{
              required: 'required',
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: 'Entered value does not match email format',
              },
            }}
            render={({ field: { onChange, value } }) => (
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                label="Email Address"
                autoComplete="email"
                value={value}
                onChange={onChange}
              />
            )}
          />
          <Box sx={{ my: 2, display: 'flex' }}>
            <LoadingButton
              type="submit"
              size="large"
              variant="contained"
              color="secondary"
              sx={styles.submit}
              onClick={onBack}>
              Back
            </LoadingButton>
            <LoadingButton
              loading={isLoading}
              type="submit"
              size="large"
              variant="contained"
              color="primary"
              sx={styles.submit}>
              Sign Up
            </LoadingButton>
          </Box>
          {/* <Button
            type="button"
            variant="contained"
            color="primary"
            size="large"
            sx={styles.button}
            onClick={() => Auth.federatedSignIn({ provider: CognitoHostedUIIdentityProvider.Google })}>
            <img src="./img/btn_google_signin_dark_normal_web.png" />
          </Button> */}
        </form>
      </Box>
    </Container>
  );
};

export default SignUp;
