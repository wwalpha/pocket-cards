import React, { useEffect, useState } from 'react';
import { bindActionCreators } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PageviewIcon from '@mui/icons-material/Pageview';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
import ConfirmDialog from '@components/dialogs/ConfirmDialog';
import { LoadingIconButton } from '@components/buttons';
import { AppActions, GroupActions, UserActions } from '@actions';
import { ROUTE_PATHS, Consts } from '@constants';
import { GroupParams, RootState } from 'typings';
import { StyledTableCell, styles } from './Mainboard.style';
import { Link, useParams } from 'react-router-dom';

const groupState = (state: RootState) => state.group;
const appState = (state: RootState) => state.app;
const userState = (state: RootState) => state.user;

export default () => {
  const grpActions = bindActionCreators(GroupActions, useDispatch());
  const usrActions = bindActionCreators(UserActions, useDispatch());

  const { subject = Consts.SUBJECT.JAPANESE } = useParams<GroupParams>();
  const { groups } = useSelector(groupState);
  const { isLoading, authority } = useSelector(appState);
  const { curriculums, activeStudent } = useSelector(userState);
  const [open, setOpen] = useState(false);
  const [curriculumId, setCurriculumId] = useState<string | undefined>(undefined);
  const [groupId, setGroupId] = useState('');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);

  useEffect(() => {
    setRowsPerPage(50);
    // setPage(0);
    return;
  }, [subject]);

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
    const path = ROUTE_PATHS.GROUP_QUESTIONS(subject, groupId);
    // 質問リスト取得
    grpActions.questionList(groupId, path);
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
    // 編集モード
    grpActions.editable(editable);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const displayGroups = groups.filter((item) => item.subject === subject);
  const curriculumItems = curriculums.filter((item) => item.userId === activeStudent);

  return (
    <Box sx={styles.root}>
      <Paper>
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
              {displayGroups.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((dataRow) => (
                <TableRow key={dataRow.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex' }}>
                      <LoadingIconButton
                        loading={isLoading}
                        sx={{ p: 0.5 }}
                        onClick={() => {
                          handleQuestions(dataRow.id);
                        }}
                      >
                        <PageviewIcon sx={{ fontSize: 32 }} />
                      </LoadingIconButton>
                      {(() => {
                        if (authority !== Consts.Authority.PARENT) return;

                        const item = curriculumItems.find((item) => item.groupId === dataRow.id);
                        const icon = !item ? (
                          <CheckCircleIcon sx={{ fontSize: 32 }} />
                        ) : (
                          <CancelIcon sx={{ fontSize: 32 }} />
                        );
                        const color = item ? 'error' : 'success';

                        return (
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
                        );
                      })()}
                      {authority === Consts.Authority.ADMIN && (
                        <LoadingIconButton
                          sx={{ p: 0.5 }}
                          loading={isLoading}
                          onClick={() => {
                            handleEdit(dataRow.id, Consts.EDIT_MODE.EDIT);
                          }}
                          component={React.forwardRef((props: any, ref: any) => (
                            <Link to={ROUTE_PATHS.GROUP_EDIT(subject, dataRow.id)} {...props} />
                          ))}
                        >
                          <EditIcon sx={{ fontSize: 32 }} />
                        </LoadingIconButton>
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
        {displayGroups.length > 0 && (
          <TablePagination
            rowsPerPageOptions={[25, 50, 100]}
            component="div"
            count={displayGroups.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}
      </Paper>

      <ConfirmDialog
        open={open}
        maxWidth="md"
        message={`カリキュラムを${curriculumId ? '解除' : '適用'}しますか？`}
        onClose={handleClose}
        onConfirm={handleConfirm}
      />
    </Box>
  );
};
