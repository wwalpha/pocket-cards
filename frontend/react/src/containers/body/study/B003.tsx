import React, { useEffect, useMemo } from 'react';
import { bindActionCreators } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { useForm } from 'react-hook-form';
import { Box, TextField } from '@mui/material';
import { Button } from '@components/buttons';
import { WordActions } from '@actions';
import { RootState } from 'typings';

interface B003Params {
  word: string;
}

const appState = (state: RootState) => state.app;
const grpState = (state: RootState) => state.group;

export default () => {
  const { word } = useParams<B003Params>();
  const { isLoading } = useSelector(appState);
  const { activeGroup, current } = useSelector(grpState);

  const actions = bindActionCreators(WordActions, useDispatch());

  const { handleSubmit, reset, register } = useForm({
    mode: 'onChange',
    defaultValues: current,
  });

  useEffect(() => {
    reset(current);
  }, [current]);

  const handleOnUpdate = handleSubmit((datas) => actions.update(current?.id as string, datas));

  const handleOnIngore = () => actions.ignoreWord(current);

  const handleOnDelete = () => actions.del(activeGroup, word);

  return (
    <form onSubmit={handleOnUpdate}>
      <Box margin={2}>
        <TextField variant="outlined" margin="normal" required fullWidth id="id" label="単語" {...register('id')} />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="original"
          label="表示"
          {...register('original')}
        />
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          id="pronounce"
          label="発音"
          {...register('pronounce')}
        />
        <TextField variant="outlined" margin="normal" fullWidth id="vocJpn" label="日本語" {...register('vocJpn')} />
        <TextField variant="outlined" margin="normal" fullWidth id="vocChn" label="中国語" {...register('vocChn')} />
        <Box mt={2}>
          <Button
            size="large"
            sx={{ bgcolor: 'error.main', color: 'common.white' }}
            fullWidth
            variant="contained"
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
            type="submit"
            isLoading={isLoading}
            onClick={handleOnUpdate}>
            UPDATE
          </Button>
          <Button
            size="large"
            sx={{ bgcolor: 'error.main', color: 'common.white' }}
            fullWidth
            variant="contained"
            color="primary"
            isLoading={isLoading}
            onClick={handleOnIngore}>
            INGORE
          </Button>
        </Box>
      </Box>
    </form>
  );
};
