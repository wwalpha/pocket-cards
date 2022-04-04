import * as React from 'react';
import { bindActionCreators } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Button from '@components/buttons/Button';
import { GroupActions } from '@actions';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { RootState } from 'typings';
import { Consts } from '@constants';

const useYupValidationResolver = (schema: yup.AnyObjectSchema) =>
  React.useCallback(
    async (data) => {
      try {
        const values = await schema.validate(data, {
          abortEarly: false,
        });

        return {
          values,
          errors: {},
        };
      } catch (errors) {
        return {
          values: {},
          errors: errors.inner.reduce(
            (allErrors: any, currentError: any) => ({
              ...allErrors,
              [currentError.path]: {
                type: currentError.type ?? 'validation',
                message: currentError.message,
              },
            }),
            {}
          ),
        };
      }
    },
    [schema]
  );

const schema = yup.object({
  name: yup.string().required(),
});

const appState = (state: RootState) => state.app;

export default () => {
  const actions = bindActionCreators(GroupActions, useDispatch());
  const { isLoading } = useSelector(appState);
  // const resolver = useYupValidationResolver(schema);
  const { handleSubmit, register } = useForm({
    mode: 'onChange',
  });

  const onSubmit = handleSubmit((datas) => {
    actions.regist({
      id: '',
      name: datas.name,
      description: datas.description,
      subject: datas.subject,
    });
  });

  return (
    <form onSubmit={onSubmit}>
      <Box margin={2}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="name"
          label="Group Name"
          {...register('name')}
        />
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          id="description"
          label="Group Description"
          {...register('description')}
        />
        <FormControl sx={{ my: 2 }} fullWidth>
          <InputLabel id="demo-simple-select-helper-label">Subject *</InputLabel>
          <Select
            id="Subject"
            // value={age}
            label="Subject"
            required
            {...register('subject')}>
            <MenuItem value={Consts.SUBJECT.JAPANESE.toString()}>Japanese</MenuItem>
            <MenuItem value={Consts.SUBJECT.SCIENCE.toString()}>Science</MenuItem>
            <MenuItem value={Consts.SUBJECT.SOCIETY.toString()}>Society</MenuItem>
          </Select>
        </FormControl>
        <Box mt={2}>
          <Button size="large" fullWidth variant="contained" color="secondary" type="submit" isLoading={isLoading}>
            REGIST
          </Button>
        </Box>
      </Box>
    </form>
  );
};
