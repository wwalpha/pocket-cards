import { Theme } from '@mui/material/styles';
import { SxProps } from '@mui/system';

type Keys = 'root' | 'users' | 'infos' | 'tools';

export const styles: Record<Keys, SxProps<Theme> | undefined> = {
  root: {
    display: 'flex',
    m: 2,
  },
  users: {
    display: 'flex',
    flexGrow: 1,
  },
  infos: {
    display: 'flex',
    flexGrow: 1,
    p: 4,
    flexDirection: 'column',
  },
  tools: {
    display: 'flex',
  },
};
