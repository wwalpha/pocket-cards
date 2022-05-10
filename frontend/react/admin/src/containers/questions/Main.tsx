import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { ROUTE_PATHS } from '@constants';
import { QuestionList, QuestionConfirm } from '.';

export default () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={path} component={QuestionList} />
      <Route path={ROUTE_PATHS.QUESTION_CONFIRM} component={QuestionConfirm} />
    </Switch>
  );
};
