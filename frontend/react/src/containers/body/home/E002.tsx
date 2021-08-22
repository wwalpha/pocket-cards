import * as React from 'react';
import { TextField, Box } from '@material-ui/core';
import { bindActionCreators } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '@components/buttons';
import * as Actions from '@actions/group';
import { Domains } from 'typings';

const groupState = (state: Domains.State) => state.group;
const appState = (state: Domains.State) => state.app;

export default () => {
  const actions = bindActionCreators(Actions, useDispatch());
  const { groups } = useSelector(groupState);
  const { groupId, isLoading } = useSelector(appState);

  // 選択中のGroup情報取得
  const groupInfo = groups.find((item) => item.id === groupId);

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
      id: groupId,
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
