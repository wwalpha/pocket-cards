import React, { useEffect, useState } from 'react';
import { bindActionCreators } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Box, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import Button from '@components/buttons/Button';
import { WordList } from '@components/functions';
import { StudyActions, WordActions, RegistActions, GroupActions } from '@actions';
import { Paths, Consts } from '@constants';
import { Group, RootState } from 'typings';
import { useForm } from 'react-hook-form';

const groupState = (state: RootState) => state.group;
const appState = (state: RootState) => state.app;

export default () => {
  const actions = bindActionCreators(StudyActions, useDispatch());
  const wrdActions = bindActionCreators(WordActions, useDispatch());
  const regActions = bindActionCreators(RegistActions, useDispatch());
  const grpActions = bindActionCreators(GroupActions, useDispatch());
  const { activeGroup, groupWords, searchWord } = useSelector(groupState);
  const { displayCtrl } = useSelector(appState);
  const [open, setOpen] = useState<boolean>(false);
  const [dataRows, setDataRows] = useState<Group.WordDetails[]>([]);

  useEffect(() => {
    const datas = groupWords[activeGroup].filter((item) => item.id === searchWord.toLowerCase());

    setDataRows(datas);
  }, [groupWords, searchWord]);

  // 学習
  const handleNew = () => actions.startNew();
  // 復習
  const handleReview = () => actions.startReview();
  // テスト
  const handleTest = () => actions.startTest();

  // 詳細
  const handleDetail = (id: string) => wrdActions.detail(id);
  // 削除
  const handleDelete = (word: string) => wrdActions.deleteRow(activeGroup, word);
  // 状態
  const handleStatus = () => grpActions.status();

  // open dialog
  const handleOpen = () => setOpen(true);
  // close dialog
  const handleClose = () => setOpen(false);

  const { handleSubmit, reset, register } = useForm({
    mode: 'onChange',
  });

  const onSubmit = handleSubmit((datas) => {
    // close dialog
    setOpen(false);
    // clear
    reset();
    // regist word action
    regActions.manual(datas.newword);
  });

  return (
    <React.Fragment>
      <Box display="flex" flexDirection="column" alignItems="center" margin={1} height="128px">
        <Box display="flex" justifyContent="center">
          <Button
            variant="contained"
            color="primary"
            sx={{ width: '108px', letterSpacing: 2, fontSize: '1rem' }}
            onClick={handleOpen}>
            新規登録
          </Button>
          <Button
            variant="contained"
            color="primary"
            sx={{ width: '108px', letterSpacing: 2, fontSize: '1rem' }}
            // @ts-ignore
            component={Link}
            to={Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.Regist]}>
            一括登録
          </Button>
          <Button
            variant="contained"
            color="success"
            sx={{ width: '108px', letterSpacing: 2, fontSize: '1rem' }}
            onClick={handleStatus}>
            詳細情報
          </Button>
        </Box>
        <Box display="flex" justifyContent="center">
          <Button
            variant="contained"
            color="primary"
            sx={{ width: '108px', letterSpacing: 2, fontSize: '1rem' }}
            onClick={handleNew}>
            学習
          </Button>
          <Button
            variant="contained"
            color="primary"
            sx={{ width: '108px', letterSpacing: 2, fontSize: '1rem' }}
            onClick={handleReview}>
            復習
          </Button>
          <Button
            variant="contained"
            color="success"
            sx={{ width: '108px', letterSpacing: 2, fontSize: '1rem' }}
            onClick={handleTest}>
            テスト
          </Button>
        </Box>
      </Box>
      {(() => {
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
      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={onSubmit}>
          <DialogTitle>新規単語追加</DialogTitle>
          <DialogContent>
            <TextField id="newword" autoFocus variant="standard" margin="dense" fullWidth {...register('newword')} />
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="error" onClick={handleClose}>
              取消
            </Button>
            <Button variant="contained" color="primary" type="submit">
              登録
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </React.Fragment>
  );
};
