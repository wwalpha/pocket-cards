import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import Box from '@mui/material/Box';
import { QuestionTable } from '@components/tables';
import { QuestionParams, RootState } from 'typings';

const groupState = (state: RootState) => state.group;

export default () => {
  const { uploads, groups } = useSelector(groupState);
  const { groupId } = useParams<QuestionParams>();
  const subject = groups.find((item) => item.id === groupId)?.subject;

  return (
    <Box sx={{ m: 2, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
      {/* {subject === Consts.SUBJECT.MATHS && <MathQuestionTable datas={uploads} subject={subject} />} */}
      {/* {subject !== Consts.SUBJECT.MATHS && <QuestionTable datas={uploads} />} */}
      <QuestionTable datas={uploads} />
    </Box>
  );
};
