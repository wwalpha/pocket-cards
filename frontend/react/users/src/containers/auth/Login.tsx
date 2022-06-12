import * as React from 'react';
import { Redirect } from 'react-router-dom';
import { ROUTE_PATHS } from '@constants';

const login: React.FunctionComponent<any> = (props) => {
  const [isLoading, setLoading] = React.useState(true);

  if (isLoading) return <div />;

  return <Redirect to={ROUTE_PATHS.ROUTE_PATHS[ROUTE_PATHS.ROUTE_PATH_INDEX.Settings]} />;
};

export default login;
