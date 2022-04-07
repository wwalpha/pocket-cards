import React from 'react';
import { bindActionCreators } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import { Button } from '@components/buttons';
import { UserActions } from '@actions';
import { RootState, SignUpForm } from 'typings';

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
  submit: { mt: 1 },
  button: { p: 0 },
};

const SignUp = () => {
  const { isLoading } = useSelector(app);
  const actions = bindActionCreators(UserActions, useDispatch());

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpForm>({ defaultValues });

  // 編集
  const onSubmit = handleSubmit(({ email, username }) => {
    actions.signup(username, email);
  });

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
                autoFocus
                autoComplete="email"
                value={value}
                onChange={onChange}
              />
            )}
          />
          <Box sx={{ my: 2 }}>
            <Button
              isLoading={isLoading}
              type="submit"
              size="large"
              fullWidth
              variant="contained"
              color="primary"
              sx={styles.submit}>
              Sign Up
            </Button>
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
