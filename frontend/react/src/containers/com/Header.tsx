import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useHistory } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { push } from 'connected-react-router';
import { styled, alpha } from '@mui/material/styles';
import {
  AppBar,
  Button,
  IconButton,
  InputBase,
  ListItemText,
  ListItemIcon,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
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
import { Groups } from '@mui/icons-material';

const audioRef = React.createRef<HTMLAudioElement>();

const studyState = (state: RootState) => state.study;
const groupState = (state: RootState) => state.group;

const Search = styled('div')(({ theme: { shape, palette, spacing } }) => ({
  position: 'relative',
  borderRadius: shape.borderRadius,
  backgroundColor: alpha(palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(palette.common.white, 0.25),
  },
  marginRight: spacing(2),
  marginLeft: 0,
  width: '100%',
}));

const SearchIconWrapper = styled('div')(({ theme: { spacing } }) => ({
  padding: spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

export default () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const actions = bindActionCreators(GroupActions, dispatch);
  const { pathname } = useLocation();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const { current } = useSelector(studyState);
  const { searchWord } = useSelector(groupState);

  const isMenuOpen = Boolean(anchorEl);

  // Left Icon action
  const handleOnGoback = () => history.goBack();

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

  const handleOnSearch = (e: React.SyntheticEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    actions.search(e.currentTarget.value);
  };

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
      <AppBar
        position="static"
        sx={{
          boxShadow: 'none',
          height: ({ spacing }) => spacing(8),
          bgcolor: 'primary.dark',
          userSelect: 'none',
        }}>
        <Toolbar sx={{ minHeight: ({ spacing }) => spacing(8) }}>
          {(() => {
            return pathname.split('/').length <= 2 ? null : (
              <IconButton sx={{ p: 0.5 }} onClick={handleOnGoback}>
                <ArrowBackIcon sx={{ color: 'common.white', fontSize: ({ spacing }) => spacing(4) }} />
              </IconButton>
            );
          })()}
          <Typography
            variant="h5"
            color="inherit"
            sx={{ flexGrow: 1, fontWeight: 600, textAlign: 'center', letterSpacing: ({ spacing }) => spacing(0.25) }}>
            {(() => {
              if (pathname === Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.Study]) {
                return (
                  <Search>
                    <SearchIconWrapper>
                      <SearchIcon />
                    </SearchIconWrapper>
                    <StyledInputBase
                      placeholder="Search…"
                      inputProps={{ 'aria-label': 'search' }}
                      value={searchWord}
                      onChange={handleOnSearch}
                    />
                  </Search>
                );
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
                <IconButton
                  sx={{ position: 'absolute', right: ({ spacing }) => spacing(1) }}
                  color="inherit"
                  aria-label="Add"
                  onClick={handleOnClickAdd}>
                  <AddIcon fontSize="large" />
                </IconButton>
              );
            }

            if (pathname === Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.Study]) {
              return [
                <IconButton
                  key={`studyMore`}
                  aria-label="display more actions"
                  edge="end"
                  color="inherit"
                  onClick={handleMenuOpen}>
                  <MoreIcon fontSize="large" />
                </IconButton>,
              ];
            }

            if (pathname === Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.StudyCard]) {
              const draw = [
                <IconButton key="replyIcon" sx={{ p: 0.5 }} onClick={handleReply}>
                  <ReplayIcon sx={{ color: 'common.white', fontSize: ({ spacing }) => spacing(4) }} />
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
        <MenuItem
          sx={{
            '&:hover': {
              bgcolor: 'primary.light',
              '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                color: 'common.white',
              },
            },
          }}
          onClick={handleOnGroupDelete}>
          <ListItemIcon sx={{ minWidth: ({ spacing }) => spacing(4) }}>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="フォルダ削除" />
        </MenuItem>
        <MenuItem
          sx={{
            '&:hover': {
              bgcolor: 'primary.light',
              '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                color: 'common.white',
              },
            },
          }}
          onClick={handleOnGroupEdit}>
          <ListItemIcon sx={{ minWidth: ({ spacing }) => spacing(4) }}>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="フォルダ編集" />
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
};
