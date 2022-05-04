import React from 'react';
import { bindActionCreators } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'connected-react-router';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import Typography from '@mui/material/Typography';
import { useLocation } from 'react-router-dom';
import { Paths, Consts } from '@constants';
import { AppActions, GroupActions } from '@actions';
import { RootState } from 'typings';
import { UploadButton } from '@components/buttons';

const appState = (state: RootState) => state.app;

export default () => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const actions = bindActionCreators(AppActions, dispatch);
  const grpActions = bindActionCreators(GroupActions, dispatch);

  const { authority, isLoading } = useSelector(appState);

  const handleUserReigst = () => actions.showUserRegist();
  const handleLogout = () => actions.logout();
  const handleGroupAdd = () => grpActions.transitToGroupRegist();

  const handleAdminBack = () => {
    if (pathname === Paths.PATHS_QUESTION_LIST) {
      // go to top
      dispatch(push(Paths.PATHS_ROOT));
      // clear questions
      grpActions.clearQuestions();
    }
    if (pathname === Paths.PATHS_QUESTION_CONFIRM) {
      // go to top
      dispatch(push(Paths.PATHS_QUESTION_LIST));
      // clear questions
      grpActions.clearQuestions();
    }
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        boxShadow: 'none',
        height: ({ spacing }) => spacing(8),
        bgcolor: 'primary.main',
        userSelect: 'none',
        width: { sm: `calc(100% - 200px)` },
        ml: { sm: `200px` },
      }}>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Guardian Dashboard
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', flexGrow: 1 }}>
          {(() => {
            if (authority !== Consts.Authority.ADMIN) return;

            if (pathname === Paths.PATHS_ROOT) {
              return (
                <Button
                  variant="outlined"
                  color="inherit"
                  sx={{ mx: 1, borderRadius: 0, width: 96 }}
                  onClick={handleGroupAdd}>
                  ADD
                </Button>
              );
            }

            <Button
              variant="outlined"
              color="inherit"
              sx={{ mx: 1, borderRadius: 0, width: 96 }}
              onClick={handleAdminBack}>
              BACK
            </Button>;

            if (pathname === Paths.PATHS_QUESTION_LIST) {
              return (
                <UploadButton
                  loading={isLoading}
                  variant="outlined"
                  color="inherit"
                  sx={{ mx: 1, borderRadius: 0, width: 96 }}
                  readAsText={(texts: string) => {
                    grpActions.uploadConfirm(texts);
                  }}>
                  Upload
                </UploadButton>
              );
            }

            if (pathname === Paths.PATHS_QUESTION_CONFIRM) {
              return (
                <LoadingButton
                  loading={isLoading}
                  variant="outlined"
                  color="inherit"
                  sx={{ mx: 1, borderRadius: 0, width: 96 }}
                  onClick={() => {
                    grpActions.uploadQuestions();
                  }}>
                  REGIST
                </LoadingButton>
              );
            }

            return;
          })()}
          {(() => {
            if (pathname !== Paths.PATHS_STUDENTS) return;
            if (authority !== Consts.Authority.PARENT) return;

            return (
              <Button
                variant="outlined"
                color="inherit"
                sx={{ mx: 1, borderRadius: 0, width: 96 }}
                onClick={handleUserReigst}>
                ADD
              </Button>
            );
          })()}
          <Button variant="outlined" color="inherit" sx={{ mx: 1, borderRadius: 0, width: 96 }} onClick={handleLogout}>
            LOGOUT
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
function dispatch(arg0: any) {
  throw new Error('Function not implemented.');
}
