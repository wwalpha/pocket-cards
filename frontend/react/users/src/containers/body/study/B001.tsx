import React, { useEffect, useState } from 'react';
import { bindActionCreators } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
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
  const { groups, activeGroup, groupWords, searchWord } = useSelector(groupState);
  const { displayCtrl } = useSelector(appState);
  const [open, setOpen] = useState<boolean>(false);
  const [dataRows, setDataRows] = useState<Group.WordSimple[]>([]);

  useEffect(() => {
    if (Object.keys(groupWords).includes(activeGroup)) {
      const items = groupWords[activeGroup];

      if (searchWord.trim().length === 0) {
        setDataRows(items);
      } else {
        setDataRows(items.filter((item) => item.id.indexOf(searchWord.toLowerCase()) !== -1));
      }
    }
  }, [activeGroup, groupWords, searchWord]);

  // 学習
  const handleNew = () => actions.startStudy(Consts.MODES.New);
  // 復習
  const handleReview = () => actions.startStudy(Consts.MODES.Review);
  // テスト
  const handleTest = () => actions.startStudy(Consts.MODES.AllTest);

  // 詳細
  const handleDetail = (details: Group.WordSimple) => wrdActions.detail(details);
  // 削除
  const handleDelete = (details: Group.WordSimple) => wrdActions.deleteRow(details);
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
      <Box display="flex" justifyContent="center" bgcolor="#4caf50" p={1} color="white">
        <span>{groups.find((item) => item.id === activeGroup)?.name}</span>
      </Box>
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
