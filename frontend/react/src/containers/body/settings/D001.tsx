import React, { Fragment, useState } from 'react';
import { bindActionCreators } from 'redux';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  ListItemSecondaryAction,
} from '@mui/material';
import { green, red } from '@mui/material/colors';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import { Button, IOSSwitch } from '@components/buttons';
import { RootState } from 'typings';
import { AppActions, UserActions } from '@actions';
import { Consts } from '@constants';

const appState = (state: RootState) => state.app;

export default () => {
  const { isLoading, status, displayCtrl } = useSelector(appState);
  const actions = bindActionCreators(AppActions, useDispatch());
  const usrActions = bindActionCreators(UserActions, useDispatch());
  const [removeWord, setRemoveWord] = useState(displayCtrl[Consts.ShowTypes.REMOVE_WORD] ? true : false);

  // server start
  const handleStart = () => actions.start();
  // server stop
  const handleStop = () => actions.stop();
  // Refresh server status
  const handleStatus = () => actions.status();

  // Logout
  const handleLogout = async () => {
    // await Auth.signOut();

    usrActions.logout();
  };

  const handleRemoveWordChange = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    // component status update
    setRemoveWord(checked);
    //
    // actions.show(Consts.ShowTypes.REMOVE_WORD, checked);
  };

  return (
    <Fragment>
      <Box display="flex" flexDirection="column" margin={2}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h4" component="h4">
            Server Status: {status}
          </Typography>
          <IconButton aria-label="delete" color="secondary" onClick={handleStatus} disabled={isLoading}>
            <RefreshOutlinedIcon fontSize="large" />
          </IconButton>
        </Box>
        <Box display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            color="primary"
            sx={{
              width: 120,
              m: 1,
              bgcolor: green[600],
              '&:hover': {
                bgcolor: green[600],
              },
            }}
            size="large"
            onClick={handleStart}
            isLoading={isLoading}>
            Start
          </Button>
          <Button
            variant="contained"
            color="primary"
            sx={{
              width: 120,
              m: 1,
              bgcolor: red[700],
              '&:hover': {
                bgcolor: red[700],
              },
            }}
            size="large"
            onClick={handleStop}
            isLoading={isLoading}>
            Stop
          </Button>
        </Box>
        <Box display="flex" justifyContent="center">
          <Button
            variant="contained"
            color="primary"
            sx={{
              width: 120,
              m: 1,
              bgcolor: red[700],
              '&:hover': {
                bgcolor: red[700],
              },
            }}
            size="large"
            onClick={handleLogout}
            isLoading={isLoading}>
            Logout
          </Button>
        </Box>
      </Box>
      <Box>
        <List sx={{ bgcolor: 'grey.100' }}>
          <ListItem divider>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                <DeleteIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText>単語削除ボタン表示</ListItemText>
            <ListItemSecondaryAction>
              <IOSSwitch checked={removeWord} onChange={handleRemoveWordChange} />
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </Box>
    </Fragment>
  );
};
