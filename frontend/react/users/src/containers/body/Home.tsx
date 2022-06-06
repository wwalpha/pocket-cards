import React from 'react';
import { bindActionCreators } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Button from '@components/buttons/Button';
import { StudyActions } from '@actions';
import { RootState } from 'typings';

const appState = (state: RootState) => state.app;

const home = () => {
  const dispatch = useDispatch();
  const actions = bindActionCreators(StudyActions, dispatch);
  const { isLoading } = useSelector(appState);

  // 学習
  const handlePractice = () => actions.startPractice();
  // テスト
  const handleTest = () => actions.startTest();

  return (
    <Box p={2}>
      <Button isLoading={isLoading} variant="contained" color="secondary" onClick={handlePractice}>
        今日の学習
      </Button>
      <Button isLoading={isLoading} variant="contained" color="secondary" onClick={handleTest}>
        今日のテスト
      </Button>
    </Box>
  );
};

export default home;
