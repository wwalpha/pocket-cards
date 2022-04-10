import React from 'react';
import { bindActionCreators } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'connected-react-router';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { QuestionTable } from '@components/tables';
import { UploadButton } from '@components/buttons';
import { GroupActions, AdminActions } from '@actions';
import { Consts, Paths } from '@constants';
import { RootState } from 'typings';

const groupState = (state: RootState) => state.group;
const appState = (state: RootState) => state.app;
const userState = (state: RootState) => state.user;

export default () => {
  const dispatch = useDispatch();
  const actions = bindActionCreators(AdminActions, dispatch);
  const grpActions = bindActionCreators(GroupActions, dispatch);
  const { isLoading } = useSelector(appState);
  const { questions } = useSelector(groupState);
  const { authority } = useSelector(userState);

  const handleHistoryBack = () => {
    // go to top
    dispatch(push(Paths.PATHS_ADMIN_DASHBOARD));
    // clear questions
    grpActions.clearQuestions();
  };

  const handleReadAsText = (texts: string) => {
    actions.uploadQuestions(texts);
  };

  return (
    <Box sx={{ m: 2, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
      <Box my={1} display="flex">
        <Button
          variant="contained"
          color="secondary"
          size="small"
          sx={{ width: 120, mr: 1 }}
          onClick={handleHistoryBack}>
          BACK
        </Button>
        {authority === Consts.Authority.ADMIN && (
          <UploadButton
            loading={isLoading}
            variant="contained"
            sx={{ width: 120, mr: 1 }}
            readAsText={handleReadAsText}>
            Upload
          </UploadButton>
        )}
      </Box>
      <QuestionTable datas={questions} />
    </Box>
  );
};
