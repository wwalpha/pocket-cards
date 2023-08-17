import React, { FunctionComponent } from 'react';
import { bindActionCreators } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import { useRouteMatch, useLocation, useParams, useHistory } from 'react-router-dom';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { UploadButton } from '@components/buttons';
import { ROUTE_PATHS, Consts } from '@constants';
import { AppActions, GroupActions } from '@actions';
import { HeaderParams, RootState } from 'typings';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { styled } from '@mui/material/styles';

const appState = (state: RootState) => state.app;
const groupState = (state: RootState) => state.group;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}
const drawerWidth = 200;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const header: FunctionComponent<HeaderProps> = ({ open, handleDrawerOpen }) => {
  const dispatch = useDispatch();
  const actions = bindActionCreators(AppActions, dispatch);
  const grpActions = bindActionCreators(GroupActions, dispatch);

  const { authority, isLoading, isConnectionEstablished, subject } = useSelector(appState);
  const { editable } = useSelector(groupState);
  const { pathname } = useLocation();

  // console.log(useLocation());
  // console.log(useRouteMatch());
  // console.log(useParams());
  // console.log(useHistory());

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

  const handleWssDisconnect = () => actions.disconnect();

  let groupId = '';
  // console.log(pathname);
  // console.log(pathname.match(/\/*\/groups\/([0-9a-zA-Z]{22})\/*/));
  // console.log(pathname.split(/\/*\/groups\/([0-9a-zA-Z]{22})\/*/)[1]);

  if (pathname.match(/\/*\/groups\/([0-9a-zA-Z]{22})\/*/)) {
    groupId = pathname.split(/\/*\/groups\/([0-9a-zA-Z]{22})\/*/)[1];
  }

  return (
    <AppBar position="fixed" open={open}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          edge="start"
          sx={{ mr: 2, ...(open && { display: 'none' }) }}
        >
          <MenuIcon />
        </IconButton>
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
          })()}
          <Button variant="outlined" color="inherit" sx={{ mx: 1, borderRadius: 0, width: 96 }} onClick={handleLogout}>
            LOGOUT
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

interface HeaderProps {
  open?: boolean;
  handleDrawerOpen?: () => void;
}

export default header;
