import React from 'react';
import { bindActionCreators } from 'redux';
import { useSelector, useDispatch } from 'react-redux';
import { Box } from '@mui/material';
import Button from '@components/buttons/Button';
import { GroupActions } from '@actions';
import { RootState } from 'typings';

const group = (state: RootState) => state.group;

export default () => {
  const dispatch = useDispatch();
  const actions = bindActionCreators(GroupActions, dispatch);
  const { groups } = useSelector(group);

  return (
    <Box>
      <Button variant="contained" color="secondary">
        今日のテスト
      </Button>
      <Button variant="contained" color="secondary">
        今日の再学習
      </Button>
      <Button variant="contained" color="secondary">
        今日の復習
      </Button>
    </Box>
  );
};
