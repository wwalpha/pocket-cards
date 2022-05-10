import React, { FunctionComponent } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Group, QuestionForm } from 'typings';
import Button from '@mui/material/Button';
import { LoadingButton } from '@mui/lab';

const styles = {
  container: {
    width: 'calc(100vw - 232px)',
  },
  tableCell: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: 'inline-block',
    width: 95 / 100,
  },
};

const details: FunctionComponent<QuestionDetails> = ({ dataRow, loading, onClick, onClose }) => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<QuestionForm>({
    defaultValues: {
      id: dataRow.id,
      title: dataRow.title || '',
      answer: dataRow.answer || '',
      choices: dataRow.choices?.join('|'),
    },
  });

  // 編集
  const onSubmit = handleSubmit((datas) => onClick?.(datas));

  return (
    <form onSubmit={onSubmit}>
      <Box margin={2}>
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
          name="choices"
          control={control}
          render={({ field: { onChange, value } }) => (
            <TextField
              disabled={!onClick}
              variant="outlined"
              margin="normal"
              fullWidth
              label="Choices"
              value={value}
              onChange={onChange}
            />
          )}
        />
        <Controller
          name="answer"
          control={control}
          render={({ field: { onChange, value } }) => (
            <TextField
              disabled={!onClick}
              variant="outlined"
              margin="normal"
              fullWidth
              label="Answer"
              value={value}
              onChange={onChange}
            />
          )}
        />
      </Box>
      <Box mt={4} display="flex" justifyContent="flex-end">
        <Button size="large" variant="contained" color="secondary" sx={{ mx: 1, width: 120 }} onClick={onClose}>
          CLOSE
        </Button>
        {onClick && (
          <LoadingButton
            size="large"
            variant="contained"
            color="primary"
            type="submit"
            loading={loading}
            sx={{ mx: 1, width: 120 }}>
            SUBMIT
          </LoadingButton>
        )}
      </Box>
    </form>
  );
};

interface QuestionDetails {
  readonly?: boolean;
  loading?: boolean;
  dataRow: Partial<Group.Question>;
  onClick?: (form: QuestionForm) => void;
  onClose?: () => void;
}

export default details;
