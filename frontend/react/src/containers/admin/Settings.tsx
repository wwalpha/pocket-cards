import React from 'react';
import { bindActionCreators } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { UserActions } from '@actions';
import { RootState, SettingsForm } from 'typings';
import { styles } from './Settings.style';

const app = (state: RootState) => state.app;
const user = (state: RootState) => state.user;

export default () => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector(app);
  const { infos, students, activeStudent } = useSelector(user);
  const actions = bindActionCreators(UserActions, dispatch);

  const getNotification = (index: number): string => {
    if (!infos) return '';
    if (!infos.notification) return '';
    if (infos.notification.length === 0) return '';

    return infos.notification.length > index ? infos.notification[index] : '';
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SettingsForm>({
    defaultValues: {
      notification1: getNotification(0),
      notification2: getNotification(1),
      activeStudent: activeStudent,
    },
  });

  // 編集
  const onSubmit = handleSubmit(({ notification1, notification2, activeStudent }) => {
    actions.updateNotifications([notification1, notification2]);
    actions.setActiveStudent(activeStudent);
  });

  return (
    <Container component="main">
      <Box sx={styles.paper}>
        <form onSubmit={onSubmit} style={{ width: '100%' }}>
          <Typography variant="h4">Notification</Typography>
          <Divider sx={{ borderBottomWidth: 3, mb: 2 }} color="black" />
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
          <Typography variant="h4" sx={{ mt: 2 }}>
            Active User
          </Typography>
          <Divider sx={{ borderBottomWidth: 3, mb: 2 }} color="black" />
          <Controller
            name="activeStudent"
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <FormControl sx={{ my: 2 }} fullWidth>
                <InputLabel>Active Student *</InputLabel>
                <Select label="Active Student *" value={value} onChange={onChange} disabled={students.length === 0}>
                  {(() => {
                    return students.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.username}
                      </MenuItem>
                    ));
                  })()}
                </Select>
              </FormControl>
            )}
          />
          <Box sx={{ my: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <LoadingButton
              loading={isLoading}
              type="submit"
              size="large"
              variant="contained"
              color="secondary"
              sx={styles.submit}>
              Save
            </LoadingButton>
          </Box>
        </form>
      </Box>
    </Container>
  );
};
