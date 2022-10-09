import React from 'react';
import { bindActionCreators } from 'redux';
import { useLocation } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'connected-react-router';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import BookIcon from '@mui/icons-material/Book';
import RateReviewIcon from '@mui/icons-material/RateReview';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import DirtyLensIcon from '@mui/icons-material/DirtyLens';
import TrafficIcon from '@mui/icons-material/Traffic';
import { AppActions, UserActions } from '@actions';
import { Consts, ROUTE_PATHS } from '@constants';
import { styles } from './MainMenu.style';
import { RootState } from 'typings';

const appState = (state: RootState) => state.app;

export default () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const actions = bindActionCreators(AppActions, dispatch);
  const usrActions = bindActionCreators(UserActions, dispatch);

  const { authority } = useSelector(appState);

  const handleClick = (subject: string) => actions.activeSubject(subject);

  const handleStudents = () => usrActions.getStudentList();
  // settings click handler
  const handleSettings = () => {
    dispatch(push(ROUTE_PATHS.SETTINGS));
  };
  // history click handler
  // const handleHistory = () => {
  //   dispatch(push(ROUTE_PATHS.HISTORY));
  // };

  const handleDispatch = (path: string) => {
    dispatch(push(path));
  };

  return (
    <Drawer sx={styles.drawer} variant="permanent" anchor="left">
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          {Consts.VERSION}
        </Typography>
      </Toolbar>
      <Divider />
      <List sx={styles.list}>
        <ListItem
          button
          key="maths"
          onClick={() => {
            handleClick(Consts.SUBJECT.MATHS);
          }}
        >
          <ListItemIcon sx={styles.itemIcon}>
            <BookIcon sx={{ color: Consts.COLORS.MATHS }} />
          </ListItemIcon>
          <ListItemText primary="算 数" />
        </ListItem>
        <Divider />
        <ListItem
          button
          key="Japanese"
          onClick={() => {
            handleClick(Consts.SUBJECT.LANGUAGE);
          }}
        >
          <ListItemIcon sx={styles.itemIcon}>
            <BookIcon sx={{ color: Consts.COLORS.LANGUAGE }} />
          </ListItemIcon>
          <ListItemText primary="国 語" />
        </ListItem>
        <Divider />
        <ListItem
          button
          key="Science"
          onClick={() => {
            handleClick(Consts.SUBJECT.SCIENCE.toString());
          }}
        >
          <ListItemIcon sx={styles.itemIcon}>
            <BookIcon sx={{ color: Consts.COLORS.SCIENCE }} />
          </ListItemIcon>
          <ListItemText primary="理 科" />
        </ListItem>
        <Divider />
        <ListItem
          button
          key="Society"
          onClick={() => {
            handleClick(Consts.SUBJECT.SOCIETY.toString());
          }}
        >
          <ListItemIcon sx={styles.itemIcon}>
            <BookIcon sx={{ color: Consts.COLORS.SOCIETY }} />
          </ListItemIcon>
          <ListItemText primary="社 会" />
        </ListItem>
        <Divider />
        <ListItem
          button
          key="English"
          onClick={() => {
            handleClick(Consts.SUBJECT.ENGLISH.toString());
          }}
        >
          <ListItemIcon sx={styles.itemIcon}>
            <BookIcon sx={{ color: Consts.COLORS.ENGLISH }} />
          </ListItemIcon>
          <ListItemText primary="英 語" />
        </ListItem>
        <Divider />
        <ListItem
          button
          key="Handwriting"
          onClick={() => {
            handleClick(Consts.SUBJECT.HANDWRITING.toString());
          }}
        >
          <ListItemIcon sx={styles.itemIcon}>
            <RateReviewIcon sx={{ color: Consts.COLORS.HANDWRITING }} />
          </ListItemIcon>
          <ListItemText primary="漢 字" />
        </ListItem>
        {authority === Consts.Authority.ADMIN && (
          <React.Fragment>
            <Divider />
            <ListItem
              button
              key="inquiry"
              onClick={() => {
                handleDispatch(ROUTE_PATHS.INQUIRY);
              }}
            >
              <ListItemIcon sx={styles.itemIcon}>
                <TrafficIcon sx={{ color: Consts.COLORS.INQUIRY }} />
              </ListItemIcon>
              <ListItemText primary="問い合わせ" />
            </ListItem>
          </React.Fragment>
        )}
        {authority === Consts.Authority.PARENT && (
          <React.Fragment>
            <Divider />
            <ListItem
              button
              key="multitest"
              onClick={() => {
                handleDispatch(ROUTE_PATHS.MULTI_TEST);
              }}
            >
              <ListItemIcon sx={styles.itemIcon}>
                <DirtyLensIcon sx={{ color: Consts.COLORS.MULTI_TEST }} />
              </ListItemIcon>
              <ListItemText primary="確認テスト" />
            </ListItem>
            <Divider />
            <ListItem
              button
              key="order"
              onClick={() => {
                handleDispatch(ROUTE_PATHS.CURRICULUM_ORDER);
              }}
            >
              <ListItemIcon sx={styles.itemIcon}>
                <LocalFireDepartmentIcon sx={{ color: 'secondary.main' }} />
              </ListItemIcon>
              <ListItemText primary="学習順番" />
            </ListItem>
            <Divider />
            <ListItem
              button
              key="weekly"
              onClick={() => {
                handleDispatch(ROUTE_PATHS.WEEKLY);
              }}
            >
              <ListItemIcon sx={styles.itemIcon}>
                <LocalFireDepartmentIcon sx={{ color: 'secondary.main' }} />
              </ListItemIcon>
              <ListItemText primary="週テスト対策" />
            </ListItem>
            <Divider />
            {/* <ListItem button key="history" onClick={handleHistory}>
              <ListItemIcon sx={styles.itemIcon}>
                <LocalFireDepartmentIcon sx={{ color: 'secondary.main' }} />
              </ListItemIcon>
              <ListItemText primary="学習履歴" />
            </ListItem>
            <Divider /> */}
            <ListItem button key="Students" onClick={handleStudents}>
              <ListItemIcon sx={styles.itemIcon}>
                <PersonIcon sx={{ color: 'secondary.main' }} />
              </ListItemIcon>
              <ListItemText primary="生 徒" />
            </ListItem>
            <Divider />
            <ListItem button key="Settings" onClick={handleSettings}>
              <ListItemIcon sx={styles.itemIcon}>
                <SettingsIcon sx={{ color: 'secondary.main' }} />
              </ListItemIcon>
              <ListItemText primary="設 定" />
            </ListItem>
          </React.Fragment>
        )}
      </List>
    </Drawer>
  );
};
