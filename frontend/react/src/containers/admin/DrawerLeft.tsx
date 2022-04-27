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
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import { AdminActions } from '@actions';
import { Consts, Paths } from '@constants';
import { styles } from './DrawerLeft.style';
import { RootState } from 'typings';

const appState = (state: RootState) => state.app;

export default () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const actions = bindActionCreators(AdminActions, dispatch);
  const { authority } = useSelector(appState);

  const handleClick = (subject: string) => actions.switchSubject(subject, location.pathname);

  const handleStudents = () => actions.getStudentList();
  // settings click handler
  const handleSettings = () => {
    dispatch(push(Paths.PATHS_ADMIN_SETTINGS));
  };

  return (
    <Drawer sx={styles.drawer} variant="permanent" anchor="left">
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          VER.0.5.1
        </Typography>
      </Toolbar>
      <Divider />
      <List sx={styles.list}>
        <ListItem
          button
          key="Japanese"
          onClick={() => {
            handleClick(Consts.SUBJECT.JAPANESE.toString());
          }}>
          <ListItemIcon sx={styles.itemIcon}>
            <BookIcon sx={{ color: '#b71927' }} />
          </ListItemIcon>
          <ListItemText primary="国 語" />
        </ListItem>
        <Divider />
        <ListItem
          button
          key="Science"
          onClick={() => {
            handleClick(Consts.SUBJECT.SCIENCE.toString());
          }}>
          <ListItemIcon sx={styles.itemIcon}>
            <BookIcon sx={{ color: '#f19116' }} />
          </ListItemIcon>
          <ListItemText primary="理 科" />
        </ListItem>
        <Divider />
        <ListItem
          button
          key="Society"
          onClick={() => {
            handleClick(Consts.SUBJECT.SOCIETY.toString());
          }}>
          <ListItemIcon sx={styles.itemIcon}>
            <BookIcon sx={{ color: '#288f46' }} />
          </ListItemIcon>
          <ListItemText primary="社 会" />
        </ListItem>
        <Divider />
        <ListItem
          button
          key="English"
          onClick={() => {
            handleClick(Consts.SUBJECT.ENGLISH.toString());
          }}>
          <ListItemIcon sx={styles.itemIcon}>
            <BookIcon sx={{ color: '#b71927' }} />
          </ListItemIcon>
          <ListItemText primary="英 語" />
        </ListItem>
        {authority === Consts.Authority.PARENT && (
          <React.Fragment>
            <Divider />
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
