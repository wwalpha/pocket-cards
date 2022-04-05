import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { useForm, Controller } from 'react-hook-form';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { Button } from '@components/buttons';
import { UserActions } from '@actions';
import { RootState, NewPasswordForm } from 'typings';

const appState = (state: RootState) => state.app;
const userState = (state: RootState) => state.user;

const defaultValues: NewPasswordForm = {
  newPassword: '',
  confirmPassword: '',
  oldPassword: '',
};

const styles = {
  paper: {
    mt: 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: { margin: 1, bgcolor: 'secondary.main' },
  form: {
    width: '100%', // Fix IE 11 issue.
    mt: 1,
  },
  submit: { mt: 3, mb: 0, ml: 2 },
  button: { p: 0 },
};

const NewPassword = () => {
  const actions = bindActionCreators(UserActions, useDispatch());
  const { isLoading } = useSelector(appState);
  const { username, password } = useSelector(userState);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<NewPasswordForm>({
    defaultValues: {
      ...defaultValues,
      oldPassword: password || '',
    },
  });

  const onSubmit = handleSubmit(({ oldPassword, newPassword }) => {
    actions.signin(username, oldPassword, newPassword);
  });

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box sx={styles.paper}>
        <form noValidate onSubmit={onSubmit}>
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
      </Box>
    </Container>
  );
};

export default NewPassword;
