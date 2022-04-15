import React from 'react';
import { useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import { QuestionTable } from '@components/tables';
import { RootState } from 'typings';

const groupState = (state: RootState) => state.group;

export default () => {
  const { questions } = useSelector(groupState);

  return (
    <Box sx={{ m: 2, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
      <QuestionTable datas={questions} />
    </Box>
  );
};
