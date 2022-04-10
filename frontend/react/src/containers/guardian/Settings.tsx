import React from 'react';
import { bindActionCreators } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LoadingButton from '@mui/lab/LoadingButton';
import { UserActions } from '@actions';
import { Paths } from '@constants';
import { RootState, SettingsForm } from 'typings';
import { push } from 'connected-react-router';
import { info } from 'console';

const app = (state: RootState) => state.app;
const user = (state: RootState) => state.user;

const defaultValues: SettingsForm = {
  notification1: '',
  notification2: '',
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

export default () => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector(app);
  const { infos } = useSelector(user);
  const actions = bindActionCreators(UserActions, dispatch);

  const getNotification = (index: number) => {
    if (!infos) return '';
    if (!infos.notification) return '';
    if (infos.notification.length === 0) return '';
    if (infos.notification.length > index) {
      return infos.notification[index];
    }
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SettingsForm>({
    defaultValues: {
      notification1: getNotification(0),
      notification2: getNotification(1),
    },
  });

  // 編集
  const onSubmit = handleSubmit(({ notification1, notification2 }) => {
    console.log(notification1, notification2);
  });

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={styles.paper}>
        <form noValidate onSubmit={onSubmit}>
          <Controller
            name="notification1"
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
                label="通知先１ *"
                autoComplete="email"
                value={value}
                onChange={onChange}
              />
            )}
          />
          <Controller
            name="notification2"
            control={control}
            rules={{
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
                label="通知先２"
                autoComplete="email"
                value={value}
                onChange={onChange}
              />
            )}
          />
          <Box sx={{ my: 2, display: 'flex' }}>
            <LoadingButton
              loading={isLoading}
              type="submit"
              size="large"
              variant="contained"
              color="primary"
              sx={styles.submit}>
              Save
            </LoadingButton>
          </Box>
        </form>
      </Box>
    </Container>
  );
};
