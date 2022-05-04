import React from 'react';
import { bindActionCreators } from 'redux';
import { useDispatch } from 'react-redux';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import { Route, Switch, useRouteMatch, useLocation } from 'react-router-dom';
import { Paths } from '@constants';
import { AppActions, AdminActions } from '@actions';
import { DrawerLeft, Mainboard, Students, Settings, GroupDetails } from '.';
import { QuestionMain } from '@containers/questions';
import { AdminHeader } from '@containers/com';
import { RootState } from 'typings';

export default () => {
  const { path } = useRouteMatch();

  return (
    <Box sx={{ display: 'flex' }}>
      <DrawerLeft />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
        }}>
        <AdminHeader />
        <Toolbar />
        <Switch>
          <Route exact path={path} component={Mainboard} />
          <Route path={Paths.PATHS_ADMIN_GROUP_DETAILS} component={GroupDetails} />
          <Route path={Paths.PATHS_ADMIN_STUDENTS} component={Students} />
          <Route path={Paths.PATHS_ADMIN_SETTINGS} component={Settings} />
          <Route path={Paths.PATHS_ADMIN_QUESTIONS} component={QuestionMain} />
        </Switch>
      </Box>
    </Box>
  );
};
