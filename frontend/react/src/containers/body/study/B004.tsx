import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { Box } from '@mui/material';
import { RootState } from 'typings';

const appState = (state: RootState) => state.app;
const grpState = (state: RootState) => state.group;

export default () => {
  const { isLoading } = useSelector(appState);
  const { status } = useSelector(grpState);

  return (
    <Box m={2}>
      {(() => {
        if (isLoading) return <div></div>;

        return (
          <Fragment>
            <Box mt={2}>合計単語数: {status?.count}</Box>
            <Box mt={2}>学習済み単語数: {status?.learned}</Box>
            <Box mt={2}>未学習単語数: {status?.unlearned}</Box>
            <Box mt={2}>復習単語数: {status?.review}</Box>
          </Fragment>
        );
      })()}
    </Box>
  );
};
