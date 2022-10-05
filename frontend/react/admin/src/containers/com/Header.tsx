import React from 'react';
import { bindActionCreators } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import { push } from 'connected-react-router';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { UploadButton } from '@components/buttons';
import { ROUTE_PATHS, Consts } from '@constants';
import { AppActions, GroupActions } from '@actions';
import { HeaderParams, RootState } from 'typings';

const appState = (state: RootState) => state.app;
const groupState = (state: RootState) => state.group;

export default () => {
  const dispatch = useDispatch();
  const actions = bindActionCreators(AppActions, dispatch);
  const grpActions = bindActionCreators(GroupActions, dispatch);

  const { authority, isLoading, isConnectionEstablished } = useSelector(appState);
  const { editable } = useSelector(groupState);

  const {
    url: pathname,
    params: { subject, groupId },
  } = useRouteMatch<HeaderParams>();

  const handleUserReigst = () => actions.showUserRegist();
  const handleLogout = () => actions.logout();
  const handleGroupAdd = () => grpActions.transitToGroupRegist(subject);
  const handleGroupEdit = () => {
    if (editable === Consts.EDIT_MODE.EDIT) {
      grpActions.editable(Consts.EDIT_MODE.REGIST);
    } else {
      grpActions.editable(Consts.EDIT_MODE.EDIT);
    }
  };

  const handleAbilityRegist = () => dispatch(push(ROUTE_PATHS.ABILITIES_REGIST));

  const handleWssDisconnect = () => actions.disconnect();

  // const handleAdminBack = () => {
  //   if (pathname === ROUTE_PATHS.QUESTION_LIST) {
  //     // go to top
  //     dispatch(push(ROUTE_PATHS.ROOT));
  //     // clear questions
  //     grpActions.clearQuestions();
  //   }
  //   if (pathname === ROUTE_PATHS.QUESTION_CONFIRM) {
  //     // go to top
  //     dispatch(push(ROUTE_PATHS.QUESTION_LIST));
  //     // clear questions
  //     grpActions.clearQuestions();
  //   }
  // };

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
      }}
    >
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Guardian Dashboard
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', flexGrow: 1 }}>
          {(() => {
            if (authority !== Consts.Authority.ADMIN) return;

            if (pathname.match(/\/*\/groups$/)) {
              return (
                <Button
                  variant="outlined"
                  color="inherit"
                  sx={{ mx: 1, borderRadius: 0, width: 96 }}
                  onClick={handleGroupAdd}
                >
                  ADD
                </Button>
              );
            }

            if (pathname.match(/\/*\/groups\/[0-9a-zA-Z]{22}\/questions$/)) {
              return (
                <UploadButton
                  loading={isLoading}
                  variant="outlined"
                  color="inherit"
                  sx={{ mx: 1, borderRadius: 0, width: 96 }}
                  readAsText={(texts: string) => {
                    grpActions.uploadConfirm(subject, groupId, texts);
                  }}
                >
                  Upload
                </UploadButton>
              );
            }

            if (pathname.match(/\/*\/groups\/[0-9a-zA-Z]{22}\/confirm$/)) {
              return (
                <LoadingButton
                  loading={isLoading}
                  variant="outlined"
                  color="inherit"
                  sx={{ mx: 1, borderRadius: 0, width: 96 }}
                  onClick={() => {
                    grpActions.uploadQuestions(subject, groupId);
                  }}
                >
                  REGIST
                </LoadingButton>
              );
            }

            return;
          })()}
          {(() => {
            if (authority !== Consts.Authority.PARENT) return;

            if (pathname === ROUTE_PATHS.MULTI_TEST && isConnectionEstablished === true) {
              return (
                <Button
                  variant="outlined"
                  color="inherit"
                  sx={{ mx: 1, borderRadius: 0, width: 120 }}
                  onClick={handleWssDisconnect}
                >
                  DISCONNECT
                </Button>
              );
            }

            if (pathname === ROUTE_PATHS.STUDENTS) {
              return (
                <Button
                  variant="outlined"
                  color="inherit"
                  sx={{ mx: 1, borderRadius: 0, width: 96 }}
                  onClick={handleUserReigst}
                >
                  ADD
                </Button>
              );
            }

            if (pathname === ROUTE_PATHS.ABILITIES) {
              return (
                <React.Fragment>
                  <Button
                    variant="outlined"
                    color="inherit"
                    sx={{ mx: 1, borderRadius: 0, width: 96 }}
                    onClick={handleGroupEdit}
                  >
                    {editable === Consts.EDIT_MODE.EDIT ? 'CANCEL' : 'EDIT'}
                  </Button>
                  {editable !== Consts.EDIT_MODE.EDIT && (
                    <Button
                      variant="outlined"
                      color="inherit"
                      sx={{ mx: 1, borderRadius: 0, width: 96 }}
                      onClick={handleAbilityRegist}
                    >
                      ADD
                    </Button>
                  )}
                </React.Fragment>
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
