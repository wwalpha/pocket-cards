import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { Paths } from '@constants';
import { DrawerLeft, Mainboard, QuestionList } from '.';

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
            <Box sx={{ ml: 2 }}>
              <Button variant="outlined" color="inherit" sx={{ mx: 1, borderRadius: 0 }}>
                ADD
              </Button>
              <Button variant="outlined" color="inherit" sx={{ mx: 1, borderRadius: 0 }}>
                LOGOUT
              </Button>
            </Box>
          </Toolbar>
        </AppBar>
        <Toolbar />
        <Switch>
          <Route exact path={path} component={Mainboard} />
          <Route path={Paths.PATHS_GUARDIAN_GROUP_QUESTIONS} component={QuestionList} />
        </Switch>
      </Box>
    </Box>
  );
};
