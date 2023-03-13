import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';
import Box from '@mui/material/Box';
import { QuestionTable } from '@components/questions';
import { GroupActions, UserActions } from '@actions';
import { QuestionForm, RootState } from 'typings';

const appState = (state: RootState) => state.app;
const userState = (state: RootState) => state.user;

export default () => {
  const { inquiries } = useSelector(userState);
  const { isLoading } = useSelector(appState);
  const actions = bindActionCreators(GroupActions, useDispatch());
  const usrActions = bindActionCreators(UserActions, useDispatch());

  const handleDelete = (index: number) => {
    const q = inquiries[index];

    usrActions.inquiryRemove(q.id);
  };

  const handleSubmit = (datas: QuestionForm) => {
    if (datas.id) {
      actions.questionUpdate({
        groupId: datas.groupId,
        questionId: datas.id ?? '',
        title: datas.title,
        choices: datas.choices,
        answer: datas.answer,
        description: datas.description,
        category: datas.category,
        tags: datas.tags,
        difficulty: datas.difficulty,
        qNo: datas.qNo,
      });

      usrActions.inquiryUpdate(datas);
    }
  };

  return (
    <Box sx={{ m: 2, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
      <QuestionTable datas={inquiries} loading={isLoading} onSubmit={handleSubmit} onDelete={handleDelete} />
    </Box>
  );
};
