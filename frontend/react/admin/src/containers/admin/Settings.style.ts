import { Theme } from '@mui/material/styles';
import { SxProps } from '@mui/system';

type Keys = '@global' | 'paper' | 'avatar' | 'form' | 'submit' | 'button';

export const styles: Record<Keys, SxProps<Theme>> = {
  '@global': {
    body: { bgcolor: 'common.white' },
  },
  paper: { mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' },
  avatar: { m: 1, backgroundColor: 'secondary.main' },
  form: { width: '100%', MimeType: 1 },
  submit: { m: 1, width: 120 },
  button: { p: 0 },
};
