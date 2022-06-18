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
import { styled } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ConfirmDialog from '@components/dialogs/ConfirmDialog';
import { LoadingIconButton } from '@components/buttons';
import QuestionDetails from './QuestionDetails';
import { Group, QuestionForm } from 'typings';

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

const table: FunctionComponent<QuestionTable> = ({ datas, loading, onSubmit, onDelete, onIgnore }) => {
  const [open, setOpen] = React.useState(false);
  const [deleteFlag, setDeleteFlag] = React.useState(false);
  const [ignoreFlag, setIgnoreFlag] = React.useState(false);
  const [index, setIndex] = React.useState(-1);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(50);

  /** popup close */
  const handleClose = () => {
    setOpen(false);
    setDeleteFlag(false);
    setIgnoreFlag(false);
  };

  /** edit open */
  const handleEditClick = (index: number) => {
    setIndex(page * rowsPerPage + index);
    setOpen(true);
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

  const handleOnDelete = () => {
    onDelete && onDelete(index);
    setDeleteFlag(false);
  };

  const handleOnIgnore = () => {
    onIgnore && onIgnore(index);
    setIgnoreFlag(false);
  };

  const handleDialogClick = (datas: QuestionForm) => {
    onSubmit?.(datas);

    setOpen(false);
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
      <Paper>
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
                        <LoadingIconButton
                          loading={loading}
                          sx={{ p: 0.5 }}
                          color="error"
                          onClick={() => {
                            handleDeleteClick(idx);
                          }}>
                          <DeleteIcon sx={{ fontSize: 32 }} />
                        </LoadingIconButton>
                        {onIgnore && (
                          <LoadingIconButton
                            sx={{ p: 0.5 }}
                            color="error"
                            loading={loading}
                            onClick={() => {
                              handleIgnoreClick(idx);
                            }}>
                            <VisibilityOffIcon sx={{ fontSize: 32 }} />
                          </LoadingIconButton>
                        )}
                        <LoadingIconButton
                          sx={{ p: 0.5 }}
                          loading={loading}
                          onClick={() => {
                            handleEditClick(idx);
                          }}>
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
        <TablePagination
          rowsPerPageOptions={[25, 50, 100]}
          component="div"
          count={datas.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
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
      <Dialog open={open} onClose={handleClose} maxWidth="lg">
        <DialogTitle>問題</DialogTitle>
        <DialogContent>
          {dataRow && (
            <QuestionDetails loading={loading} dataRow={dataRow} onClose={handleClose} onClick={handleDialogClick} />
          )}
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};

interface QuestionTable {
  loading?: boolean;
  datas: Partial<Group.Question>[];
  onSubmit?: (datas: QuestionForm) => void;
  onDelete?: (index: number) => void;
  onIgnore?: (index: number) => void;
}

export default table;
