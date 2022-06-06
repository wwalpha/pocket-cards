import * as React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { QuestionHome } from '.';

export default () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route path={path} exact component={QuestionHome} />
      {/* <Route path={Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.StudyCard]} component={StudyCards} />
      <Route path={Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.StudyEdit]} component={StudyEdit} />
      <Route path={Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.StudyStatus]} component={StudyStatus} /> */}
    </Switch>
  );
};
