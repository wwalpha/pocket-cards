import React, { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { ROUTE_PATHS } from '@constants';

const a003: FunctionComponent<any> = () => {
  return (
    <Grid
      container
      alignItems="center"
      justifyContent="center"
      // className={classes.root}
    >
      <Button
        variant="contained"
        color="primary"
        // className={classes.button}
        component={React.forwardRef((props: any, ref: any) => (
          <Link to={ROUTE_PATHS.ROUTE_PATHS[ROUTE_PATHS.ROUTE_PATH_INDEX.Study]} {...props} />
        ))}>
        登録完了
      </Button>
    </Grid>
  );
};

export default a003;
