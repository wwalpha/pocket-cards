import React, { createRef } from 'react';
import { bindActionCreators } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import Fab from '@mui/material/Fab';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { StudyActions } from '@actions';
import { RootState, WordItem } from 'typings';

const studyState = (state: RootState) => state.study;
const appState = (state: RootState) => state.app;

const audioRef = createRef<HTMLAudioElement>();

const StyledBarButton = styled(Button)(({ theme: { spacing, palette } }) => ({
  marginLeft: spacing(1),
  marginRight: spacing(1),
  backgroundColor: palette.secondary.light,
  '&:hover': {
    backgroundColor: palette.secondary.light,
  },
}));

const card = () => {
  const dispatch = useDispatch();
  const actions = bindActionCreators(StudyActions, dispatch);
  const { current: word, rows, history } = useSelector(studyState);
  const [showText, setShowText] = React.useState(false);

  const handleTouchStart = () => setShowText(true);

  const handleKnown = () => {
    // 正解
    actions.answer(true);
    setShowText(false);

    setTimeout(() => play(), 500);
  };

  const handleUnknown = () => {
    // 不正解
    actions.answer(false);

    setShowText(false);

    setTimeout(() => play(), 500);
  };

  // 単語無視
  const handleIgnore = () => {
    if (!word) return;

    // hide text
    setShowText(false);

    // play next word's audio
    setTimeout(() => play(), 500);
  };

  const getButtons = (word?: WordItem) => {
    if (!word) return [];

    // @ts-ignore
    const buttons = [];

    // 単語あり
    buttons.push(
      <Fab
        key={2}
        sx={{
          width: ({ spacing }) => spacing(12),
          height: ({ spacing }) => spacing(12),
          mx: 3,
          color: 'common.white',
        }}
        size="large"
        color="primary"
        disableFocusRipple
        disableTouchRipple
        disableRipple
        onTouchStart={handleTouchStart}
        onMouseDown={handleTouchStart}
        onClick={handleKnown}>
        知ってる
      </Fab>
    );

    buttons.push(
      <Fab
        key={1}
        sx={{
          width: ({ spacing }) => spacing(12),
          height: ({ spacing }) => spacing(12),
          mx: 3,
          color: 'common.white',
        }}
        size="large"
        color="secondary"
        disableFocusRipple
        disableTouchRipple
        disableRipple
        onTouchStart={handleTouchStart}
        onMouseDown={handleTouchStart}
        onClick={handleUnknown}>
        知らない
      </Fab>
    );

    return buttons;
  };

  /** 音声再生 */
  const play = () => {
    const audio = audioRef.current;

    if (!window.location.hostname.startsWith('localhost')) {
      audio && audio.play();
    }
  };

  return (
    <Grid container direction="column" sx={{ height: '100%', position: 'relative' }}>
      <Box sx={{ display: 'flex', py: 1, mx: 1 }}>
        <StyledBarButton variant="contained" disableTouchRipple disableFocusRipple disableRipple onClick={handleIgnore}>
          無視
        </StyledBarButton>
        {(() => {
          if (window.navigator.userAgent.indexOf('iPhone') !== -1) return;
          if (window.navigator.userAgent.indexOf('iPad') !== -1) return;

          return (
            <StyledBarButton
              variant="contained"
              disableTouchRipple
              disableFocusRipple
              disableRipple
              onClick={handleTouchStart}>
              語彙表示
            </StyledBarButton>
          );
        })()}
      </Box>

      {(() => {
        if (!word) {
          return (
            <Grid container justifyContent="center" alignItems="center" sx={{ mb: 2, flexGrow: 1 }}>
              <Grid item>{getButtons(word)}</Grid>
            </Grid>
          );
        }

        return (
          <React.Fragment>
            <Grid
              container
              alignItems="center"
              justifyContent="center"
              sx={{ width: '100%', height: '380px', p: 1, pt: 2 }}>
              <Card sx={{ width: '90%', height: '100%', borderRadius: 4, userSelect: 'none' }}>
                <audio ref={audioRef} src={`/${word.mp3}`} />
                <CardContent sx={{ textAlign: 'center', pt: 6 }}>
                  <Typography variant="h4" gutterBottom align="center">
                    {word.question ? word.question.split('+').join(' ') : ''}
                  </Typography>
                  <Typography variant="h6" align="center">
                    {word.pronounce ? `/${word.pronounce}/` : undefined}
                  </Typography>
                  <Typography component="p" variant="h6" align="center" style={{ display: showText ? '' : 'none' }}>
                    {word.vocChn}
                  </Typography>
                  <Typography component="p" variant="h6" align="center" style={{ display: showText ? '' : 'none' }}>
                    {word.vocJpn}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid container justifyContent="center" alignItems="center" sx={{ mb: 2, flexGrow: 1 }}>
              <Grid item>{getButtons(word)}</Grid>
            </Grid>
          </React.Fragment>
        );
      })()}
    </Grid>
  );
};

export default card;
