import React from 'react';
import { bindActionCreators } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { AdminActions } from '@actions';
import { UploadButton } from '@components/buttons';
import { QuestionTable } from '@components/tables';
import { RootState } from 'typings';
import { StyledTableCell } from './Mainboard.style';

const groupState = (state: RootState) => state.group;
const appState = (state: RootState) => state.app;

export default () => {
  const history = useHistory();
  const actions = bindActionCreators(AdminActions, useDispatch());
  const { questions } = useSelector(groupState);
  const { isLoading } = useSelector(appState);

  const handleHistoryBack = () => {
    // back to prev screen
    history.goBack();
    // clear questions
    actions.clearQuestions();
  };

  const handleReadAsText = (texts: string) => {
    actions.uploadQuestions(texts);
  };

  return (
    <Box sx={{ m: 2, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
      <Box my={1} display="flex">
        <Button variant="contained" color="secondary" sx={{ width: 120, mr: 1 }} onClick={handleHistoryBack}>
          BACK
        </Button>
        <UploadButton loading={isLoading} variant="contained" sx={{ width: 120, mr: 1 }} readAsText={handleReadAsText}>
          Upload
        </UploadButton>
      </Box>
      <QuestionTable datas={questions} />
    </Box>
  );
};
