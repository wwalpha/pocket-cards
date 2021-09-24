import React from 'react';
import { useSelector } from 'react-redux';
import { Box } from '@mui/material';
import { RootState } from 'typings';

const grpState = (state: RootState) => state.group;

export default () => {
  const { activeGroup, current } = useSelector(grpState);

  return (
    <Box m={2}>
      <Box mt={2}>合計単語数: {}</Box>
      <Box mt={2}>学習済み単語数: {}</Box>
      <Box mt={2}>未学習単語数: {}</Box>
      <Box mt={2}>復習単語数: {}</Box>
    </Box>
  );
};
