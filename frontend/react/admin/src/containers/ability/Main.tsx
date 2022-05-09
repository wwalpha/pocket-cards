import React from 'react';
import { bindActionCreators } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import LoadingButton from '@mui/lab/LoadingButton';
import { Consts } from '@constants';
import { GroupActions } from '@actions';
import { RootState, GroupEditForm } from 'typings';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import { StyledTableCell, styles } from './Main.style';

const groupState = (state: RootState) => state.group;
const appState = (state: RootState) => state.app;

export default () => {
  const history = useHistory();
  const actions = bindActionCreators(GroupActions, useDispatch());
  const { groups, editable } = useSelector(groupState);
  const { activeGroup } = useSelector(appState);
  const { isLoading } = useSelector(appState);

  // 選択中のGroup情報取得
  const groupInfo = groups.find((item) => item.id === activeGroup);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<GroupEditForm>({
    defaultValues: {
      id: groupInfo?.id,
      name: groupInfo?.name || '',
      description: groupInfo?.description || '',
      subject: groupInfo?.subject || '0',
    },
  });

  // 編集
  const onSubmit = handleSubmit((datas) => {
    if (editable === Consts.EDIT_MODE.EDIT) {
      actions.edit({
        id: activeGroup,
        name: datas.name,
        description: datas.description,
      });
    } else if (editable === Consts.EDIT_MODE.REGIST) {
      actions.regist({
        name: datas.name,
        description: datas.description,
        subject: datas.subject,
      });
    }
  });

  const handleBack = () => history.goBack();

  const displayGroups = groups.filter((item) => item.subject.length === 3);

  return (
    <Box sx={styles.root}>
      <TableContainer component={Paper}>
        <Table aria-label="customized table" size="small">
          <TableHead>
            <TableRow>
              <StyledTableCell sx={{ width: 100 }}></StyledTableCell>
              <StyledTableCell>Subject</StyledTableCell>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell>Description</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayGroups.map((dataRow) => (
              <TableRow key={dataRow.id}>
                <TableCell>
                  <Box sx={{ display: 'flex' }}>
                    <LoadingButton
                      loading={isLoading}
                      variant="contained"
                      color="secondary"
                      size="small"
                      sx={{ py: 0, mx: 0.5 }}>
                      View
                    </LoadingButton>
                  </Box>
                </TableCell>
                <TableCell sx={styles.tableCell}>
                  {(() => {
                    if (dataRow.subject === Consts.SUBJECT.ABILITY_SCIENCE) return '理科';
                    if (dataRow.subject === Consts.SUBJECT.ABILITY_SOCIETY) return '社会';
                  })()}
                </TableCell>
                <TableCell sx={styles.tableCell}>{dataRow.name}</TableCell>
                <TableCell sx={styles.tableCell}>{dataRow.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
