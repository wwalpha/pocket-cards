import React, { useState } from 'react';
import { bindActionCreators } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import WebSocket from 'isomorphic-ws';
import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Paper from '@mui/material/Paper';
import LoadingButton from '@mui/lab/LoadingButton';
import { StudyActions } from '@actions';
import { Consts, URLs } from '@constants';
import { MultiTestForm, RootState } from 'typings';

const studyState = (state: RootState) => state.study;
const userState = (state: RootState) => state.user;
const appState = (state: RootState) => state.app;

let ws: WebSocket;

export default () => {
  const actions = bindActionCreators(StudyActions, useDispatch());
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

  const onSubmit = handleSubmit(async ({ userId, subject }) => {
    actions.curriculumOrder(userId, subject);

    URLs.WSS_URL().then((url) => {
      ws = new WebSocket(url);
    });
  });

  return (
    <form onSubmit={onSubmit}>
      {(() => {
        if (questions.length === 0) {
          return (
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
          );
        }

        return (
          <Box display="flex" sx={{ py: 2 }}>
            <Paper elevation={3}>{questions[index].title}</Paper>
            <Paper elevation={3}>{questions[index].answer}</Paper>
          </Box>
        );
      })()}
    </form>
  );
};
