import * as React from 'react';
import { Switch, Route } from 'react-router-dom';
import Box from '@mui/material/Box';
import { Paths, Consts } from '@constants';
import { Header, Footer, RegistMain, StudyMain, MyPageMain, Settings, Home, Folder, SignUp } from '@containers';

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
          <Route exact path="/" component={Settings} />
          <Route path={Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.Regist]} component={RegistMain} />
          <Route path={Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.MyPage]} component={MyPageMain} />
          <Route path={Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.Study]} component={StudyMain} />
          <Route path={Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.Settings]} component={Settings} />
          <Route path={Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.Groups]} component={Folder} />
          <Route path={Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.Todos]} component={Home} />
          <Route path={Paths.PATHS_SIGN_UP} component={SignUp} />
        </Switch>
      </Box>
      <Footer />
    </Box>
  );
};

export default App;
