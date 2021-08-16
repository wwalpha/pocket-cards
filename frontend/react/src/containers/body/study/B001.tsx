import * as React from 'react';
import { bindActionCreators } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { makeStyles, Theme, createStyles, Box } from '@material-ui/core';
import Button from '@components/buttons/Button';
import { WordList } from '@components/functions';
import { AppActions, StudyActions, WordActions } from '@actions';
import { Paths, Consts } from '@constants';
import { Domains } from 'typings';

const useStyles = makeStyles(({ spacing }: Theme) =>
  createStyles({
    button: {
      width: spacing(20),
      // height: spacing(20),
      letterSpacing: spacing(0.25),
      fontSize: '1.25rem',
      fontWeight: 600,
    },
  })
);

const groupState = (state: Domains.State) => state.group;
const appState = (state: Domains.State) => state.app;

export default () => {
  const classes = useStyles();
  const actions = bindActionCreators(StudyActions, useDispatch());
  const appActions = bindActionCreators(AppActions, useDispatch());
  const wrdActions = bindActionCreators(WordActions, useDispatch());
  const { rows: groups } = useSelector(groupState);
  const { groupId, displayCtrl } = useSelector(appState);

  const groupWords = undefined; // words.filter((item) => item.groupId === groupId);

  // 学習
  // const handleNew = () => actions.startNew();
  // // 復習
  // const handleReview = () => actions.startReview();
  // // テスト
  // const handleTest = () => actions.startTest();

  // 詳細
  const handleDetail = (word: string) => wrdActions.detail(word);
  // 削除
  const handleDelete = (word: string) => wrdActions.deleteRow(groupId, word);

  return (
    <React.Fragment>
      <Box display="flex" flexDirection="column" alignItems="center" margin={1} height="128px">
        <Box display="flex" justifyContent="center">
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            // @ts-ignore
            component={Link}
            to={Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.Regist]}>
            新規登録
          </Button>
          {/* <Button variant="contained" color="primary" className={classes.button} onClick={handleTest}>
            テスト
          </Button> */}
        </Box>
        <Box display="flex" justifyContent="center">
          {/* <Button variant="contained" color="primary" className={classes.button} onClick={handleNew}>
            学習
          </Button>
          <Button variant="contained" color="primary" className={classes.button} onClick={handleReview}>
            復習
          </Button> */}
        </Box>
      </Box>
      {/* {(() => {
        if (groupWords.length === 0) return;

        return (
          <WordList
            list={groupWords[0].words}
            onDetail={handleDetail}
            onDelete={handleDelete}
            showDelete={displayCtrl[Consts.ShowTypes.REMOVE_WORD]}
          />
        );
      })()} */}
    </React.Fragment>
  );
};
