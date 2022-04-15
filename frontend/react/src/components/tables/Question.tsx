import React, { FunctionComponent } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import { Group } from 'typings';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const styles = {
  container: {
    width: 'calc(100vw - 200px)',
  },
  tableCell: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: 'inline-block',
    width: 95 / 100,
  },
};

const table: FunctionComponent<QuestionTable> = ({ datas }) => {
  return (
    <TableContainer component={Paper} sx={styles.container}>
      <Table aria-label="customized table" size="small">
        <TableHead>
          <TableRow>
            <StyledTableCell sx={{ width: 32 }}>No.</StyledTableCell>
            <StyledTableCell sx={{ width: 80 }}>ID</StyledTableCell>
            <StyledTableCell>Title</StyledTableCell>
            <StyledTableCell>Answer</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {datas.map((item, idx) => (
            <TableRow hover key={idx}>
              <TableCell>{idx + 1}</TableCell>
              <TableCell>{item.id}</TableCell>
              <TableCell>
                <Box component="span" sx={styles.tableCell}>
                  {item.title}
                </Box>
              </TableCell>
              <TableCell>
                <Box component="span" sx={styles.tableCell}>
                  {item.answer}
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

interface QuestionTable {
  datas: Partial<Group.Question>[];
}

export default table;
