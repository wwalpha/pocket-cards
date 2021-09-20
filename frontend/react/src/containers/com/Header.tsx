import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { push } from 'connected-react-router';
import { makeStyles, createStyles } from '@mui/styles';
import {
  Theme,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  ListItemText,
  ListItemIcon,
  Button,
} from '@mui/material';
// import MenuIcon from '@mui/icons-material/Menu';
// import ExitToApp from '@mui/icons-material/ExitToApp';
// import AddCircleOutline from '@mui/icons-material/AddCircleOutline';
import AddIcon from '@mui/icons-material/Add';
import MoreIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ReplayIcon from '@mui/icons-material/Replay';
import ArrowBackIcon from '@mui/icons-material/ArrowBackIos';
import SearchIcon from '@mui/icons-material/Search';
import { Paths, Consts } from '@constants';
import { GroupActions } from '@actions';
import { RootState } from 'typings';

const useStyles = makeStyles<Theme>(({ spacing, palette: { primary, common } }) =>
  createStyles({
    app: {
      boxShadow: 'none',
      height: spacing(8),
      backgroundColor: primary.dark,
      userSelect: 'none',
    },
    toolbar: { minHeight: spacing(8) },
    title: { flexGrow: 1, fontWeight: 600, textAlign: 'center', letterSpacing: '2px' },
    icon: { color: common.white, fontSize: spacing(4) },
    addButton: { position: 'absolute', right: spacing(1) },
    edgeButton: { margin: spacing(0) },
    replyButton: { padding: spacing(0.5) },
    menuItem: {
      '&:hover': {
        backgroundColor: primary.light,
        '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
          color: common.white,
        },
      },
    },
    backButton: { padding: spacing(0.5) },
    listItemIcon: { minWidth: spacing(4) },
  })
);

const audioRef = React.createRef<HTMLAudioElement>();

const studyState = (state: RootState) => state.study;
const groupState = (state: RootState) => state.group;

export default () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const actions = bindActionCreators(GroupActions, dispatch);
  const { pathname } = useLocation();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const { groups, activeGroup } = useSelector(groupState);
  const { current } = useSelector(studyState);

  const isMenuOpen = Boolean(anchorEl);

  // Left Icon action
  const handleOnClickLeft = () => {
    const paths = pathname.split('/');
    paths.pop();

    dispatch(push(paths.join('/')));
  };

  // switch group regist screen
  const handleOnClickAdd = () => dispatch(push(Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.GroupRegist]));

  // group delete
  const handleOnGroupDelete = () => {
    // close dialog
    handleMenuClose();
    // delete group
    actions.del();
  };

  const handleOnGroupEdit = () => {
    // close dialog
    handleMenuClose();
    // switch to group edit
    dispatch(push(Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.GroupEdit]));
  };

  // Menu Open
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  // Menu Close
  const handleMenuClose = () => setAnchorEl(null);

  /** 音声再生 */
  const handleReply = () => {
    if (!window.location.hostname.startsWith('localhost')) {
      audioRef.current?.play();
    }
  };
  // 表示中画面情報
  const screen = Paths.ROUTE_INFO[pathname];

  return (
    <React.Fragment>
      <AppBar position="static" className={classes.app}>
        <Toolbar className={classes.toolbar}>
          {(() => {
            return pathname.split('/').length <= 2 ? null : (
              <IconButton className={classes.backButton} onClick={handleOnClickLeft}>
                <ArrowBackIcon className={classes.icon} />
              </IconButton>
            );
          })()}
          <Typography variant="h5" color="inherit" className={classes.title}>
            {(() => {
              if (pathname === Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.Study]) {
                const groupInfo = groups.find((item) => item.id === activeGroup);

                return groupInfo?.name;
              }

              return screen?.title;
            })()}
          </Typography>
          {(() => {
            if (pathname === Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.Settings]) {
              return <Button color="inherit">{Consts.VERSION}</Button>;
            }

            return null;
          })()}
          {(() => {
            if (pathname === Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.Groups]) {
              return (
                <IconButton className={classes.addButton} color="inherit" aria-label="Add" onClick={handleOnClickAdd}>
                  <AddIcon fontSize="large" />
                </IconButton>
              );
            }

            if (pathname === Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.Study]) {
              return [
                <IconButton aria-label="search" edge="end" color="inherit" onClick={handleMenuOpen}>
                  <MoreIcon fontSize="large" />
                </IconButton>,
                <IconButton aria-label="display more actions" edge="end" color="inherit" onClick={handleMenuOpen}>
                  <MoreIcon fontSize="large" />
                </IconButton>,
              ];
            }

            if (pathname === Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.StudyCard]) {
              const draw = [
                <IconButton key="replyIcon" className={classes.replyButton} onClick={handleReply}>
                  <ReplayIcon className={classes.icon} />
                </IconButton>,
              ];

              if (current) {
                draw.push(<audio key="replyAudio" ref={audioRef} src={`/${current.mp3}`} />);
              }

              return draw;
            }
          })()}
        </Toolbar>
      </AppBar>
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        keepMounted
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={isMenuOpen}
        onClose={handleMenuClose}>
        <MenuItem className={classes.menuItem} onClick={handleOnGroupDelete}>
          <ListItemIcon className={classes.listItemIcon}>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="フォルダ削除" />
        </MenuItem>
        <MenuItem className={classes.menuItem} onClick={handleOnGroupEdit}>
          <ListItemIcon className={classes.listItemIcon}>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="フォルダ編集" />
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
};
