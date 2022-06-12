import * as React from 'react';
import { Switch, Route } from 'react-router-dom';
import Box from '@mui/material/Box';
import { ROUTE_PATHS, Consts } from '@constants';
import { Header, Footer, Home, SignUp, Settings, Card } from '@containers';

const styles = {
  root: (theme: any) => ({
    backgroundColor: theme.palette.grey[200],
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  }),
  body: {
    overflowY: 'auto',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
    maxHeight: `calc(100vh - ${Consts.HEADER_HEIGHT + Consts.FOOT_HEIGHT}px)`,
    height: `calc(100vh - ${Consts.HEADER_HEIGHT + Consts.FOOT_HEIGHT}px)`,
  },
  noFooter: {
    overflowY: 'auto',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
    maxHeight: `calc(100vh - ${Consts.HEADER_HEIGHT}px)`,
    height: `calc(100vh - ${Consts.HEADER_HEIGHT}px)`,
  },
};

const App = () => {
  return (
    <Box display="flex" flexDirection="column" sx={styles.root}>
      <Header />
      <Box sx={styles.body}>
        <Switch>
          <Route exact path={ROUTE_PATHS.ROOT} component={Home} />
          <Route path={ROUTE_PATHS.SETTINGS} component={Settings} />
          <Route path={ROUTE_PATHS.STUDY_CARD} component={Card} />
          <Route path={ROUTE_PATHS.SIGN_UP} component={SignUp} />
        </Switch>
      </Box>
      <Footer />
    </Box>
  );
};

export default App;
