import React from 'react';
import { bindActionCreators } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { AdminActions } from '@actions';
import { QuestionTable } from '@components/tables';
import { RootState } from 'typings';

const groupState = (state: RootState) => state.group;

export default () => {
  const history = useHistory();
  const actions = bindActionCreators(AdminActions, useDispatch());
  const { questions } = useSelector(groupState);

  const handleHistoryBack = () => {
    // back to prev screen
    history.goBack();
    // clear questions
    actions.clearQuestions();
  };

  return (
    <Box sx={{ m: 2, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
      <Box my={1} display="flex">
        <Button variant="contained" color="secondary" sx={{ width: 120, mr: 1 }} onClick={handleHistoryBack}>
          BACK
        </Button>
      </Box>
      <QuestionTable datas={questions} />
    </Box>
  );
};
