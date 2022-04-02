import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { AppBar, Box, Toolbar, Typography } from '@mui/material';
import { DrawerLeft, GroupList, RightPanel } from '.';
import { default as styles } from './Dashboard.style';

const drawerWidth = 200;
const rightWidth = 240;

const Dashboard = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Permanent drawer
          </Typography>
        </Toolbar>
      </AppBar>
      <DrawerLeft />
      <Switch>
        <Route exact path="/" component={GroupList} />
      </Switch>
      <RightPanel />
    </Box>
  );
};

export default Dashboard;
