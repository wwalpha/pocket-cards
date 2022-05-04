import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';
import Box from '@mui/material/Box';
import { GroupActions } from '@actions';
import { QuestionTable } from '@components/questions';
import { QuestionForm, RootState } from 'typings';
import { Consts } from '@constants';

const groupState = (state: RootState) => state.group;
const appState = (state: RootState) => state.app;

export default () => {
  const { questions } = useSelector(groupState);
  const { isLoading, authority } = useSelector(appState);
  const actions = bindActionCreators(GroupActions, useDispatch());

  const handleSubmit = (datas: QuestionForm) => {
    if (datas.id) {
      actions.questionUpdate(datas.id, {
        title: datas.title,
        answer: datas.answer,
      });
    }
  };

  return (
    <Box sx={{ m: 2, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
      <QuestionTable
        datas={questions}
        loading={isLoading}
        onSubmit={authority === Consts.Authority.ADMIN ? handleSubmit : undefined}
      />
    </Box>
  );
};
