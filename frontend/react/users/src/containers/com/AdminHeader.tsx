import React from 'react';
import { bindActionCreators } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useLocation } from 'react-router-dom';
import { Consts } from '@constants';
import { AppActions } from '@actions';
import { RootState } from 'typings';

const appState = (state: RootState) => state.app;

export default () => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const actions = bindActionCreators(AppActions, dispatch);
  const { authority, isLoading } = useSelector(appState);

  const handleUserReigst = () => actions.showUserRegist();
  const handleLogout = () => actions.logout();

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
