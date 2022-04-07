import React from 'react';
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
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PageviewIcon from '@mui/icons-material/Pageview';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { GuardianActions, AdminActions } from '@actions';
import { Paths, Consts } from '@constants';
import { RootState } from 'typings';
import { StyledTableCell } from './Mainboard.style';

const groupState = (state: RootState) => state.group;
const appState = (state: RootState) => state.app;
const userState = (state: RootState) => state.user;

export default () => {
  const actions = bindActionCreators(GuardianActions, useDispatch());
  const adminActions = bindActionCreators(AdminActions, useDispatch());
  const { groups } = useSelector(groupState);
  const { isLoading, activeSubject } = useSelector(appState);
  const { curriculums } = useSelector(userState);

  // get question list
  const handleApply = (groupId: string) => {
    actions.curriculumRegist(groupId);
  };
  // get question list
  const handleCancel = (id: string) => {
    actions.curriculumRemove(id);
  };

  // get question list
  const handleQuestions = (groupId: string) => {
    // 選択値を保存する
    adminActions.selectGroup(groupId);
    // 質問リスト取得
    actions.questionList();
  };

  const displayGroups = groups.filter((item) => item.subject === activeSubject);

  return (
    <Box sx={{ display: 'flex' }}>
      <Box sx={{ my: 2, mx: 3, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <TableContainer component={Paper}>
          <Table aria-label="customized table" size="small">
            <TableHead>
              <TableRow>
                <StyledTableCell sx={{ width: 100 }}></StyledTableCell>
                <StyledTableCell>ID</StyledTableCell>
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
                        const item = curriculums.find((item) => item.groupId === dataRow.id);
                        const label = !item ? 'Apply' : 'Cancel';
                        const func = !item ? handleApply : handleCancel;
                        const icon = !item ? <CheckCircleIcon /> : <HighlightOffIcon />;
                        const color = item ? 'info' : 'primary';
                        const id = item ? item.id : dataRow.id;

                        return (
                          <LoadingButton
                            loading={isLoading}
                            variant="contained"
                            color={color}
                            startIcon={icon}
                            size="small"
                            sx={{ py: 0, mx: 0.5, width: 100 }}
                            onClick={() => {
                              func(id);
                            }}>
                            {label}
                          </LoadingButton>
                        );
                      })()}
                    </Box>
                  </TableCell>
                  <TableCell>{dataRow.id}</TableCell>
                  <TableCell>{dataRow.name}</TableCell>
                  <TableCell>{dataRow.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};
