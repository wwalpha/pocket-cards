import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';
import Box from '@mui/material/Box';
import { QuestionTable } from '@components/questions';
import { GroupActions } from '@actions';
import { Consts } from '@constants';
import { QuestionForm, QuestionParams, RootState } from 'typings';
import { useParams } from 'react-router';

const groupState = (state: RootState) => state.group;
const appState = (state: RootState) => state.app;

export default () => {
  const { questions, groups } = useSelector(groupState);
  const { isLoading, authority } = useSelector(appState);
  const actions = bindActionCreators(GroupActions, useDispatch());
  const { groupId } = useParams<QuestionParams>();
  const subject = groups.find((item) => item.id === groupId)?.subject;

  const handleSubmit = (datas: QuestionForm) => {
    if (datas.id) {
      actions.questionUpdate({
        groupId: groupId,
        questionId: datas.id ?? '',
        title: datas.title,
        choices: datas.choices,
        answer: datas.answer,
        description: datas.description,
      });
    }
  };

  const handleTransfer = (oldGid: string, newGid: string, qid: string[]) => {
    qid.forEach((id) => {
      actions.questionTransfer({
        groupId: oldGid,
        questionId: id,
        newGroupId: newGid,
      });
    });
  };

  const handleDelete = (index: number) => {
    const q = questions[index];

    actions.questionDelete(groupId, q.id);
  };

  const handleIgnore = (index: number) => {
    const q = questions[index];

    actions.questionIgnore(groupId, q.id);
  };

  return (
    <Box sx={{ m: 0, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
      {/* {subject === Consts.SUBJECT.MATHS && (
        <MathQuestionTable
          datas={questions}
          subject={subject}
          groups={groups}
          loading={isLoading}
          onSubmit={authority === Consts.Authority.ADMIN ? handleSubmit : undefined}
          onTransfer={authority === Consts.Authority.ADMIN ? handleTransfer : undefined}
          onDelete={authority === Consts.Authority.ADMIN ? handleDelete : undefined}
          onIgnore={
            authority === Consts.Authority.ADMIN && subject === Consts.SUBJECT.ENGLISH ? handleIgnore : undefined
          }
        />
      )} */}
      <QuestionTable
        datas={questions}
        groups={groups}
        loading={isLoading}
        onSubmit={authority === Consts.Authority.ADMIN ? handleSubmit : undefined}
        onTransfer={authority === Consts.Authority.ADMIN ? handleTransfer : undefined}
        onDelete={authority === Consts.Authority.ADMIN ? handleDelete : undefined}
        onIgnore={authority === Consts.Authority.ADMIN && subject === Consts.SUBJECT.ENGLISH ? handleIgnore : undefined}
      />
    </Box>
  );
};
