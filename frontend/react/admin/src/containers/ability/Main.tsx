import React, { useState } from 'react';
import { bindActionCreators } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PageviewIcon from '@mui/icons-material/Pageview';
import DeleteIcon from '@mui/icons-material/Delete';
import { StyledTableCell, styles } from './Main.style';
import { LoadingIconButton } from '@components/buttons';
import ConfirmDialog from '@components/dialogs/ConfirmDialog';
import { Consts, ROUTE_PATHS } from '@constants';
import { GroupActions, UserActions } from '@actions';
import { RootState } from 'typings';

const groupState = (state: RootState) => state.group;
const appState = (state: RootState) => state.app;
const userState = (state: RootState) => state.user;

export default () => {
  const usrActions = bindActionCreators(UserActions, useDispatch());
  const grpActions = bindActionCreators(GroupActions, useDispatch());
  const { groups, editable } = useSelector(groupState);
  const { curriculums, activeStudent } = useSelector(userState);
  const { isLoading } = useSelector(appState);

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

  const handleClose = () => setOpen(false);

  const handleConfirm = () => {
    if (curriculumId) {
      handleCancel(curriculumId);
    } else {
      handleApply(groupId);
    }

    setOpen(false);
  };

  const handleOnDelete = (id: string) => {
    setGroupId(id);
    setOpen(true);
  };

  const handleOnView = (groupId: string) => {
    // const path = ROUTE_PATHS.ABILITIES_QUESTIONS(groupId);
    // 質問リスト取得
    // grpActions.questionList(groupId, path);
  };

  const handleGroupDelete = () => {
    grpActions.remove(groupId);
    // grpActions
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
                    {(() => {
                      const item = curriculumItems.find((item) => item.groupId === dataRow.id);
                      const icon = !item ? (
                        <CheckCircleIcon sx={{ fontSize: 32 }} />
                      ) : (
                        <CancelIcon sx={{ fontSize: 32 }} />
                      );
                      const color = item ? 'error' : 'success';

                      if (editable === Consts.EDIT_MODE.EDIT) {
                        return (
                          <LoadingIconButton
                            disabled={item !== undefined}
                            loading={isLoading}
                            sx={{ p: 0.5 }}
                            color="error"
                            onClick={() => {
                              handleOnDelete(dataRow.id);
                            }}
                          >
                            <DeleteIcon sx={{ fontSize: 32 }} />
                          </LoadingIconButton>
                        );
                      }

                      if (editable !== Consts.EDIT_MODE.EDIT) {
                        return (
                          <React.Fragment>
                            <LoadingIconButton
                              loading={isLoading}
                              sx={{ p: 0.5 }}
                              onClick={() => {
                                handleOnView(dataRow.id);
                              }}
                            >
                              <PageviewIcon sx={{ fontSize: 32 }} />
                            </LoadingIconButton>
                            <LoadingIconButton
                              sx={{ p: 0.5 }}
                              loading={isLoading}
                              color={color}
                              onClick={() => {
                                setGroupId(dataRow.id);
                                setCurriculumId(item?.id);
                                setOpen(true);
                              }}
                            >
                              {icon}
                            </LoadingIconButton>
                          </React.Fragment>
                        );
                      }
                    })()}
                  </Box>
                </TableCell>
                <TableCell sx={styles.tableCell}></TableCell>
                <TableCell sx={styles.tableCell}>{dataRow.name}</TableCell>
                <TableCell sx={styles.tableCell}>{dataRow.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {editable === Consts.EDIT_MODE.EDIT ? (
        <ConfirmDialog
          open={open}
          message="削除しますか？"
          onClose={handleClose}
          onConfirm={handleGroupDelete}
          maxWidth="md"
        />
      ) : (
        <ConfirmDialog
          open={open}
          message={`カリキュラムを${curriculumId ? '解除' : '適用'}しますか？`}
          onClose={handleClose}
          onConfirm={handleConfirm}
          maxWidth="md"
        />
      )}
    </Box>
  );
};
