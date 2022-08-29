import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useHistory } from 'react-router-dom';
import { push } from 'connected-react-router';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import MoreIcon from '@mui/icons-material/MoreVert';
import ReplayIcon from '@mui/icons-material/Replay';
import ArrowBackIcon from '@mui/icons-material/ArrowBackIos';
import { ROUTE_PATHS, Consts } from '@constants';
import { RootState } from 'typings';

const audioRef = React.createRef<HTMLAudioElement>();

const studyState = (state: RootState) => state.study;

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
  const { pathname } = useLocation();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const { current } = useSelector(studyState);

  const isMenuOpen = Boolean(anchorEl);

  // Left Icon action
  const handleOnGoback = () => history.goBack();

  // switch group regist screen
  const handleOnClickAdd = () => dispatch(push(ROUTE_PATHS.ROUTE_PATHS[ROUTE_PATHS.ROUTE_PATH_INDEX.GroupRegist]));

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
  const screen = ROUTE_PATHS.ROUTE_INFO[pathname];

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

          {(() => {
            if (pathname === ROUTE_PATHS.PATHS_SETTINGS) {
              return <Button color="inherit">{Consts.VERSION}</Button>;
            }

            return null;
          })()}
          {(() => {
            if (pathname === ROUTE_PATHS.ROUTE_PATHS[ROUTE_PATHS.ROUTE_PATH_INDEX.Groups]) {
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

            if (pathname === ROUTE_PATHS.ROUTE_PATHS[ROUTE_PATHS.ROUTE_PATH_INDEX.Study]) {
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

            if (pathname === ROUTE_PATHS.PATHS_STUDY_CARD) {
              const draw = [
                <IconButton key="replyIcon" sx={{ p: 0.5 }} onClick={handleReply}>
                  <ReplayIcon sx={{ color: 'common.white', fontSize: ({ spacing }) => spacing(4) }} />
                </IconButton>,
              ];

              // if (current) {
              //   draw.push(<audio key="replyAudio" ref={audioRef} src={`/${current.voiceTitle}`} />);
              // }

              return draw;
            }
          })()}
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
};
