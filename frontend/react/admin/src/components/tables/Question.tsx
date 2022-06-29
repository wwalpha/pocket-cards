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
    width: 'calc(100vw - 232px)',
  },
  tableCell: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: 'inline-block',
    maxWidth: '450px',
  },
};

const table: FunctionComponent<QuestionTable> = ({ datas, onEdit }) => {
  return (
    <TableContainer component={Paper} sx={styles.container}>
      <Table aria-label="customized table" size="small">
        <TableHead>
          <TableRow>
            <StyledTableCell sx={{ width: 32 }}>No.</StyledTableCell>
            {onEdit && <StyledTableCell sx={{ width: 80 }}></StyledTableCell>}
            <StyledTableCell>Title</StyledTableCell>
            <StyledTableCell>Choices</StyledTableCell>
            <StyledTableCell>Answer</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {datas.map((item, idx) => (
            <TableRow hover key={idx}>
              <TableCell>{idx + 1}</TableCell>
              {onEdit && <StyledTableCell></StyledTableCell>}
              <TableCell>
                <Box component="span" sx={styles.tableCell}>
                  {item.title}
                </Box>
              </TableCell>
              <TableCell>
                <Box component="span" sx={styles.tableCell}>
                  {item.choices?.join('|')}
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
  datas: Group.Question[];
  onEdit?: () => void;
}

export default table;
