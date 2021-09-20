import * as React from 'react';
import { bindActionCreators } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { BottomNavigation, BottomNavigationAction, Paper, Theme } from '@mui/material';
import HomeIcon from '@mui/icons-material/HomeOutlined';
import SettingsIcon from '@mui/icons-material/SettingsOutlined';
import { Paths, Consts } from '@constants';
import { AppActions } from '@actions';
import { RootState } from 'typings';

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
  const screen = Paths.ROUTE_INFO[pathname];

  // フット表示しない
  if (screen && !screen.showFooter) return null;

  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
      <BottomNavigation showLabels={false} value={tabIndex} onChange={handleChange}>
        <BottomNavigationAction
          sx={{ pt: 1 }}
          value={Paths.ROUTE_PATH_INDEX.Groups}
          icon={<HomeIcon sx={{ fontSize: '2.5rem' }} />}
          disabled={status !== Consts.SERVER_STATUS.RUNNING}
          component={React.forwardRef((props: any, ref: any) => (
            <Link to={Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.Groups]} {...props} />
          ))}
        />
        {/* <BottomNavigationAction
        className={classes.action}
        value={Paths.ROUTE_PATH_INDEX.MyPage}
        icon={<PersonIcon className={classes.icon} />}
        component={React.forwardRef((props: any, ref: any) => (
          <Link to={Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.MyPage]} {...props} />
        ))}
      /> */}
        {/* <BottomNavigationAction
        className={classes.action}
        value={Paths.ROUTE_PATH_INDEX.Regist}
        icon={<CameraIcon className={classes.icon} />}
        disableRipple
        disableTouchRipple
        component={React.forwardRef((props: any, ref: any) => (
          <Link to={Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.Regist]} {...props} />
        ))}
      /> */}
        <BottomNavigationAction
          sx={{ pt: 1 }}
          value={Paths.ROUTE_PATH_INDEX.Settings}
          icon={<SettingsIcon sx={{ fontSize: '2.5rem' }} />}
          component={React.forwardRef((props: any, ref: any) => (
            <Link to={Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.Settings]} {...props} />
          ))}
        />
      </BottomNavigation>
    </Paper>
  );
};
