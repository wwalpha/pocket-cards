import React from 'react';
import { AppBar, Box, Toolbar, Typography } from '@mui/material';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { Paths } from '@constants';
import { DrawerLeft, Mainboard, QuestionList } from '.';

export default () => {
  const { path } = useRouteMatch();

  return (
    <Box sx={{ display: 'flex' }}>
      <DrawerLeft />
      <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <AppBar
          position="static"
          sx={{
            boxShadow: 'none',
            height: ({ spacing }) => spacing(8),
            bgcolor: 'primary.dark',
            userSelect: 'none',
          }}>
          <Toolbar>
            <Typography variant="h6" noWrap component="div">
              保護者管理画面
            </Typography>
          </Toolbar>
        </AppBar>

        <Switch>
          <Route exact path={path} component={Mainboard} />
          <Route path={Paths.PATHS_GUARDIAN_GROUP_QUESTIONS} component={QuestionList} />
        </Switch>
      </Box>
    </Box>
  );
};
