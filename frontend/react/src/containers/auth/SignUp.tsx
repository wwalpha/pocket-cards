import React from 'react';
import { bindActionCreators } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import {
  Container,
  CssBaseline,
  Typography,
  TextField,
  FormControl,
  Grid,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from '@mui/material';
import { Button } from '@components/buttons';
import { UserActions } from '@actions';
import { RootState, SignUpForm } from 'typings';
import { default as styles } from './SignUp.style';

const app = (state: RootState) => state.app;
const defaultValues: SignUpForm = {
  email: '',
  authority: '',
  username: '',
};

const SignUp = () => {
  const classes = styles();
  const { isLoading } = useSelector(app);
  const actions = bindActionCreators(UserActions, useDispatch());

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpForm>({ defaultValues });

  // 編集
  const onSubmit = handleSubmit(({ email, authority, username }) => {
    actions.signup(username, email, authority);
  });

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Sign up to PocketCards
        </Typography>
        <form className={classes.form} noValidate onSubmit={onSubmit}>
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
          <Controller
            name="authority"
            control={control}
            rules={{
              required: 'required',
            }}
            render={({ field: { onChange, value } }) => (
              <FormControl fullWidth sx={{ mt: 1 }}>
                <InputLabel id="demo-simple-select-label">Role</InputLabel>
                <Select value={value} label="Role" onChange={onChange}>
                  <MenuItem value="PARENT">保護者</MenuItem>
                  <MenuItem value="CHILD">子供</MenuItem>
                </Select>
              </FormControl>
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
              className={classes.submit}>
              Sign Up
            </Button>
          </Box>
          {/* <Button
            type="button"
            variant="contained"
            color="primary"
            size="large"
            className={classes.button}
            onClick={() => Auth.federatedSignIn({ provider: CognitoHostedUIIdentityProvider.Google })}>
            <img src="./img/btn_google_signin_dark_normal_web.png" />
          </Button> */}
        </form>
      </div>
    </Container>
  );
};

export default SignUp;
