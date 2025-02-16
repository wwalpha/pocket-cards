import React from 'react';
import { bindActionCreators } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import { Consts } from '@constants';
import { GroupActions } from '@actions';
import { RootState, GroupEditForm, GroupDetailsParams } from 'typings';

const groupState = (state: RootState) => state.group;
const appState = (state: RootState) => state.app;

export default () => {
  const actions = bindActionCreators(GroupActions, useDispatch());
  const { groups, editable } = useSelector(groupState);
  const { isLoading } = useSelector(appState);
  const history = useHistory();
  const { groupId, subject } = useParams<GroupDetailsParams>();

  // 選択中のGroup情報取得
  const groupInfo = groups.find((item) => item.id === groupId);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<GroupEditForm>({
    defaultValues: {
      id: groupInfo?.id,
      name: groupInfo?.name || '',
      description: groupInfo?.description || '',
      subject: subject,
      grade: groupInfo?.grade || Consts.GRADE.GRADE_6,
    },
  });

  // 編集
  const onSubmit = handleSubmit((datas) => {
    if (editable === Consts.EDIT_MODE.EDIT) {
      actions.edit({
        id: groupId ?? '',
        name: datas.name,
        description: datas.description,
        subject: subject,
        grade: datas.grade,
      });
    } else if (editable === Consts.EDIT_MODE.REGIST) {
      actions.regist({
        name: datas.name,
        description: datas.description,
        subject: datas.subject,
        grade: datas.grade,
      });
    }
  });

  const handleBack = () => history.goBack();

  return (
    <form onSubmit={onSubmit}>
      <Box margin={2}>
        {editable !== Consts.EDIT_MODE.REGIST && (
          <Controller
            name="id"
            control={control}
            render={({ field: { value } }) => (
              <TextField disabled={true} variant="outlined" margin="normal" fullWidth label="Group ID" value={value} />
            )}
          />
        )}
        <Controller
          name="name"
          control={control}
          rules={{ required: 'required' }}
          render={({ field: { onChange, value } }) => (
            <TextField
              disabled={editable === Consts.EDIT_MODE.READONLY}
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
              disabled={editable === Consts.EDIT_MODE.READONLY}
              variant="outlined"
              margin="normal"
              fullWidth
              label="Group Description"
              value={value}
              onChange={onChange}
            />
          )}
        />
        <Controller
          name="subject"
          control={control}
          rules={{ required: 'required' }}
          render={({ field: { onChange, value } }) => (
            <Select
              disabled={!(editable === Consts.EDIT_MODE.REGIST)}
              onChange={onChange}
              value={value}
              fullWidth
              sx={{ mt: 2 }}
            >
              <MenuItem value={Consts.SUBJECT.JAPANESE}>国 語</MenuItem>
              <MenuItem value={Consts.SUBJECT.SCIENCE}>理 科</MenuItem>
              <MenuItem value={Consts.SUBJECT.SOCIETY}>社 会</MenuItem>
              <MenuItem value={Consts.SUBJECT.ENGLISH}>英 語</MenuItem>
              <MenuItem value={Consts.SUBJECT.HANDWRITING}>漢 字</MenuItem>
            </Select>
          )}
        />
        <Controller
          name="grade"
          control={control}
          rules={{ required: 'required' }}
          render={({ field: { onChange, value } }) => (
            <Select
              disabled={!(editable === Consts.EDIT_MODE.REGIST)}
              onChange={onChange}
              value={value}
              fullWidth
              sx={{ mt: 2 }}
            >
              <MenuItem value={Consts.GRADE.GRADE_4}>４年生</MenuItem>
              <MenuItem value={Consts.GRADE.GRADE_5}>５年生</MenuItem>
              <MenuItem value={Consts.GRADE.GRADE_6}>６年生</MenuItem>
            </Select>
          )}
        />

        <Box mt={2} display="flex" flexDirection="row-reverse">
          {(() => {
            if (editable === Consts.EDIT_MODE.READONLY) return;

            return (
              <LoadingButton
                size="large"
                variant="contained"
                color="primary"
                type="submit"
                loading={isLoading}
                sx={{ mx: 1, width: 120 }}
              >
                {editable === Consts.EDIT_MODE.REGIST ? 'REGIST' : 'EDIT'}
              </LoadingButton>
            );
          })()}

          <Button size="large" variant="contained" color="secondary" sx={{ mx: 1, width: 120 }} onClick={handleBack}>
            BACK
          </Button>
        </Box>
      </Box>
    </form>
  );
};
