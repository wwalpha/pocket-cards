import React, { FunctionComponent } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
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
  tableCell: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    width: 45 / 100,
  },
};
const table: FunctionComponent<QuestionTable> = ({ datas }) => {
  return (
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
          {datas.map((item) => (
            <TableRow hover key={item.id}>
              <TableCell>{item.id}</TableCell>
              <TableCell sx={styles.tableCell}>{item.title}</TableCell>
              <TableCell sx={styles.tableCell}>{item.answer}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

interface QuestionTable {
  datas: Group.Question[];
}

export default table;
