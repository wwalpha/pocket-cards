import React from 'react';
import { bindActionCreators } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'connected-react-router';
import Box from '@mui/material/Box';
import { QuestionTable } from '@components/tables';
import { GroupActions, AdminActions } from '@actions';
import { Paths } from '@constants';
import { RootState } from 'typings';

const groupState = (state: RootState) => state.group;
const appState = (state: RootState) => state.app;

export default () => {
  const dispatch = useDispatch();
  const actions = bindActionCreators(AdminActions, dispatch);
  const grpActions = bindActionCreators(GroupActions, dispatch);
  const { uploads } = useSelector(groupState);

  return (
    <Box sx={{ m: 2, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
      <QuestionTable datas={uploads} />
    </Box>
  );
};
