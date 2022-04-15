import React from 'react';
import { bindActionCreators } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import { QuestionTable } from '@components/tables';
import { GroupActions, AdminActions } from '@actions';
import { RootState } from 'typings';

const groupState = (state: RootState) => state.group;

export default () => {
  const dispatch = useDispatch();
  const { uploads } = useSelector(groupState);

  return (
    <Box sx={{ m: 2, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
      <QuestionTable datas={uploads} />
    </Box>
  );
};
