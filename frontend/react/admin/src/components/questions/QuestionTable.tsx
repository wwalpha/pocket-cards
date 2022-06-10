import React, { FunctionComponent } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
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

const table: FunctionComponent<QuestionTable> = ({ datas, loading, onSubmit, onDelete }) => {
  const [open, setOpen] = React.useState(false);
  const [confirm, setConfirm] = React.useState(false);
  const [index, setIndex] = React.useState(-1);

  const handleClose = () => {
    setOpen(false);
    setConfirm(false);
  };

  const handleClick = (index: number) => {
    setIndex(index);
    setOpen(true);
  };
  const handleDeleteBtn = (index: number) => {
    setIndex(index);
    setConfirm(true);
  };
  const handleOnDelete = () => {
    onDelete && onDelete(index);
    setConfirm(false);
  };

  const handleDialogClick = (datas: QuestionForm) => {
    onSubmit?.(datas);

    setOpen(false);
  };

  const dataRow = index !== -1 ? datas[index] : undefined;

  return (
    <React.Fragment>
      <TableContainer component={Paper} sx={styles.container}>
        <Table aria-label="customized table" size="small">
          <TableHead>
            <TableRow>
              <StyledTableCell sx={{ width: 32 }}>No.</StyledTableCell>
              {onSubmit && <StyledTableCell></StyledTableCell>}
              <StyledTableCell>Title</StyledTableCell>
              <StyledTableCell>Choices</StyledTableCell>
              <StyledTableCell>Answer</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {datas.map((item, idx) => (
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
                          handleDeleteBtn(idx);
                        }}>
                        <DeleteIcon sx={{ fontSize: 32 }} />
                      </LoadingIconButton>
                      <LoadingIconButton
                        sx={{ p: 0.5 }}
                        loading={loading}
                        onClick={() => {
                          handleClick(idx);
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
      <ConfirmDialog
        open={confirm}
        message="削除してよろしいでしょうか？"
        onClose={handleClose}
        onConfirm={handleOnDelete}
        maxWidth="md"
      />
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
}

export default table;
