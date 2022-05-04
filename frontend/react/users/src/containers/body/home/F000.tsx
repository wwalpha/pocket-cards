import * as React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { Todos } from '@containers/body/home';

export default () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route path={path} exact component={Todos} />
    </Switch>
  );
};
