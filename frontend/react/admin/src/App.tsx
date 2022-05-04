import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import { Paths } from '@constants';
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
          <Route exact path={Paths.PATHS_ROOT} component={Mainboard} />
          <Route path={Paths.PATHS_GROUP_LIST} component={GroupDetails} />
          <Route path={Paths.PATHS_STUDENTS} component={Students} />
          <Route path={Paths.PATHS_SETTINGS} component={Settings} />
          <Route path={Paths.PATHS_QUESTION_LIST} component={QuestionMain} />
        </Switch>
      </Box>
    </Box>
  );
};
