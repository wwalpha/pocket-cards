import React from 'react';
import { bindActionCreators } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Paper from '@mui/material/Paper';
import FolderIcon from '@mui/icons-material/Folder';
import { GroupActions } from '@actions';
import { Paths } from '@constants';
import { RootState } from 'typings';
import { StyledTableCell, StyledTableRow } from './GroupList.style';

const groupState = (state: RootState) => state.group;

function createData(name: string, calories: number, fat: number, carbs: number, protein: number) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];

export default () => {
  const dispatch = useDispatch();
  const actions = bindActionCreators(GroupActions, dispatch);
  const { groups } = useSelector(groupState);

  // Folder click
  const handleOnClick = (groupId: string) => {};

  console.log(1234);

  return (
    <Box sx={{ mt: 10, display: 'flex', flexDirection: 'column', width: `calc(100% - 480px)` }}>
      <Box sx={{ display: 'flex', flexDirection: 'row-reverse', mx: 2, my: 1 }}>
        <Button variant="contained" color="secondary">
          ＋
        </Button>
      </Box>
      <Box sx={{ display: 'flex', mx: 2 }}>
        <TableContainer component={Paper}>
          <Table aria-label="customized table" size="small">
            <TableHead>
              <TableRow>
                <StyledTableCell>Title</StyledTableCell>
                <StyledTableCell>Description</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow hover key={row.name} sx={{ cursor: 'pointer' }}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.calories}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};
