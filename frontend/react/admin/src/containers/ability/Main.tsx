import React, { useState } from 'react';
import { bindActionCreators } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { StyledTableCell, styles } from './Main.style';
import { Consts } from '@constants';
import { UserActions } from '@actions';
import { RootState } from 'typings';

const groupState = (state: RootState) => state.group;
const appState = (state: RootState) => state.app;
const userState = (state: RootState) => state.user;

export default () => {
  const actions = bindActionCreators(UserActions, useDispatch());
  const { groups, editable } = useSelector(groupState);
  const { curriculums, activeStudent } = useSelector(userState);
  const { activeGroup, isLoading, authority } = useSelector(appState);

  const [open, setOpen] = useState(false);
  const [curriculumId, setCurriculumId] = useState<string | undefined>(undefined);
  const [groupId, setGroupId] = useState('');

  // get question list
  const handleApply = (groupId: string) => {
    actions.curriculumRegist(groupId);
  };
  // get question list
  const handleCancel = (id: string) => {
    actions.curriculumRemove(id);
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

  const displayGroups = groups.filter((item) => item.subject.length === 3);
  const curriculumItems = curriculums.filter((item) => item.userId === activeStudent);

  return (
    <Box sx={styles.root}>
      <TableContainer component={Paper}>
        <Table aria-label="customized table" size="small">
          <TableHead>
            <TableRow>
              <StyledTableCell sx={{ width: 100 }}></StyledTableCell>
              <StyledTableCell>Subject</StyledTableCell>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell>Description</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayGroups.map((dataRow) => (
              <TableRow key={dataRow.id}>
                <TableCell>
                  <Box sx={{ display: 'flex' }}>
                    <LoadingButton
                      loading={isLoading}
                      variant="contained"
                      color="secondary"
                      size="small"
                      sx={{ py: 0, mx: 0.5 }}>
                      View
                    </LoadingButton>
                    {(() => {
                      if (authority !== Consts.Authority.PARENT) return;

                      const item = curriculumItems.find((item) => item.groupId === dataRow.id);
                      const label = !item ? 'Study' : 'Cancel';
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
                  </Box>
                </TableCell>
                <TableCell sx={styles.tableCell}>
                  {(() => {
                    if (dataRow.subject === Consts.SUBJECT.ABILITY_SCIENCE) return '理科';
                    if (dataRow.subject === Consts.SUBJECT.ABILITY_SOCIETY) return '社会';
                  })()}
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
