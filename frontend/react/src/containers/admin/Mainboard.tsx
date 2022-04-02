import React, { useState } from 'react';
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
import { RootState, Tables } from 'typings';
import { StyledTableCell } from './Mainboard.style';
import { RightPanel } from '.';

const groupState = (state: RootState) => state.group;

export default () => {
  const dispatch = useDispatch();
  const actions = bindActionCreators(GroupActions, dispatch);
  const [selectedGroup, setSelectedGroup] = useState<Tables.TGroups>();
  const { groups } = useSelector(groupState);

  // Folder click
  const handleOnClick = (item: Tables.TGroups) => {
    // is selected
    setSelectedGroup(item);
  };

  return (
    <Box sx={{ mt: 10, display: 'flex', width: `calc(100% - 200px)` }}>
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
                <StyledTableCell>Title</StyledTableCell>
                <StyledTableCell>Description</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {groups.map((item) => (
                <TableRow
                  hover
                  key={item.id}
                  sx={{ cursor: 'pointer' }}
                  onClick={() => {
                    handleOnClick(item);
                  }}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      {(() => {
        if (selectedGroup) {
          return <RightPanel />;
        }
      })()}
    </Box>
  );
};
