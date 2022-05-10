import * as React from 'react';
import { Redirect } from 'react-router-dom';
import { Paths } from '@constants';

const login: React.FunctionComponent<any> = (props) => {
  const [isLoading, setLoading] = React.useState(true);

  if (isLoading) return <div />;

  return <Redirect to={Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.Settings]} />;
};

export default login;
