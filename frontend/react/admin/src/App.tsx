import React from 'react';
import { Route, Switch, Router } from 'react-router-dom';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Consts, ROUTE_PATHS } from '@constants';
import { WeeklyRegist } from '@containers/ability';
import {
  Students,
  Settings,
  GroupRouter,
  CurriculumOrder,
  MultiTest,
  Inquiry,
  ProgressSearch,
  CurriculumOverall,
} from '@containers/body';
import { Header } from '@containers/com';
import { MainMenu } from '@containers/com';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { styled, useTheme } from '@mui/material/styles';

const drawerWidth = 200;

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  // padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

export default () => {
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ display: 'flex' }}>
        <Header open={open} handleDrawerOpen={handleDrawerOpen} />
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
          variant="persistent"
          anchor="left"
          open={open}
        >
          <DrawerHeader>
            <Toolbar>
              <Typography variant="h6" noWrap component="div">
                {Consts.VERSION}
              </Typography>
            </Toolbar>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          </DrawerHeader>
          <MainMenu />
        </Drawer>
        <Main open={open}>
          <DrawerHeader />
          <Switch>
            <Route exact path={ROUTE_PATHS.ROOT} component={GroupRouter} />
            <Route path={ROUTE_PATHS.GROUP_ROOT()} component={GroupRouter} />
            <Route path={ROUTE_PATHS.STUDENTS}>
              <Students />
            </Route>
            <Route path={ROUTE_PATHS.SETTINGS}>
              <Settings />
            </Route>
            <Route path={ROUTE_PATHS.WEEKLY}>
              <WeeklyRegist />
            </Route>
            <Route path={ROUTE_PATHS.CURRICULUM_ORDER}>
              <CurriculumOrder />
            </Route>
            <Route path={ROUTE_PATHS.MULTI_TEST}>
              <MultiTest />
            </Route>
            <Route path={ROUTE_PATHS.INQUIRY}>
              <Inquiry />
            </Route>
            <Route path={ROUTE_PATHS.PROGRESS}>
              <ProgressSearch />
            </Route>
            <Route path={ROUTE_PATHS.OVERALL_PROGRESS}>
              <CurriculumOverall />
            </Route>
          </Switch>
        </Main>
      </Box>
    </LocalizationProvider>
  );
};
