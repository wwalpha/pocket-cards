import React, { FunctionComponent } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import { UserForm } from 'typings';

const defaultValues: UserForm = {
  username: '',
  password: '',
};

const regist: FunctionComponent<UserRegistProps> = ({ loading, regist }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UserForm>({ defaultValues });

  const onSubmit = handleSubmit(({ password, username }) => {
    regist(username, password);
  });

  return (
    <React.Fragment>
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
              autoFocus
              label="Username"
              value={value}
              onChange={onChange}
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
              variant="outlined"
              margin="normal"
              fullWidth
              label="Password"
              value={value}
              onChange={onChange}
            />
          )}
        />
        <Box sx={{ my: 2, display: 'flex' }}>
          <LoadingButton loading={loading} fullWidth type="submit" size="large" variant="contained" color="primary">
            Regist
          </LoadingButton>
        </Box>
      </form>
    </React.Fragment>
  );
};

interface UserRegistProps {
  loading?: boolean;
  regist: (username: string, password: string) => void;
}

export default regist;
