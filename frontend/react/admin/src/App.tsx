import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import { ROUTE_PATHS } from '@constants';
import { Mainboard, Students, Settings, GroupDetails } from '@containers/body';
import { QuestionMain } from '@containers/questions';
import { Header, MainMenu } from '@containers/com';

export default () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <MainMenu />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
        }}>
        <Header />
        <Toolbar />
        <Switch>
          <Route exact path={ROUTE_PATHS.ROOT} component={Mainboard} />
          <Route path={ROUTE_PATHS.ROOT_LANGUAGE} component={Mainboard} />
          <Route path={ROUTE_PATHS.ROOT_ENGLISH} component={Mainboard} />
          <Route path={ROUTE_PATHS.ROOT_SCIENCE} component={Mainboard} />
          <Route path={ROUTE_PATHS.ROOT_SOCIETY} component={Mainboard} />
          <Route path={ROUTE_PATHS.GROUP_LIST} component={GroupDetails} />
          <Route path={ROUTE_PATHS.STUDENTS} component={Students} />
          <Route path={ROUTE_PATHS.SETTINGS} component={Settings} />
          <Route path={ROUTE_PATHS.QUESTION_LIST} component={QuestionMain} />
        </Switch>
      </Box>
    </Box>
  );
};
