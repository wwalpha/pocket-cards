import * as React from 'react';
import { bindActionCreators } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Box } from '@mui/material';
import Button from '@components/buttons/Button';
import { WordList } from '@components/functions';
import { StudyActions, WordActions } from '@actions';
import { Paths, Consts } from '@constants';
import { RootState } from 'typings';

const groupState = (state: RootState) => state.group;
const appState = (state: RootState) => state.app;

export default () => {
  const actions = bindActionCreators(StudyActions, useDispatch());
  const wrdActions = bindActionCreators(WordActions, useDispatch());
  const { activeGroup, groupWords } = useSelector(groupState);
  const { displayCtrl } = useSelector(appState);

  // 学習
  const handleNew = () => actions.startNew();
  // 復習
  const handleReview = () => actions.startReview();
  // テスト
  const handleTest = () => actions.startTest();

  // 詳細
  const handleDetail = (word: string) => wrdActions.detail(word);
  // 削除
  const handleDelete = (word: string) => wrdActions.deleteRow(activeGroup, word);

  return (
    <React.Fragment>
      <Box display="flex" flexDirection="column" alignItems="center" margin={1} height="128px">
        <Box display="flex" justifyContent="center">
          <Button
            variant="contained"
            color="primary"
            sx={{ width: 160, letterSpacing: 2, fontSize: '1.25rem', fontWeight: 600 }}
            // @ts-ignore
            component={Link}
            to={Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.Regist]}>
            新規登録
          </Button>
          <Button
            variant="contained"
            color="primary"
            sx={{ width: 160, letterSpacing: 2, fontSize: '1.25rem', fontWeight: 600 }}
            onClick={handleTest}>
            テスト
          </Button>
        </Box>
        <Box display="flex" justifyContent="center">
          <Button
            variant="contained"
            color="primary"
            sx={{ width: 160, letterSpacing: 2, fontSize: '1.25rem', fontWeight: 600 }}
            onClick={handleNew}>
            学習
          </Button>
          <Button
            variant="contained"
            color="primary"
            sx={{ width: 160, letterSpacing: 2, fontSize: '1.25rem', fontWeight: 600 }}
            onClick={handleReview}>
            復習
          </Button>
        </Box>
      </Box>
      {(() => {
        const dataRows = groupWords[activeGroup];

        if (!dataRows || dataRows.length === 0) return;

        return (
          <WordList
            list={dataRows}
            onDetail={handleDetail}
            onDelete={handleDelete}
            showDelete={displayCtrl[Consts.ShowTypes.REMOVE_WORD]}
          />
        );
      })()}
    </React.Fragment>
  );
};
