import React from 'react';
import { bindActionCreators } from 'redux';
import { useDispatch } from 'react-redux';
import { Box } from '@mui/material';
import Button from '@components/buttons/Button';
import { StudyActions } from '@actions';
import { Consts } from '@constants';

export default () => {
  const dispatch = useDispatch();
  const actions = bindActionCreators(StudyActions, dispatch);

  // 学習
  const handleNew = () => actions.startTodos(Consts.MODES.New);
  // 復習
  const handleReview = () => actions.startStudy(Consts.MODES.Review);
  // テスト
  const handleTest = () => actions.startStudy(Consts.MODES.AllTest);

  return (
    <Box>
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
