import React from 'react';
import { AppBar, Box, Toolbar, Typography } from '@mui/material';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { DrawerLeft, Mainboard, GroupDetails, QuestionList } from '.';
import { default as styles } from './Dashboard.style';
import { Paths } from '@constants';

const Dashboard = () => {
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
              Dashboard
            </Typography>
          </Toolbar>
        </AppBar>

        <Switch>
          <Route exact path={path} component={Mainboard} />
          <Route path={Paths.PATHS_ADMIN_GROUP_DETAILS} component={GroupDetails} />
          <Route path={Paths.PATHS_ADMIN_GROUP_QUESTIONS} component={QuestionList} />
        </Switch>
      </Box>
    </Box>
  );
};

export default Dashboard;
