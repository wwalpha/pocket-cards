import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import { ROUTE_PATHS } from '@constants';
import { AbilityRouter } from '@containers/ability';
import { Students, Settings, GroupRouter } from '@containers/body';
import { MainMenu } from '@containers/com';

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
        <Toolbar />
        <Switch>
          <Route exact path={ROUTE_PATHS.ROOT} component={GroupRouter} />
          <Route path={ROUTE_PATHS.GROUP_ROOT()} component={GroupRouter} />
          <Route path={ROUTE_PATHS.STUDENTS} component={Students} />
          <Route path={ROUTE_PATHS.SETTINGS} component={Settings} />
          <Route path={ROUTE_PATHS.ABILITIES} component={AbilityRouter} />
        </Switch>
      </Box>
    </Box>
  );
};
