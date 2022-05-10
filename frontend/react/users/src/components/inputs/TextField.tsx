import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';

export default styled(TextField)(({ theme: { palette } }) => ({
  '& label.Mui-focused': {
    color: palette.secondary.main,
  },
  '&:hover': {
    borderColor: 'blue',
  },
  '& input:valid + fieldset': {
    borderColor: palette.secondary.main,
  },
  '& input:valid:hover + fieldset': {
    borderLeftWidth: '6px !important',
    borderWidth: '2px',
    borderColor: palette.secondary.main,
  },
  '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
    borderColor: 'red',
    borderWidth: '2px',
    borderLeftWidth: 6,
  },
  '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: palette.secondary.main,
    borderWidth: '2px',
  },
  '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
    borderColor: palette.secondary.main,
  },
}));
