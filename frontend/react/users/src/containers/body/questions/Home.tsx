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
import { ROUTE_PATHS, Consts } from '@constants';
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

  // 詳細
  const handleDetail = (details: Group.WordSimple) => wrdActions.detail(details);
  // 削除
  const handleDelete = (details: Group.WordSimple) => wrdActions.deleteRow(details);

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

  const group = groups.find((item) => item.id === activeGroup);

  return (
    <React.Fragment>
      <Box display="flex" justifyContent="center" bgcolor="#4caf50" p={1} color="white">
        <span>
          {group?.name} ({group?.subject})
        </span>
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
    </React.Fragment>
  );
};
