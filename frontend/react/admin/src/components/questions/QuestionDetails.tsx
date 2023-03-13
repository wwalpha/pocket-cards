import React, { createRef, FunctionComponent } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Group, QuestionForm } from 'typings';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { IconButton } from '@mui/material';
import { Consts } from '@constants';

const titleRef = createRef<HTMLAudioElement>();
const answerRef = createRef<HTMLAudioElement>();

const details: FunctionComponent<QuestionDetails> = ({ dataRow, subject, loading, onClick, onClose }) => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<QuestionForm>({
    defaultValues: {
      id: dataRow.id,
      title: dataRow.title ?? '',
      answer: dataRow.answer ?? '',
      choices: dataRow.choices?.join('|'),
      description: dataRow.description ?? '',
      original: dataRow.original,
      groupId: dataRow.groupId,
      category: dataRow.category ?? '',
      tags: dataRow.tags ? dataRow.tags[0] : '',
      difficulty: dataRow.difficulty ?? '',
      qNo: dataRow.qNo ?? '',
    },
  });

  const size = subject === Consts.SUBJECT.MATHS ? 'small' : 'medium';

  // 編集
  const onSubmit = handleSubmit((datas) => onClick?.(datas));

  const handlePlayQuestion = () => {
    if (!window.location.hostname.startsWith('localhost')) {
      titleRef.current?.play();
    }
  };

  const handlePlayAnswer = () => {
    if (!window.location.hostname.startsWith('localhost')) {
      answerRef.current?.play();
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <input {...register('groupId')} hidden />
      <Box margin={2} sx={{ width: '640px' }}>
        <Controller
          name="id"
          control={control}
          render={({ field: { value } }) => (
            <TextField
              disabled={true}
              variant="outlined"
              margin="normal"
              fullWidth
              label="ID"
              value={value}
              size={size}
            />
          )}
        />
        <Box sx={{ display: 'flex' }}>
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
                size={size}
              />
            )}
          />
          {dataRow.voiceAnswer && [
            <IconButton key="questionPlayBtn" sx={{ mx: 1 }} color="secondary" onClick={handlePlayQuestion}>
              <VolumeUpIcon />
            </IconButton>,
            <audio
              key="questionAudio"
              ref={titleRef}
              src={`/${Consts.PATH_VOICE}/${dataRow.groupId}/${dataRow.voiceTitle}`}
            />,
          ]}
        </Box>
        {dataRow.original && (
          <Controller
            name="original"
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextField
                disabled={!onClick}
                variant="outlined"
                margin="normal"
                fullWidth
                label="Original"
                value={value}
                onChange={onChange}
              />
            )}
          />
        )}

        <Controller
          name="description"
          control={control}
          render={({ field: { onChange, value } }) => (
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label="Description"
              value={value}
              onChange={onChange}
              size={size}
            />
          )}
        />

        {subject === Consts.SUBJECT.MATHS && (
          <Controller
            name="category"
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextField
                disabled={!onClick}
                variant="outlined"
                margin="normal"
                fullWidth
                label="Category"
                value={value}
                onChange={onChange}
                size={size}
              />
            )}
          />
        )}

        {subject === Consts.SUBJECT.MATHS && (
          <Controller
            name="tags"
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextField
                disabled={!onClick}
                variant="outlined"
                margin="normal"
                fullWidth
                label="Tags"
                value={value}
                onChange={onChange}
                size={size}
              />
            )}
          />
        )}

        {subject === Consts.SUBJECT.MATHS && (
          <Controller
            name="difficulty"
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextField
                disabled={!onClick}
                variant="outlined"
                margin="normal"
                fullWidth
                label="Difficulty"
                value={value}
                onChange={onChange}
                size={size}
              />
            )}
          />
        )}

        {subject === Consts.SUBJECT.MATHS && (
          <Controller
            name="qNo"
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextField
                disabled={!onClick}
                variant="outlined"
                margin="normal"
                fullWidth
                label="QuestionNo"
                value={value}
                onChange={onChange}
                size={size}
              />
            )}
          />
        )}

        {dataRow.choices && (
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
                size={size}
              />
            )}
          />
        )}

        <Box sx={{ display: 'flex' }}>
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
                size={size}
              />
            )}
          />
          {dataRow.voiceAnswer && [
            <IconButton key="answerPlayBtn" sx={{ mx: 1 }} color="secondary" onClick={handlePlayAnswer}>
              <VolumeUpIcon />
            </IconButton>,
            <audio
              key="answerAudio"
              ref={answerRef}
              src={`/${Consts.PATH_VOICE}/${dataRow.groupId}/${dataRow.voiceAnswer}`}
            />,
          ]}
        </Box>
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
            loading={loading}
            sx={{ mx: 1, width: 120 }}
          >
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
  dataRow: Group.Question;
  subject?: string;
  onClick?: (form: QuestionForm) => void;
  onClose?: () => void;
}

export default details;
