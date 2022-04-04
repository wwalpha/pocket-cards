import React from 'react';
import { bindActionCreators } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {
  Container,
  CssBaseline,
  Avatar,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  Grid,
  Button as MButton,
  Box,
} from '@mui/material';
import { Button } from '@components/buttons';
import { UserActions } from '@actions';
import { Paths } from '@constants';
import { RootState, SignInForm } from 'typings';
import { default as styles } from './SignIn.style';

const app = (state: RootState) => state.app;
const defaultValues: SignInForm = {
  username: '',
  password: '',
};

const SignIn = () => {
  const classes = styles();
  const { isLoading } = useSelector(app);
  const actions = bindActionCreators(UserActions, useDispatch());

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInForm>({ defaultValues });

  // 編集
  const onSubmit = handleSubmit((datas) => {
    actions.signin(datas.username, datas.password);
  });

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in to PocketCards
        </Typography>
        <form className={classes.form} noValidate onSubmit={onSubmit}>
          <Controller
            name="username"
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
                error={errors.username !== undefined}
                variant="outlined"
                margin="normal"
                fullWidth
                label="Email Address"
                autoFocus
                autoComplete="email"
                value={value}
                onChange={onChange}
                helperText={errors.username?.message}
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            rules={{
              required: 'required',
            }}
            render={({ field: { onChange, value } }) => (
              <TextField
                error={errors.password !== undefined}
                variant="outlined"
                margin="normal"
                fullWidth
                label="Password"
                type="password"
                autoComplete="current-password"
                value={value}
                onChange={onChange}
                helperText={errors.password?.message}
              />
            )}
          />
          <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Remember me" />
          <Button
            isLoading={isLoading}
            type="submit"
            size="large"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}>
            Sign In
          </Button>
          <Box sx={{ m: 1 }}>
            <MButton
              size="large"
              fullWidth
              variant="contained"
              color="secondary"
              component={React.forwardRef((props: any, ref: any) => (
                <Link to={Paths.PATHS_SIGN_UP} {...props} />
              ))}>
              Sign Up
            </MButton>
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
          <Grid container>
            <Grid item xs></Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
};

export default SignIn;
