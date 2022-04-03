import React from 'react';
import { bindActionCreators } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import { Consts } from '@constants';
import { GroupActions } from '@actions';
import { RootState, GroupEditForm } from 'typings';

const groupState = (state: RootState) => state.group;
const appState = (state: RootState) => state.app;

export default () => {
  const history = useHistory();
  const actions = bindActionCreators(GroupActions, useDispatch());
  const { groups, activeGroup } = useSelector(groupState);
  const { isLoading } = useSelector(appState);

  // 選択中のGroup情報取得
  const groupInfo = groups.find((item) => item.id === activeGroup);

  console.log(groupInfo);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<GroupEditForm>({
    defaultValues: {
      name: groupInfo?.name,
      description: groupInfo?.description,
      subject: groupInfo?.subject,
    },
  });

  // 編集
  const onSubmit = handleSubmit((datas) => {
    actions.edit({
      id: activeGroup,
      name: datas.name,
      description: datas.description,
      subject: datas.subject,
    });
  });

  const handleBack = () => history.goBack();

  const [age, setAge] = React.useState('');

  const handleChange = (event: any) => {
    setAge(event.target.value as string);
  };

  return (
    <form onSubmit={onSubmit}>
      <Box margin={2}>
        <Controller
          name="name"
          control={control}
          rules={{ required: 'required' }}
          render={({ field: { onChange, value } }) => (
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label="Group Name"
              value={value}
              onChange={onChange}
            />
          )}
        />
        <Controller
          name="description"
          control={control}
          render={({ field: { onChange, value } }) => (
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label="Group Description"
              value={value}
              onChange={onChange}
            />
          )}
        />
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Age</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={age}
            label="Age"
            onChange={handleChange}>
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ my: 2 }} fullWidth>
          <InputLabel id="demo-simple-select-helper-label">Subject *</InputLabel>

          <Controller
            name="subject"
            control={control}
            rules={{ required: 'required' }}
            render={({ field: { onChange, value } }) => (
              <Select onChange={onChange} value={value} fullWidth>
                <MenuItem value={Consts.SUBJECT.JAPANESE.toString()}>国 語</MenuItem>
                <MenuItem value={Consts.SUBJECT.SCIENCE.toString()}>理 科</MenuItem>
                <MenuItem value={Consts.SUBJECT.SOCIETY.toString()}>社 会</MenuItem>
              </Select>
            )}
          />
        </FormControl>

        <Controller
          name="subject"
          control={control}
          rules={{ required: 'required' }}
          render={({ field: { onChange, value } }) => (
            <Select onChange={onChange} value={value} fullWidth>
              <MenuItem value={Consts.SUBJECT.JAPANESE.toString()}>国 語</MenuItem>
              <MenuItem value={Consts.SUBJECT.SCIENCE.toString()}>理 科</MenuItem>
              <MenuItem value={Consts.SUBJECT.SOCIETY.toString()}>社 会</MenuItem>
            </Select>
          )}
        />

        <Box mt={2} display="flex" flexDirection="row-reverse">
          <LoadingButton
            size="large"
            variant="contained"
            color="primary"
            type="submit"
            loading={isLoading}
            sx={{ mx: 1 }}>
            EDIT
          </LoadingButton>
          <Button size="large" variant="contained" color="secondary" sx={{ mx: 1 }} onClick={handleBack}>
            BACK
          </Button>
        </Box>
      </Box>
    </form>
  );
};
