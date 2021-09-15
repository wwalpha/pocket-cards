import * as React from 'react';
import { bindActionCreators } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { makeStyles, Theme, createStyles, Box, Typography, Card, CardContent } from '@material-ui/core';
import { Button } from '@components/buttons';
import * as Actions from '@actions/word';
import { RootState } from 'typings';

const useStyles = makeStyles(({ spacing }: Theme) =>
  createStyles({
    container: {
      height: '100%',
      position: 'relative',
    },
    root: { margin: spacing(2), textAlign: 'center' },
  })
);

interface B003Params {
  word: string;
}

const appState = (state: RootState) => state.app;
const grpState = (state: RootState) => state.group;

export default () => {
  const classes = useStyles();
  const { word } = useParams<B003Params>();
  const { isLoading } = useSelector(appState);
  const { activeGroup, current } = useSelector(grpState);

  const actions = bindActionCreators(Actions, useDispatch());

  const handleOnDelete = () => {
    actions.del(activeGroup, word);
  };

  const handleOnUpdate = () => {};

  return (
    <Box>
      <Card className={classes.root}>
        <CardContent>
          <Typography variant="h4" component="h2">
            {current?.id}
          </Typography>
          <Typography variant="h5" color="textSecondary">
            /{current?.pronounce}/
          </Typography>

          <Typography variant="h5" component="p">
            <br />
            {current?.vocChn}
            <br />
            {current?.vocJpn}
          </Typography>
        </CardContent>
      </Card>
      <Box margin={2} display="flex" justifyContent="center">
        <Button
          size="large"
          fullWidth
          variant="contained"
          color="secondary"
          type="button"
          isLoading={isLoading}
          onClick={handleOnDelete}>
          DELETE
        </Button>
        <Button
          size="large"
          fullWidth
          variant="contained"
          color="primary"
          type="button"
          isLoading={isLoading}
          onClick={handleOnUpdate}>
          UPDATE
        </Button>
      </Box>
    </Box>
  );
};
