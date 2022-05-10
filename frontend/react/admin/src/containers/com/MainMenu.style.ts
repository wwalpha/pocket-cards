const drawerWidth = 200;

export const styles = {
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    '& .MuiDrawer-paper': {
      width: drawerWidth,
      boxSizing: 'border-box',
    },
    bgcolor: 'primary.main',
  },
  list: {},
  itemIcon: {
    minWidth: 32,
  },
};
