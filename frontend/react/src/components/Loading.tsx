import * as React from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';

class Loading extends React.Component<LoadingProps, any, any> {
  render() {
    //@ts-ignore
    const { size = 96, className } = this.props;

    return (
      <Grid container alignItems="center" justifyContent="center" sx={styles.root}>
        <Paper sx={styles.paper}>
          <CircularProgress size={size} />
        </Paper>
      </Grid>
    );
  }
}

const styles = {
  root: {
    position: 'absolute',
    height: '100%',
    backgroundColor: 'gray',
    opacity: 0.5,
    zIndex: 1000,
  },
  paper: {
    boxShadow: 'none',
    backgroundColor: 'transparent',
  },
  progress: {
    color: 'primary.dark',
  },
};

//@ts-ignore
export default Loading;

export interface LoadingProps {
  size?: number;
}
