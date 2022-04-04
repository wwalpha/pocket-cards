import React from 'react';
import { bindActionCreators } from 'redux';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import BookIcon from '@mui/icons-material/Book';
import { AdminActions } from '@actions';
import { Consts } from '@constants';

const drawerWidth = 200;

export default () => {
  const location = useLocation();
  const actions = bindActionCreators(AdminActions, useDispatch());

  const handleClick = (subject: string) => {
    actions.selectSubject(subject, location.pathname);
  };

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
      variant="permanent"
      anchor="left">
      <Toolbar />
      <Divider />
      <List>
        <ListItem
          button
          key="Japanese"
          onClick={() => {
            handleClick(Consts.SUBJECT.JAPANESE.toString());
          }}>
          <ListItemIcon sx={{ minWidth: 32 }}>
            <BookIcon sx={{ color: '#b71927' }} />
          </ListItemIcon>
          <ListItemText primary="国 語" />
        </ListItem>
        <ListItem
          button
          key="Science"
          onClick={() => {
            handleClick(Consts.SUBJECT.SCIENCE.toString());
          }}>
          <ListItemIcon sx={{ minWidth: 32 }}>
            <BookIcon sx={{ color: '#f19116' }} />
          </ListItemIcon>
          <ListItemText primary="理 科" />
        </ListItem>
        <ListItem
          button
          key="Society"
          onClick={() => {
            handleClick(Consts.SUBJECT.SOCIETY.toString());
          }}>
          <ListItemIcon sx={{ minWidth: 32 }}>
            <BookIcon sx={{ color: '#288f46' }} />
          </ListItemIcon>
          <ListItemText primary="社 会" />
        </ListItem>
        <ListItem
          button
          key="English"
          onClick={() => {
            handleClick(Consts.SUBJECT.ENGLISH.toString());
          }}>
          <ListItemIcon sx={{ minWidth: 32 }}>
            <BookIcon sx={{ color: '#b71927' }} />
          </ListItemIcon>
          <ListItemText primary="英 語" />
        </ListItem>
      </List>
    </Drawer>
  );
};
