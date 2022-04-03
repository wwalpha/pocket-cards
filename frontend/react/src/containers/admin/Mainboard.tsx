import React from 'react';
import { bindActionCreators } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Paper from '@mui/material/Paper';
import LoadingButton from '@mui/lab/LoadingButton';
import EditIcon from '@mui/icons-material/Edit';
import PageviewIcon from '@mui/icons-material/Pageview';
import { AdminActions } from '@actions';
import { Paths, Consts } from '@constants';
import { RootState } from 'typings';
import { StyledTableCell } from './Mainboard.style';

const groupState = (state: RootState) => state.group;
const appState = (state: RootState) => state.app;

export default () => {
  const actions = bindActionCreators(AdminActions, useDispatch());
  const { groups } = useSelector(groupState);
  const { isLoading } = useSelector(appState);

  // Folder click
  const handleOnClick = (groupId: string, editable: Consts.EDIT_MODE) => {
    // 選択値を保存する
    actions.selectGroup(groupId);
    // 編集モード
    actions.editable(editable);
  };

  // get question list
  const handleQuestions = (groupId: string) => {
    // 選択値を保存する
    actions.selectGroup(groupId);
    // 質問リスト取得
    actions.questionList();
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Box sx={{ m: 2, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <Box sx={{ display: 'flex', flexDirection: 'row-reverse', mx: 2, my: 1 }}>
          <Button variant="contained" color="secondary">
            ＋
          </Button>
        </Box>
        <TableContainer component={Paper}>
          <Table aria-label="customized table" size="small">
            <TableHead>
              <TableRow>
                <StyledTableCell sx={{ width: 80 }}></StyledTableCell>
                <StyledTableCell>ID</StyledTableCell>
                <StyledTableCell>Title</StyledTableCell>
                <StyledTableCell>Description</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {groups.map((item) => (
                <TableRow hover key={item.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex' }}>
                      <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<EditIcon />}
                        size="small"
                        sx={{ py: 0, mx: 0.5 }}
                        onClick={() => {
                          handleOnClick(item.id, Consts.EDIT_MODE.EDIT);
                        }}
                        component={React.forwardRef((props: any, ref: any) => (
                          <Link to={Paths.PATHS_ADMIN_GROUP_DETAILS} {...props} />
                        ))}>
                        Edit
                      </Button>
                      <LoadingButton
                        loading={isLoading}
                        variant="contained"
                        color="secondary"
                        startIcon={<PageviewIcon />}
                        size="small"
                        sx={{ py: 0, mx: 0.5 }}
                        onClick={() => {
                          handleQuestions(item.id);
                        }}
                        component={React.forwardRef((props: any, ref: any) => (
                          <Link to={Paths.PATHS_ADMIN_GROUP_QUESTIONS} {...props} />
                        ))}>
                        View
                      </LoadingButton>
                    </Box>
                  </TableCell>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};
