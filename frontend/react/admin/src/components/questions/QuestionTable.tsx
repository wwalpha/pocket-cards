import React, { FunctionComponent } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TablePagination from '@mui/material/TablePagination';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import { styled } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DriveFileMoveIcon from '@mui/icons-material/DriveFileMove';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ConfirmDialog from '@components/dialogs/ConfirmDialog';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { LoadingIconButton } from '@components/buttons';
import QuestionDetails from './QuestionDetails';
import QuestionTransfer from './QuestionTransfer';
import { Group, QuestionForm, QuestionTransferForm, Tables } from 'typings';
import { Consts } from '@constants';

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
    width: '350px',
  },
  iconCell: { display: 'flex' },
};

const table: FunctionComponent<QuestionTable> = ({
  datas,
  subject,
  groups,
  loading,
  onSubmit,
  onDelete,
  onIgnore,
  onTransfer,
}) => {
  const [open, setOpen] = React.useState(Consts.DIALOG_STATUS.CLOSE);
  const [deleteFlag, setDeleteFlag] = React.useState(false);
  const [ignoreFlag, setIgnoreFlag] = React.useState(false);
  const [isSelectAll, setSelectAll] = React.useState(false);
  const [index, setIndex] = React.useState(-1);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(100);
  const [checkValues, setCheckValues] = React.useState<Set<number>>(new Set());

  /** popup close */
  const handleClose = () => {
    setOpen(Consts.DIALOG_STATUS.CLOSE);
    setDeleteFlag(false);
    setIgnoreFlag(false);
  };

  /** edit open */
  const handleEditClick = (index: number) => {
    setIndex(page * rowsPerPage + index);
    setOpen(Consts.DIALOG_STATUS.EDIT);
  };

  /** delete button click */
  const handleDeleteClick = (index: number) => {
    setIndex(page * rowsPerPage + index);
    setDeleteFlag(true);
  };

  /** ignore button click */
  const handleIgnoreClick = (index: number) => {
    setIndex(page * rowsPerPage + index);
    setIgnoreFlag(true);
  };

  const handleSelectAll = () => {
    setSelectAll(!isSelectAll);

    if (!isSelectAll) {
      setCheckValues(new Set());
    }
  };

  const handleOpenTransfer = () => {
    setOpen(Consts.DIALOG_STATUS.TRANSFER);
  };

  const handleTransfering = (form: QuestionTransferForm) => {
    setOpen(Consts.DIALOG_STATUS.CLOSE);
    setSelectAll(false);
    setCheckValues(new Set());

    onTransfer?.(
      form.groupId,
      form.newGroupId,
      Array.from(checkValues).map((index) => datas[index].id)
    );
  };

  const handleOnCheck = (index: number) => {
    let newArray = Array.from(checkValues);
    const newIndex = page * rowsPerPage + index;

    if (newArray.includes(newIndex)) {
      newArray = newArray.splice(newArray.indexOf(newIndex), 1);
    } else {
      newArray.push(newIndex);
    }

    setCheckValues(new Set(newArray));
  };

  const handleOnDelete = () => {
    onDelete?.(index);
    setDeleteFlag(false);
  };

  const handleOnIgnore = () => {
    onIgnore?.(index);
    setIgnoreFlag(false);
  };

  const handleDialogClick = (datas: QuestionForm) => {
    onSubmit?.(datas as QuestionForm);

    setOpen(Consts.DIALOG_STATUS.CLOSE);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const dataRow = index !== -1 ? datas[index] : undefined;
  const hasChoices = datas.filter((item) => item.choices !== undefined).length > 0;

  return (
    <React.Fragment>
      <Paper sx={{ mx: 2, mt: 1 }}>
        {onSubmit && (
          <Box display="flex" sx={{ m: 0.5 }}>
            <LoadingIconButton
              sx={{ p: 0.5 }}
              loading={loading}
              color={isSelectAll ? 'error' : undefined}
              onClick={handleSelectAll}
            >
              <CheckBoxIcon sx={{ fontSize: 32 }} />
            </LoadingIconButton>
            <LoadingIconButton sx={{ p: 0.5 }} loading={loading} disabled={!isSelectAll} onClick={handleOpenTransfer}>
              <DriveFileMoveIcon sx={{ fontSize: 32 }} />
            </LoadingIconButton>
          </Box>
        )}
        <TableContainer component={Paper} sx={styles.container}>
          <Table aria-label="customized table" size="small">
            <TableHead>
              <TableRow>
                <StyledTableCell sx={{ width: 32 }}>No.</StyledTableCell>
                {onSubmit && <StyledTableCell></StyledTableCell>}
                <StyledTableCell>Title</StyledTableCell>
                {hasChoices && <StyledTableCell>Choices</StyledTableCell>}
                <StyledTableCell>Answer</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {datas.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, idx) => (
                <TableRow hover key={idx}>
                  <TableCell>{idx + 1}</TableCell>
                  {onSubmit && (
                    <StyledTableCell>
                      <Box sx={styles.iconCell}>
                        {isSelectAll && (
                          <Checkbox
                            checked={checkValues.has(page * rowsPerPage + idx)}
                            onClick={() => {
                              handleOnCheck(idx);
                            }}
                          />
                        )}
                        <LoadingIconButton
                          loading={loading}
                          sx={{ p: 0.5 }}
                          color="error"
                          onClick={() => {
                            handleDeleteClick(idx);
                          }}
                        >
                          <DeleteIcon sx={{ fontSize: 32 }} />
                        </LoadingIconButton>
                        {onIgnore && (
                          <LoadingIconButton
                            sx={{ p: 0.5 }}
                            color="error"
                            loading={loading}
                            onClick={() => {
                              handleIgnoreClick(idx);
                            }}
                          >
                            <VisibilityOffIcon sx={{ fontSize: 32 }} />
                          </LoadingIconButton>
                        )}
                        <LoadingIconButton
                          sx={{ p: 0.5 }}
                          loading={loading}
                          onClick={() => {
                            handleEditClick(idx);
                          }}
                        >
                          <EditIcon sx={{ fontSize: 32 }} />
                        </LoadingIconButton>
                      </Box>
                    </StyledTableCell>
                  )}
                  <TableCell>
                    <Box component="span" sx={styles.tableCell}>
                      {item.title}
                    </Box>
                  </TableCell>
                  {hasChoices && (
                    <TableCell>
                      <Box component="span" sx={styles.tableCell}>
                        {item.choices?.join('|')}
                      </Box>
                    </TableCell>
                  )}
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
        {datas.length > 0 && (
          <TablePagination
            rowsPerPageOptions={[25, 50, 100]}
            component="div"
            count={datas.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}
      </Paper>
      <ConfirmDialog
        open={deleteFlag}
        message="削除してよろしいでしょうか？"
        onClose={handleClose}
        onConfirm={handleOnDelete}
        maxWidth="md"
      />
      {onIgnore && (
        <ConfirmDialog
          open={ignoreFlag}
          message="無視してよろしいでしょうか？"
          onClose={handleClose}
          onConfirm={handleOnIgnore}
          maxWidth="md"
        />
      )}
      <Dialog open={open !== Consts.DIALOG_STATUS.CLOSE} onClose={handleClose} maxWidth="lg">
        <DialogTitle>問題移動</DialogTitle>
        <DialogContent>
          {(() => {
            // editing
            if (dataRow && open === Consts.DIALOG_STATUS.EDIT) {
              return (
                <QuestionDetails
                  loading={loading}
                  dataRow={dataRow}
                  subject={subject}
                  onClose={handleClose}
                  onClick={handleDialogClick}
                />
              );
            }

            if (open === Consts.DIALOG_STATUS.TRANSFER) {
              return (
                <QuestionTransfer
                  groupId={datas[0].groupId}
                  groups={groups?.filter((item) => item.subject === datas[0].subject)}
                  onClose={handleClose}
                  onClick={handleTransfering}
                />
              );
            }
          })()}
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};

interface QuestionTable {
  loading?: boolean;
  datas: Group.Question[];
  subject?: string;
  groups?: Tables.TGroups[];
  onSubmit?: (datas: QuestionForm) => void;
  onTransfer?: (oldGid: string, newGid: string, qid: string[]) => void;
  onDelete?: (index: number) => void;
  onIgnore?: (index: number) => void;
}

export default table;
