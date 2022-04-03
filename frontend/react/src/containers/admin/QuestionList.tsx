import React from 'react';
import { bindActionCreators } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Paper from '@mui/material/Paper';
import { AdminActions } from '@actions';
import { UploadButton } from '@components/buttons';
import { RootState } from 'typings';
import { StyledTableCell } from './Mainboard.style';

const groupState = (state: RootState) => state.group;
const appState = (state: RootState) => state.app;

export default () => {
  const history = useHistory();
  const actions = bindActionCreators(AdminActions, useDispatch());
  const { questions } = useSelector(groupState);
  const { isLoading } = useSelector(appState);

  const handleHistoryBack = () => {
    // back to prev screen
    history.goBack();
    // clear questions
    actions.clearQuestions();
  };

  const handleReadAsText = (texts: string) => {
    actions.uploadQuestions(texts);
  };

  return (
    <Box sx={{ m: 2, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
      <Box my={1} display="flex">
        <Button variant="contained" color="secondary" sx={{ width: 120, mr: 1 }} onClick={handleHistoryBack}>
          BACK
        </Button>
        <UploadButton loading={isLoading} variant="contained" sx={{ width: 120, mr: 1 }} readAsText={handleReadAsText}>
          Upload
        </UploadButton>
      </Box>
      <TableContainer component={Paper}>
        <Table aria-label="customized table" size="small">
          <TableHead>
            <TableRow>
              <StyledTableCell sx={{ width: 80 }}>ID</StyledTableCell>
              <StyledTableCell>Title</StyledTableCell>
              <StyledTableCell>Answer</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {questions.map((item) => (
              <TableRow hover key={item.id}>
                {/* <TableCell>
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
                    <Button
                      variant="contained"
                      color="secondary"
                      startIcon={<PageviewIcon />}
                      size="small"
                      sx={{ py: 0, mx: 0.5 }}
                      onClick={() => {
                        handleOnClick(item.id, Consts.EDIT_MODE.READONLY);
                      }}
                      component={React.forwardRef((props: any, ref: any) => (
                        <Link to={Paths.PATHS_ADMIN_GROUP_DETAILS} {...props} />
                      ))}>
                      View
                    </Button>
                  </Box>
                </TableCell> */}
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.title}</TableCell>
                <TableCell>{item.answer}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
