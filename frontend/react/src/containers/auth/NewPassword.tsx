import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { useForm, Controller } from 'react-hook-form';
import { Container, CssBaseline, TextField } from '@mui/material';
import { Button } from '@components/buttons';
import { UserActions } from '@actions';
import { RootState, NewPasswordForm } from 'typings';
import { default as styles } from './SignIn.style';

const appState = (state: RootState) => state.app;
const userState = (state: RootState) => state.user;

const defaultValues: NewPasswordForm = {
  oldPassword: 'g/oiqZ4UX3',
  newPassword: '',
  confirmPassword: '',
};

const NewPassword = () => {
  const classes = styles();
  const actions = bindActionCreators(UserActions, useDispatch());
  const { isLoading } = useSelector(appState);
  const { username } = useSelector(userState);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<NewPasswordForm>({ defaultValues });

  const onSubmit = handleSubmit(({ oldPassword, newPassword }) => {
    actions.signin(username, oldPassword, newPassword);
  });

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <form className={classes.form} noValidate onSubmit={onSubmit}>
          <Controller
            name="oldPassword"
            control={control}
            rules={{ required: 'required' }}
            render={({ field: { onChange, value } }) => (
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                label="Old Password"
                autoFocus
                value={value}
                onChange={onChange}
              />
            )}
          />
          <Controller
            name="newPassword"
            control={control}
            rules={{ required: 'required' }}
            render={({ field: { onChange, value } }) => (
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                label="New Password"
                value={value}
                onChange={onChange}
              />
            )}
          />
          <Controller
            name="confirmPassword"
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                label="Confirm Password"
                value={value}
                onChange={onChange}
              />
            )}
          />
          <Button isLoading={isLoading} type="submit" size="large" fullWidth variant="contained" color="primary">
            Confirm
          </Button>
        </form>
      </div>
    </Container>
  );
};

export default NewPassword;
