import * as React from 'react';
import { withStyles, StyleRules, WithStyles, Theme } from '@material-ui/core/styles';
import { TextField, Grid } from '@material-ui/core';
import { RegistBtn } from '.';
import { compose } from 'react-apollo';
import { UserInfo } from '@gql/local';

class Regist extends React.Component<Props, State> {
  state: State = {
    name,
  };

  /** 入力変更 */
  handleChange = (name: string) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    this.setState({
      [name]: event.target.value,
    })

  render() {
    const { classes, user } = this.props;
    const { name = '' } = this.state;

    return (
      <Grid container>
        <TextField
          id="outlined-name"
          label="セット名称"
          className={classes.textField}
          value={this.state['name']}
          onChange={this.handleChange('name')}
          margin="normal"
          variant="outlined"
        />
        <RegistBtn userId={user.id} name={name} />
      </Grid>
    );
  }
}

const styles = (theme: Theme): StyleRules => ({
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
});

export interface OwnProps {
}

export interface Props extends OwnProps, UserInfo.Props, WithStyles<StyleRules> { }

export interface State {
  [key: string]: any;
}

export default compose(
  UserInfo.default,
  withStyles(styles),
)(Regist);
