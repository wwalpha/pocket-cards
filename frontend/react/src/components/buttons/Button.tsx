import React, { FunctionComponent } from 'react';
import { makeStyles, createStyles } from '@mui/styles';
import { Button, ButtonProps, CircularProgress, Theme, Box } from '@mui/material';
import { green } from '@mui/material/colors';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      alignItems: 'center',
    },
    wrapper: {
      margin: theme.spacing(1),
      position: 'relative',
    },
    buttonProgress: {
      color: green[500],
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginTop: -12,
      marginLeft: -12,
    },
  })
);

const button: FunctionComponent<Props> = ({ isLoading, children, ...props }) => {
  const classes = useStyles();

  return (
    <Box margin={1} position="relative">
      <Button disableFocusRipple disableTouchRipple fullWidth {...props} disabled={isLoading}>
        {children}
      </Button>
      {isLoading && <CircularProgress size={24} className={classes.buttonProgress} />}
    </Box>
  );
};

interface Props extends ButtonProps {
  isLoading?: boolean;
}

export default button;
