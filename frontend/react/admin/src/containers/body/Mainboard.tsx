import React, { useState } from 'react';
import { bindActionCreators } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Paper from '@mui/material/Paper';
import LoadingButton from '@mui/lab/LoadingButton';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PageviewIcon from '@mui/icons-material/Pageview';
import EditIcon from '@mui/icons-material/Edit';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { AppActions, GroupActions, UserActions } from '@actions';
import { Paths, Consts } from '@constants';
import { RootState } from 'typings';
import { StyledTableCell, styles } from './Mainboard.style';
import { Link } from 'react-router-dom';

const groupState = (state: RootState) => state.group;
const appState = (state: RootState) => state.app;
const userState = (state: RootState) => state.user;

export default () => {
  const actions = bindActionCreators(AppActions, useDispatch());
  const grpActions = bindActionCreators(GroupActions, useDispatch());
  const usrActions = bindActionCreators(UserActions, useDispatch());

  const { groups } = useSelector(groupState);
  const { isLoading, activeSubject, authority } = useSelector(appState);
  const { curriculums, activeStudent } = useSelector(userState);
  const [open, setOpen] = useState(false);
  const [curriculumId, setCurriculumId] = useState<string | undefined>(undefined);
  const [groupId, setGroupId] = useState('');

  // get question list
  const handleApply = (groupId: string) => {
    usrActions.curriculumRegist(groupId);
  };
  // get question list
  const handleCancel = (id: string) => {
    usrActions.curriculumRemove(id);
  };

  // get question list
  const handleQuestions = (groupId: string) => {
    // select group
    actions.activeGroup(groupId);
    // 質問リスト取得
    grpActions.questionList();
  };

  const handleClose = () => setOpen(false);

  const handleConfirm = () => {
    if (curriculumId) {
      handleCancel(curriculumId);
    } else {
      handleApply(groupId);
    }

    setOpen(false);
  };

  // Folder click
  const handleEdit = (groupId: string, editable: Consts.EDIT_MODE) => {
    // 選択値を保存する
    actions.activeGroup(groupId);
    // 編集モード
    grpActions.editable(editable);
  };

  const displayGroups = groups.filter((item) => item.subject === activeSubject);
  const curriculumItems = curriculums.filter((item) => item.userId === activeStudent);

  return (
    <Box sx={styles.root}>
      <TableContainer component={Paper}>
        <Table aria-label="customized table" size="small">
          <TableHead>
            <TableRow>
              <StyledTableCell sx={{ width: 100 }}></StyledTableCell>
              <StyledTableCell>Title</StyledTableCell>
              <StyledTableCell>Description</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayGroups.map((dataRow) => (
              <TableRow key={dataRow.id}>
                <TableCell>
                  <Box sx={{ display: 'flex' }}>
                    <LoadingButton
                      disabled={authority !== Consts.Authority.ADMIN && dataRow.count === 0}
                      loading={isLoading}
                      variant="contained"
                      color="secondary"
                      startIcon={<PageviewIcon />}
                      size="small"
                      sx={{ py: 0, mx: 0.5 }}
                      onClick={() => {
                        handleQuestions(dataRow.id);
                      }}>
                      View
                    </LoadingButton>
                    {(() => {
                      if (authority !== Consts.Authority.PARENT) return;

                      const item = curriculumItems.find((item) => item.groupId === dataRow.id);
                      const label = !item ? 'Apply' : 'Cancel';
                      const icon = !item ? <CheckCircleIcon /> : <HighlightOffIcon />;
                      const color = item ? 'info' : 'primary';

                      return (
                        <LoadingButton
                          loading={isLoading}
                          variant="contained"
                          color={color}
                          startIcon={icon}
                          size="small"
                          sx={{ py: 0, mx: 0.5, width: 100 }}
                          onClick={() => {
                            setGroupId(dataRow.id);
                            setCurriculumId(item?.id);
                            setOpen(true);
                          }}>
                          {label}
                        </LoadingButton>
                      );
                    })()}
                    {authority === Consts.Authority.ADMIN && (
                      <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<EditIcon />}
                        size="small"
                        sx={{ py: 0, mx: 0.5 }}
                        onClick={() => {
                          handleEdit(dataRow.id, Consts.EDIT_MODE.EDIT);
                        }}
                        component={React.forwardRef((props: any, ref: any) => (
                          <Link to={Paths.PATHS_GROUP_LIST} {...props} />
                        ))}>
                        Edit
                      </Button>
                    )}
                  </Box>
                </TableCell>
                <TableCell sx={styles.tableCell}>{dataRow.name}</TableCell>
                <TableCell sx={styles.tableCell}>{dataRow.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={handleClose} maxWidth="md">
        <DialogTitle id="alert-dialog-title">カリキュラム</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            カリキュラムを{curriculumId ? '解除' : '適用'}しますか？
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleConfirm} autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
