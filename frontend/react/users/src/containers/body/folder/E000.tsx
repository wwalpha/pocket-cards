import * as React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { GroupList, GroupNew, GroupEdit } from '@containers/body/folder';
import { ROUTE_PATHS } from '@constants';

export default () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route path={path} exact component={GroupList} />
      <Route path={ROUTE_PATHS.ROUTE_PATHS[ROUTE_PATHS.ROUTE_PATH_INDEX.GroupRegist]} component={GroupNew} />
      <Route path={ROUTE_PATHS.ROUTE_PATHS[ROUTE_PATHS.ROUTE_PATH_INDEX.GroupEdit]} component={GroupEdit} />
    </Switch>
  );
};
