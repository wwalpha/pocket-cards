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
import PageviewIcon from '@mui/icons-material/Pageview';
import { styles } from './Students.style';
import { RootState } from 'typings';
import { StyledTableCell } from './Mainboard.style';

const appState = (state: RootState) => state.app;
const userState = (state: RootState) => state.user;

export default () => {
  const { students } = useSelector(userState);
  const { isLoading } = useSelector(appState);

  return (
    <Box sx={styles.root}>
      <Box sx={styles.users}>
        <TableContainer component={Paper}>
          <Table aria-label="customized table" size="small">
            <TableHead>
              <TableRow>
                <StyledTableCell sx={{ width: 100 }}></StyledTableCell>
                <StyledTableCell sx={{ width: 200 }}>Username</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map((dataRow) => (
                <TableRow key={dataRow.id}>
                  <TableCell>
                    <Box sx={styles.tools}>
                      <LoadingButton
                        loading={isLoading}
                        variant="contained"
                        color="secondary"
                        startIcon={<PageviewIcon />}
                        size="small"
                        sx={{ py: 0, mx: 0.5 }}
                        onClick={() => {}}>
                        View
                      </LoadingButton>
                    </Box>
                  </TableCell>
                  <TableCell>{dataRow.id}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Box sx={styles.infos}></Box>
    </Box>
  );
};
