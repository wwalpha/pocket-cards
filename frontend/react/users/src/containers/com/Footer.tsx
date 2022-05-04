import * as React from 'react';
import { bindActionCreators } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Paper from '@mui/material/Paper';
import HomeIcon from '@mui/icons-material/HomeOutlined';
import SettingsIcon from '@mui/icons-material/SettingsOutlined';
import FolderIcon from '@mui/icons-material/FolderOpen';
import { Paths, Consts } from '@constants';
import { AppActions } from '@actions';
import { RootState } from 'typings';

const styles = {
  navigation: {
    p: 1,
    // color: `${theme.palette.primary.dark} !important`,
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
  const screen = Paths.ROUTE_INFO[pathname];

  // フット表示しない
  if (screen && !screen.showFooter) return null;

  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: 'common.white' }} elevation={3}>
      <BottomNavigation showLabels={false} value={tabIndex} onChange={handleChange}>
        <BottomNavigationAction
          // classes={{
          //   root: classes.root,
          //   selected: classes.selected,
          // }}
          sx={styles.navigation}
          value={Paths.ROUTE_PATH_INDEX.Todos}
          icon={<HomeIcon sx={{ fontSize: '2.5rem' }} />}
          disabled={status !== Consts.SERVER_STATUS.RUNNING}
          component={React.forwardRef((props: any, ref: any) => (
            <Link to={Paths.PATHS_TODOS} {...props} />
          ))}
        />
        <BottomNavigationAction
          // classes={{
          //   root: classes.root,
          //   selected: classes.selected,
          // }}
          sx={styles.navigation}
          value={Paths.ROUTE_PATH_INDEX.Groups}
          icon={
            <FolderIcon
              sx={{
                fontSize: '2.5rem',
              }}
            />
          }
          disabled={status !== Consts.SERVER_STATUS.RUNNING}
          component={React.forwardRef((props: any, ref: any) => (
            <Link to={Paths.PATHS_GROUPS} {...props} />
          ))}
        />
        {/* <BottomNavigationAction
          sx={{ pt: 1 }}
          value={Paths.ROUTE_PATH_INDEX.MyPage}
          icon={<PersonIcon sx={{ fontSize: '2.5rem' }} />}
          disabled={status !== Consts.SERVER_STATUS.RUNNING}
          component={React.forwardRef((props: any, ref: any) => (
            <Link to={Paths.PATHS_MYPAGE} {...props} />
          ))}
        /> */}
        <BottomNavigationAction
          // classes={{
          //   root: classes.root,
          //   selected: classes.selected,
          // }}
          sx={styles.navigation}
          value={Paths.ROUTE_PATH_INDEX.Settings}
          icon={<SettingsIcon sx={{ fontSize: '2.5rem' }} />}
          component={React.forwardRef((props: any, ref: any) => (
            <Link to={Paths.PATHS_SETTINGS} {...props} />
          ))}
        />
      </BottomNavigation>
    </Paper>
  );
};
