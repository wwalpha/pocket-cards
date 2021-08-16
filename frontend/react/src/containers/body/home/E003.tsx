import * as React from 'react';
import { bindActionCreators } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles, Theme, createStyles, TextField, Box } from '@material-ui/core';
import Button from '@components/buttons/Button';
import * as Actions from '@actions/group';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { Domains } from 'typings';

const useStyles = makeStyles(({ spacing }: Theme) =>
  createStyles({
    root: {
      padding: '0px 16px',
    },
    button: {
      paddingTop: spacing(4),
    },
  })
);

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

const appState = (state: Domains.State) => state.app;

export default () => {
  // const classes = useStyles();
  const actions = bindActionCreators(Actions, useDispatch());
  const { isLoading } = useSelector(appState);
  // const resolver = useYupValidationResolver(schema);
  const { handleSubmit, register } = useForm({
    mode: 'onChange',
  });

  const onSubmit = handleSubmit((datas) => {
    actions.regist(datas.name, datas.description);
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
          autoFocus
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
        <Box mt={2}>
          <Button size="large" fullWidth variant="contained" color="secondary" type="submit" isLoading={isLoading}>
            REGIST
          </Button>
        </Box>
      </Box>
    </form>
  );
};

interface GroupRegistForm {
  name: string;
  description?: string;
}
