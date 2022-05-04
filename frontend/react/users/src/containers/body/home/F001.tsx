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
  const handleNew = () => {
    // clean active group
    grpActions.cleanGroup();
    // start study
    actions.startTodos(Consts.MODES.New);
  };
  // 復習
  const handleReview = () => {
    // clean active group
    grpActions.cleanGroup();
    // start study
    actions.startTodos(Consts.MODES.Review);
  };
  // テスト
  const handleTest = () => {
    // clean active group
    grpActions.cleanGroup();
    // start study
    actions.startTodos(Consts.MODES.AllTest);
  };

  return (
    <Box p={2}>
      <Button variant="contained" color="secondary" onClick={handleTest}>
        今日のテスト
      </Button>
      <Button variant="contained" color="secondary" onClick={handleNew}>
        今日の再学習
      </Button>
      <Button variant="contained" color="secondary" onClick={handleReview}>
        今日の復習
      </Button>
    </Box>
  );
};
