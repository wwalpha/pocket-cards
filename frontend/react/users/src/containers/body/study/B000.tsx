import * as React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { StudyCards, StudyInit, StudyEdit, StudyStatus } from '@containers/body/study';
import { ROUTE_PATHS } from '@constants';

export default () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route path={path} exact component={StudyInit} />
      <Route path={ROUTE_PATHS.ROUTE_PATHS[ROUTE_PATHS.ROUTE_PATH_INDEX.StudyCard]} component={StudyCards} />
      <Route path={ROUTE_PATHS.ROUTE_PATHS[ROUTE_PATHS.ROUTE_PATH_INDEX.StudyEdit]} component={StudyEdit} />
      <Route path={ROUTE_PATHS.ROUTE_PATHS[ROUTE_PATHS.ROUTE_PATH_INDEX.StudyStatus]} component={StudyStatus} />
    </Switch>
  );
};
