import React, { FunctionComponent } from 'react';
import { ButtonProps } from '@mui/material/Button/Button.d';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import green from '@mui/material/colors/green';

const button: FunctionComponent<Props> = ({ isLoading, children, ...props }) => {
  return (
    <Box sx={{ m: 1, position: 'relative' }}>
      <Button disableFocusRipple disableTouchRipple disableRipple fullWidth {...props} disabled={isLoading}>
        {children}
      </Button>
      {isLoading && (
        <CircularProgress
          size={24}
          sx={{
            color: green[500],
            position: 'absolute',
            top: '50%',
            left: '50%',
            mt: -1.5,
            ml: -1.5,
          }}
        />
      )}
    </Box>
  );
};

interface Props extends ButtonProps {
  isLoading?: boolean;
}

export default button;
