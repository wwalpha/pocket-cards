import { ROUTE_PATHS } from '@constants';
import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router';
import { AbilityMain, AbilityRegist } from '.';
import { QuestionList } from '../questions';

export default () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route path={path} exact component={AbilityMain} />
      <Route path={ROUTE_PATHS.ABILITIES_REGIST} component={AbilityRegist} />
      <Route path={ROUTE_PATHS.ABILITIES_QUESTIONS()} component={QuestionList} />
    </Switch>
  );
};
