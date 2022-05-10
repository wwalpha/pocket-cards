import React from 'react';
import { bindActionCreators } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import { Consts } from '@constants';
import { GroupActions } from '@actions';
import { RootState, AbilityForm } from 'typings';
import FormHelperText from '@mui/material/FormHelperText';

const groupState = (state: RootState) => state.group;
const appState = (state: RootState) => state.app;
const userState = (state: RootState) => state.user;

export default () => {
  const history = useHistory();
  const actions = bindActionCreators(GroupActions, useDispatch());
  const { groups, editable } = useSelector(groupState);
  const { students } = useSelector(userState);
  const { isLoading } = useSelector(appState);

  const {
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<AbilityForm>({
    defaultValues: {
      name: '',
      student: '',
      subject: '',
      groupIds: [],
    },
  });

  const subject = watch('subject');

  // 編集
  const onSubmit = handleSubmit((datas) => {
    console.log(datas);
    actions.registAbility({
      name: datas.name,
      student: datas.student,
      subject: datas.subject,
      groupIds: datas.groupIds,
    });
  });

  const handleBack = () => history.goBack();

  return (
    <form onSubmit={onSubmit}>
      <Box margin={2}>
        <Box display="flex">
          <Controller
            name="name"
            control={control}
            rules={{ required: 'required' }}
            render={({ field: { onChange, value } }) => (
              <TextField
                error={errors.name !== undefined}
                helperText={errors.name?.message}
                sx={{ mt: 0, mr: 1 }}
                variant="outlined"
                margin="normal"
                fullWidth
                label="Name *"
                value={value}
                onChange={onChange}
              />
            )}
          />
          <Controller
            name="student"
            control={control}
            rules={{ required: 'required' }}
            render={({ field: { onChange, value } }) => (
              <FormControl fullWidth error={errors.student !== undefined}>
                <InputLabel id="subject-label">Student *</InputLabel>
                <Select label="Student *" value={value} onChange={onChange}>
                  {(() => {
                    return students.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.username}
                      </MenuItem>
                    ));
                  })()}
                </Select>
                {errors.student ? <FormHelperText>{errors.student.message}</FormHelperText> : undefined}
              </FormControl>
            )}
          />
        </Box>
        <Controller
          name="subject"
          control={control}
          rules={{ required: 'required' }}
          render={({ field: { onChange, value } }) => (
            <FormControl fullWidth sx={{ mt: 1 }} error={errors.subject !== undefined}>
              <InputLabel id="subject-label">Subject *</InputLabel>
              <Select labelId="subject-label" onChange={onChange} value={value} label="Subject">
                <MenuItem value={Consts.SUBJECT.SCIENCE}>理 科</MenuItem>
                <MenuItem value={Consts.SUBJECT.SOCIETY}>社 会</MenuItem>
              </Select>
              {errors.subject ? <FormHelperText>{errors.subject.message}</FormHelperText> : undefined}
            </FormControl>
          )}
        />
        <Controller
          name="groupIds"
          rules={{ required: 'required' }}
          control={control}
          render={({ field: { value } }) => {
            const dataRows = groups
              .filter((item) => item.subject === subject)
              .map((item) => (
                <FormControlLabel
                  key={item.id}
                  label={item.name}
                  control={
                    <Checkbox
                      sx={{ mx: 2 }}
                      value={item.id}
                      onChange={(_, checked) => {
                        if (checked === true) {
                          value.push(item.id);
                        } else {
                          const index = value.findIndex((v) => v === item.id);
                          value.splice(index, 1);
                        }
                      }}
                    />
                  }
                />
              ));

            return (
              <FormGroup sx={{ border: 1, mt: 2, height: 'calc(100vh - 340px)', borderColor: 'grey' }}>
                {dataRows}
              </FormGroup>
            );
          }}
        />

        <Box mt={2} display="flex" flexDirection="row-reverse">
          <LoadingButton
            size="large"
            variant="contained"
            color="primary"
            type="submit"
            loading={isLoading}
            sx={{ mx: 1, width: 120 }}>
            REGIST
          </LoadingButton>

          <Button size="large" variant="contained" color="secondary" sx={{ mx: 1, width: 120 }} onClick={handleBack}>
            BACK
          </Button>
        </Box>
      </Box>
    </form>
  );
};
