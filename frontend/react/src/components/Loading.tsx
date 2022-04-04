import * as React from 'react';
import { Theme, withStyles } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';

class Loading extends React.Component<LoadingProps, any, any> {
  render() {
    //@ts-ignore
    const { size = 96, className, classes } = this.props;
    if (!classes) return;

    return (
      <Grid
        container
        alignItems="center"
        justifyContent="center"
        classes={{
          container: classes.root,
        }}
        className={className}>
        <Paper className={classes.paper}>
          <CircularProgress size={size} />
        </Paper>
      </Grid>
    );
  }
}

const styles = ({ palette: { primary } }: Theme) => ({
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
    color: primary.dark,
  },
});

//@ts-ignore
export default withStyles(styles as any)(Loading);

export interface LoadingProps {
  size?: number;
}
