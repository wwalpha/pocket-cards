import React from 'react';
import { bindActionCreators } from 'redux';
import { useDispatch } from 'react-redux';
import Box from '@mui/material/Box';
import Button from '@components/buttons/Button';
import { StudyActions, GroupActions } from '@actions';
import { Consts } from '@constants';

export default () => {
  const dispatch = useDispatch();
  const actions = bindActionCreators(StudyActions, dispatch);
  const grpActions = bindActionCreators(GroupActions, dispatch);

  // 学習
  const handlePractice = () => {
    // start study
    actions.startTodos(Consts.MODES.Practice);
  };
  // テスト
  const handleTest = () => {
    // start study
    actions.startTodos(Consts.MODES.Test);
  };

  return (
    <Box p={2}>
      <Button variant="contained" color="secondary" onClick={handleTest}>
        今日のテスト
      </Button>
      <Button variant="contained" color="secondary" onClick={handlePractice}>
        今日の再学習
      </Button>
    </Box>
  );
};
