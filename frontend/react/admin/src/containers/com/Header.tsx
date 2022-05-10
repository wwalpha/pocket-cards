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
import { ROUTE_PATHS, Consts } from '@constants';
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
  const handleAbilityRegist = () => {
    // go to top
    dispatch(push(ROUTE_PATHS.ABILITIES_REGIST));
  };

  const handleAdminBack = () => {
    if (pathname === ROUTE_PATHS.QUESTION_LIST) {
      // go to top
      dispatch(push(ROUTE_PATHS.ROOT));
      // clear questions
      grpActions.clearQuestions();
    }
    if (pathname === ROUTE_PATHS.QUESTION_CONFIRM) {
      // go to top
      dispatch(push(ROUTE_PATHS.QUESTION_LIST));
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

            if (
              [
                ROUTE_PATHS.ROOT,
                ROUTE_PATHS.ROOT_ENGLISH,
                ROUTE_PATHS.ROOT_LANGUAGE,
                ROUTE_PATHS.ROOT_SCIENCE,
                ROUTE_PATHS.ROOT_SOCIETY,
              ].includes(pathname)
            ) {
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

            if (pathname === ROUTE_PATHS.QUESTION_LIST) {
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

            if (pathname === ROUTE_PATHS.QUESTION_CONFIRM) {
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
            if (authority !== Consts.Authority.PARENT) return;

            if (pathname === ROUTE_PATHS.STUDENTS) {
              return (
                <Button
                  variant="outlined"
                  color="inherit"
                  sx={{ mx: 1, borderRadius: 0, width: 96 }}
                  onClick={handleUserReigst}>
                  ADD
                </Button>
              );
            }

            if (pathname === ROUTE_PATHS.ABILITIES) {
              return (
                <Button
                  variant="outlined"
                  color="inherit"
                  sx={{ mx: 1, borderRadius: 0, width: 96 }}
                  onClick={handleAbilityRegist}>
                  ADD
                </Button>
              );
            }
          })()}
          <Button variant="outlined" color="inherit" sx={{ mx: 1, borderRadius: 0, width: 96 }} onClick={handleLogout}>
            LOGOUT
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
