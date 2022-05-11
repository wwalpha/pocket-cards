import React, { FunctionComponent } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { Breakpoint } from '@mui/material/styles';

export const dialog: FunctionComponent<ConfirmDialogProps> = ({ title = '確認', ...props }) => {
  return (
    <Dialog open={props.open} onClose={props.onClose} maxWidth={props.maxWidth}>
      <DialogTitle sx={{ bgcolor: 'secondary.main', p: 1, pl: 2, color: 'common.white' }}>{title}</DialogTitle>
      <DialogContent sx={{ minWidth: '400px' }}>
        <DialogContentText sx={{ pt: 2 }}>{props.message}</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ pb: 2, px: 2 }}>
        <Button onClick={props.onClose} variant="contained" color="secondary" sx={{ width: 80 }}>
          Cancel
        </Button>
        <Button onClick={props.onConfirm} variant="contained" sx={{ width: 80 }} autoFocus>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  message?: string;
  onConfirm?: () => void;
  onClose?: () => void;
  maxWidth?: Breakpoint | false;
}

export default dialog;
