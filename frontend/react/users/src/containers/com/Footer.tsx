import * as React from 'react';
import { bindActionCreators } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Paper from '@mui/material/Paper';
import HomeIcon from '@mui/icons-material/HomeOutlined';
import SettingsIcon from '@mui/icons-material/SettingsOutlined';
import { ROUTE_PATHS, Consts } from '@constants';
import { AppActions } from '@actions';
import { RootState } from 'typings';

const styles = {
  navigation: {
    p: 1,
  },
};

const appState = (state: RootState) => state.app;

export default () => {
  // actions
  const actions = bindActionCreators(AppActions, useDispatch());
  // reducer
  const { tabIndex, status } = useSelector(appState);
  // location
  const { pathname } = useLocation();

  // Bottom menu clicked
  const handleChange = (_: any, value: any) => actions.activeTab(Number(value));

  // 表示中画面情報
  const screen = ROUTE_PATHS.ROUTE_INFO[pathname];

  // フット表示しない
  if (screen && !screen.showFooter) return null;

  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: 'common.white' }} elevation={3}>
      <BottomNavigation showLabels={false} value={tabIndex} onChange={handleChange}>
        <BottomNavigationAction
          sx={styles.navigation}
          value="0"
          icon={<HomeIcon sx={{ fontSize: '2.5rem' }} />}
          component={React.forwardRef((props: any, ref: any) => (
            <Link to={ROUTE_PATHS.ROOT} {...props} />
          ))}
        />
        <BottomNavigationAction
          sx={styles.navigation}
          value="1"
          icon={<SettingsIcon sx={{ fontSize: '2.5rem' }} />}
          component={React.forwardRef((props: any, ref: any) => (
            <Link to={ROUTE_PATHS.SETTINGS} {...props} />
          ))}
        />
      </BottomNavigation>
    </Paper>
  );
};
