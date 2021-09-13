import * as React from 'react';
import { bindActionCreators } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import { TextField, Box } from '@material-ui/core';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '@components/buttons';
import { GroupActions } from '@actions';
import { RootState } from 'typings';

const groupState = (state: RootState) => state.group;
const appState = (state: RootState) => state.app;

export default () => {
  const actions = bindActionCreators(GroupActions, useDispatch());
  const { groups, activeGroup } = useSelector(groupState);
  const { isLoading } = useSelector(appState);

  // 選択中のGroup情報取得
  const groupInfo = groups.find((item) => item.id === activeGroup);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<{
    name: string;
    description: string;
  }>();

  // 編集
  const onSubmit = handleSubmit((datas) => {
    actions.edit({
      id: activeGroup,
      name: datas.name,
      description: datas.description,
    });
  });

  return (
    <form onSubmit={onSubmit}>
      <Box margin={2}>
        <Controller
          name="name"
          control={control}
          defaultValue={groupInfo?.name}
          rules={{ required: true }}
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
          defaultValue={groupInfo?.description ? groupInfo.description : ''}
          rules={{ required: true }}
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
        <Box mt={2}>
          <Button size="large" fullWidth variant="contained" color="secondary" type="submit" isLoading={isLoading}>
            EDIT
          </Button>
        </Box>
      </Box>
    </form>
  );
};

interface GroupEditForm {
  name: string;
  description?: string;
}
