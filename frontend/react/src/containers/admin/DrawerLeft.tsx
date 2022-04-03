import React from 'react';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import BookIcon from '@mui/icons-material/Book';
import { default as styles } from './DrawerLeft.style';

const drawerWidth = 200;

const DrawerMenu = () => {
  const classes = styles();

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
        <ListItem button key="English">
          <ListItemIcon sx={{ minWidth: 32 }}>
            <BookIcon sx={{ color: '#b71927' }} />
          </ListItemIcon>
          <ListItemText primary="英 語" />
        </ListItem>
        <ListItem button key="Japanese">
          <ListItemIcon sx={{ minWidth: 32 }}>
            <BookIcon sx={{ color: '#b71927' }} />
          </ListItemIcon>
          <ListItemText primary="国 語" />
        </ListItem>
        <ListItem button key="Science">
          <ListItemIcon sx={{ minWidth: 32 }}>
            <BookIcon sx={{ color: '#f19116' }} />
          </ListItemIcon>
          <ListItemText primary="理 科" />
        </ListItem>
        <ListItem button key="Society">
          <ListItemIcon sx={{ minWidth: 32 }}>
            <BookIcon sx={{ color: '#288f46' }} />
          </ListItemIcon>
          <ListItemText primary="社 会" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default DrawerMenu;
