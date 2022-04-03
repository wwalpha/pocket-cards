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
import EditIcon from '@mui/icons-material/Edit';
import PageviewIcon from '@mui/icons-material/Pageview';
import { GroupActions } from '@actions';
import { Paths } from '@constants';
import { RootState } from 'typings';
import { StyledTableCell } from './Mainboard.style';

const groupState = (state: RootState) => state.group;

export default () => {
  const dispatch = useDispatch();
  const actions = bindActionCreators(GroupActions, useDispatch());
  const { groups } = useSelector(groupState);

  // Folder click
  const handleOnClick = (groupId: string) => {
    // 選択値を保存する
    actions.selectGroup(groupId);
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
                          handleOnClick(item.id);
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
                          handleOnClick(item.id);
                        }}
                        component={React.forwardRef((props: any, ref: any) => (
                          <Link to={Paths.PATHS_ADMIN_GROUP_DETAILS} {...props} />
                        ))}>
                        View
                      </Button>
                    </Box>
                    {/* <IconButton color="secondary" sx={{ p: 0, px: 0.5 }}>
                      <EditIcon />
                    </IconButton> */}
                    {/* <IconButton color="secondary" sx={{ p: 0, px: 0.5 }}>
                      <PageviewIcon />
                    </IconButton> */}
                  </TableCell>
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
