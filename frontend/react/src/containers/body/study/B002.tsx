import * as React from 'react';
import { bindActionCreators } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import { Fab, Grid, Card, CardContent, Typography, TextField } from '@mui/material';
// import ReplayIcon from '@mui/icons-material/Replay';
// import EditIcon from '@mui/icons-material/Edit';
// import ArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
// import DoneIcon from '@mui/icons-material/Done';
import { StudyActions } from '@actions';
import { Consts } from '@constants';
import Loading from '@components/Loading';
import { RootState, Group } from 'typings';

const studyState = (state: RootState) => state.study;
const appState = (state: RootState) => state.app;

const audioRef = React.createRef<HTMLAudioElement>();
const zhRef = React.createRef<HTMLInputElement>();
const jaRef = React.createRef<HTMLInputElement>();

export default () => {
  const dispatch = useDispatch();
  const actions = bindActionCreators(StudyActions, dispatch);
  const { current: word, mode } = useSelector(studyState);
  const { isLoading } = useSelector(appState);
  const [showText, setShowText] = React.useState(false);
  const [edit, setEdit] = React.useState(false);

  const handleTouchStart = () => setShowText(true);

  /** 新規単語学習 */
  const handleNext = () => actions.startReview();

  const handleAnswer = (word: string, yes: boolean) => {
    actions.answer(word, yes);

    setShowText(false);

    setTimeout(() => play(), 100);
  };

  const getButtons = (mode?: string, word?: Group.WordItem) => {
    const buttons = [];

    // 単語あり
    if (word) {
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
          onClick={() => {
            handleAnswer(word.word, true);
          }}>
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
          onClick={() => {
            handleAnswer(word.word, false);
          }}>
          知らない
        </Fab>
      );
      return buttons;
    }

    // 単語なし
    if (mode === Consts.MODES.Review) {
      buttons.push(
        <Fab
          key={3}
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
          onClick={handleNext}>
          Retry
        </Fab>
      );
    }

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
      {/* <Grid container justify="flex-end" alignItems="center" className={classes.menubar}>
        <Grid item xs>
          <IconButton className={classes.iconButton} onClick={handleBack} disableRipple disableTouchRipple>
            <ArrowLeftIcon className={classes.icon} />
          </IconButton>
        </Grid>
        <Grid item xs={2}>
          <IconButton className={classes.iconButton} onClick={play} disableRipple disableTouchRipple>
            <ReplayIcon className={classes.icon} />
          </IconButton>
        </Grid>
      </Grid> */}
      {(() => {
        if (!word) {
          return (
            <Grid container justifyContent="center" alignItems="center" sx={{ mb: 2, flexGrow: 1 }}>
              <Grid item>{getButtons(mode, word)}</Grid>
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
                {/* <CardHeader
                  className={classes.header}
                  action={
                    <IconButton aria-label="Settings" onClick={handleSetEdit}>
                      {(() => {
                        return edit ? <DoneIcon color="secondary" /> : <EditIcon color="secondary" />;
                      })()}
                    </IconButton>
                  }
                /> */}
                <CardContent sx={{ textAlign: 'center', pt: 6 }}>
                  <Typography variant="h4" gutterBottom align="center">
                    {word.word}
                  </Typography>
                  <Typography variant="h6" align="center">
                    {word.pronounce ? `/${word.pronounce}/` : undefined}
                  </Typography>
                  {(() => {
                    return edit ? (
                      <TextField
                        inputRef={zhRef}
                        label="中国語"
                        sx={{ textAlign: 'center', pt: 6 }}
                        value={word.vocChn}
                        margin="normal"
                        variant="outlined"
                      />
                    ) : (
                      <Typography component="p" variant="h6" align="center" style={{ display: showText ? '' : 'none' }}>
                        {word.vocChn}
                      </Typography>
                    );
                  })()}
                  {(() => {
                    return edit ? (
                      <TextField
                        inputRef={jaRef}
                        label="日本語"
                        sx={{ textAlign: 'center', pt: 6 }}
                        value={word.vocJpn}
                        margin="normal"
                        variant="outlined"
                      />
                    ) : (
                      <Typography component="p" variant="h6" align="center" style={{ display: showText ? '' : 'none' }}>
                        {word.vocJpn}
                      </Typography>
                    );
                  })()}
                </CardContent>
              </Card>
            </Grid>
            <Grid container justifyContent="center" alignItems="center" sx={{ mb: 2, flexGrow: 1 }}>
              <Grid item>{getButtons(mode, word)}</Grid>
            </Grid>
          </React.Fragment>
        );
      })()}
    </Grid>
  );
};
