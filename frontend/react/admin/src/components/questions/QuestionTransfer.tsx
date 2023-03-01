import React, { FunctionComponent } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Group, QuestionTransferForm, Tables } from 'typings';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

const details: FunctionComponent<QuestionTransfer> = ({ dataRow, groups, onClick, onClose }) => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<QuestionTransferForm>({
    defaultValues: {
      id: dataRow.id,
      groupId: dataRow.groupId,
      groupName: groups?.find((item) => item.id === dataRow.groupId)?.name || '',
      title: dataRow.title,
      newGroupId: '',
    },
  });
  // 編集
  const onSubmit = handleSubmit((datas) => {
    onClick?.(datas);
  });

  return (
    <form onSubmit={onSubmit}>
      <input {...register('groupId')} hidden />
      <Box margin={2} sx={{ width: '640px' }}>
        <Controller
          name="id"
          control={control}
          render={({ field: { value } }) => (
            <TextField disabled={true} variant="outlined" margin="normal" fullWidth label="ID" value={value} />
          )}
        />
        <Controller
          name="title"
          control={control}
          rules={{ required: 'required' }}
          render={({ field: { onChange, value } }) => (
            <TextField
              disabled={!onClick}
              variant="outlined"
              margin="normal"
              fullWidth
              label="Title"
              value={value}
              onChange={onChange}
            />
          )}
        />

        <Controller
          name="groupName"
          control={control}
          render={({ field: { onChange, value } }) => (
            <TextField variant="outlined" margin="normal" fullWidth label="Group" value={value} onChange={onChange} />
          )}
        />

        <Controller
          name="newGroupId"
          control={control}
          rules={{ required: 'required' }}
          render={({ field: { onChange, value } }) => (
            <FormControl fullWidth sx={{ my: 1 }}>
              <InputLabel>NewGroup *</InputLabel>
              <Select label="Group *" onChange={onChange} value={value} fullWidth>
                {groups
                  ?.filter((item) => item.subject === dataRow.subject)
                  .map((item) => (
                    <MenuItem key={item.id} value={item.id} sx={{ py: 0 }}>
                      <ListItemText primary={item.name} />
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          )}
        />
      </Box>
      <Box mt={4} display="flex" justifyContent="flex-end">
        <Button
          key="closeBtn"
          size="large"
          variant="contained"
          color="secondary"
          sx={{ mx: 1, width: 120 }}
          onClick={onClose}
        >
          CLOSE
        </Button>
        {onClick && (
          <LoadingButton
            key="loadingBtn"
            size="large"
            variant="contained"
            color="primary"
            type="submit"
            sx={{ mx: 1, width: 120 }}
          >
            SUBMIT
          </LoadingButton>
        )}
      </Box>
    </form>
  );
};

interface QuestionTransfer {
  dataRow: Group.Question;
  groups?: Tables.TGroups[];
  onClick?: (form: QuestionTransferForm) => void;
  onClose?: () => void;
}

export default details;
