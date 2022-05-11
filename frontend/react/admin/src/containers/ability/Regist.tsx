import React from 'react';
import { bindActionCreators } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import LoadingButton from '@mui/lab/LoadingButton';
import { Consts } from '@constants';
import { GroupActions } from '@actions';
import { RootState, AbilityForm } from 'typings';
import Paper from '@mui/material/Paper';

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
    actions.registAbility({
      name: datas.name,
      student: datas.student,
      subject: datas.subject,
      groupIds: datas.groupIds,
    });
  });

  const handleBack = () => history.goBack();

  const handleToggle = (id: string, values: string[]) => {
    if (values.includes(id)) {
      const index = values.findIndex((v) => v === id);
      values.splice(index, 1);
    } else {
      values.push(id);
    }
  };

  const groupIds = watch('groupIds');

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
          render={({ field: { value, onChange } }) => {
            const dataRows = groups
              .filter((item) => item.subject === subject)
              .map((item) => {
                const labelId = `checkbox-list-label-${item.id}`;

                return (
                  <ListItem key={item.id} disablePadding sx={{ width: '50%' }}>
                    <ListItemButton
                      role={undefined}
                      onClick={() => {
                        handleToggle(item.id, value);
                        onChange(value);
                      }}
                      dense>
                      <ListItemIcon>
                        <Checkbox
                          edge="start"
                          value={item.id}
                          checked={groupIds.includes(item.id)}
                          tabIndex={-1}
                          disableRipple
                          onChange={(_, checked) => {
                            if (checked === true) {
                              value.push(item.id);
                            } else {
                              const index = value.findIndex((v) => v === item.id);
                              value.splice(index, 1);
                            }
                            onChange(value);
                          }}
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                      </ListItemIcon>
                      <ListItemText id={labelId} primary={item.name} />
                    </ListItemButton>
                  </ListItem>
                );
              });

            return (
              <Paper sx={{ maxHeight: 400, overflow: 'auto', my: 1 }}>
                <Box sx={{ display: 'flex', flexFlow: 'wrap', p: 0 }}>{dataRows}</Box>
              </Paper>
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
