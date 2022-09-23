import React, { useState } from 'react';
import { bindActionCreators } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Paper from '@mui/material/Paper';
import LoadingButton from '@mui/lab/LoadingButton';
import { StudyActions } from '@actions';
import { Consts } from '@constants';
import { MultiTestForm, RootState } from 'typings';

const studyState = (state: RootState) => state.study;
const userState = (state: RootState) => state.user;
const appState = (state: RootState) => state.app;

export default () => {
  const actions = bindActionCreators(StudyActions, useDispatch());
  const [incorrect, setIncorrect] = React.useState(false);
  const [isSearched, setSearched] = React.useState(false);
  const { questions, index } = useSelector(studyState);
  const { students } = useSelector(userState);
  const { isLoading } = useSelector(appState);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<MultiTestForm>({
    defaultValues: {
      subject: '',
      userId: '',
    },
  });

  const onFailure = () => {
    actions.failure();
    // set status
    setIncorrect(true);
  };

  const onCorrect = () => {
    actions.correct();
    // set status
    setIncorrect(false);
  };

  const onNext = () => {
    actions.goNext();
    // set status
    setIncorrect(false);
  };

  const onSubmit = handleSubmit(async ({ userId, subject }) => {
    setSearched(true);
    actions.dailyTest(userId, subject);
  });

  return (
    <form onSubmit={onSubmit}>
      {!isSearched && (
        <Box display="flex" sx={{ py: 2 }}>
          <Controller
            name="userId"
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <FormControl sx={{ mx: 2, width: '35%' }} fullWidth>
                <InputLabel>学生 *</InputLabel>
                <Select label="Student *" value={value} onChange={onChange} disabled={students.length === 0}>
                  {students.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.username}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
          <Controller
            name="subject"
            control={control}
            rules={{ required: 'required' }}
            render={({ field: { onChange, value } }) => (
              <FormControl sx={{ mx: 2, width: '35%' }} fullWidth>
                <InputLabel>科目 *</InputLabel>
                <Select label="Subject *" onChange={onChange} value={value} fullWidth>
                  <MenuItem value={Consts.SUBJECT.SCIENCE}>理 科</MenuItem>
                  <MenuItem value={Consts.SUBJECT.SOCIETY}>社 会</MenuItem>
                </Select>
              </FormControl>
            )}
          />
          <LoadingButton
            type="submit"
            sx={{ width: '120px', mx: 2 }}
            loading={isLoading}
            variant="contained"
            color="primary">
            接続
          </LoadingButton>
        </Box>
      )}
      {isSearched && questions.length === 0 && (
        <Box display="flex" justifyContent="center">
          データありません
        </Box>
      )}
      {isSearched && questions.length !== 0 && (
        <Box display="flex" flexDirection="column" sx={{ m: 2 }}>
          <Paper elevation={3} sx={{ my: 1, p: 4 }}>
            {questions[index].title.replace(/\[.*\]/g, '')}
            {(() => {
              const title = questions[index].title;
              // 画像がない
              if (!title.match(/\[.*\]/g)) return;

              const startIdx = title.indexOf('[');
              const endIdx = title.indexOf(']', startIdx);
              const url = title.substring(startIdx + 1, endIdx);

              return <img src={`${Consts.DOMAIN_HOST}\\${url}`} width="300" height="300" />;
            })()}
          </Paper>
          <Paper elevation={3} sx={{ my: 1, p: 4 }}>
            {questions[index].answer.replace(/\[.*\]/g, '')}
            {(() => {
              const answer = questions[index].answer;
              // 画像がない
              if (!answer.match(/\[.*\]/g)) return;

              const startIdx = answer.indexOf('[');
              const endIdx = answer.indexOf(']', startIdx);
              const url = answer.substring(startIdx + 1, endIdx);

              return <img src={`${Consts.DOMAIN_HOST}\\${url}`} width="300" height="300" />;
            })()}
          </Paper>

          <Box display="flex" justifyContent="flex-end" sx={{ py: 2 }}>
            <LoadingButton
              sx={{ width: '120px', mx: 2 }}
              loading={isLoading}
              variant="contained"
              color="primary"
              onClick={onNext}>
              次へ
            </LoadingButton>
            <LoadingButton
              sx={{ width: '120px', mx: 2 }}
              loading={isLoading}
              variant="contained"
              color="primary"
              onClick={onFailure}>
              不正解
            </LoadingButton>
            <LoadingButton
              sx={{ width: '120px', mx: 2 }}
              loading={isLoading}
              variant="contained"
              color="secondary"
              onClick={onCorrect}
              disabled={incorrect}>
              正解
            </LoadingButton>
          </Box>
        </Box>
      )}
    </form>
  );
};
