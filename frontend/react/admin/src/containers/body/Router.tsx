import { ROUTE_PATHS } from '@constants';
import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router';
import { Mainboard, GroupDetails } from '.';
import { Header } from '@containers/com';
import { QuestionList, QuestionConfirm } from '../questions';

export default () => {
  const { path } = useRouteMatch();

  return (
    <React.Fragment>
      <Switch>
        <Route exact path={path}>
          <Header />
          <Mainboard />
        </Route>
        <Route exact path={ROUTE_PATHS.GROUP_QUESTIONS()}>
          <Header />
          <QuestionList />
        </Route>
        <Route exact path={ROUTE_PATHS.GROUP_EDIT()} component={GroupDetails}>
          <Header />
          <GroupDetails />
        </Route>
        <Route exact path={ROUTE_PATHS.GROUP_UPLOAD_CONFIRM} component={QuestionConfirm}>
          <Header />
          <QuestionConfirm />
        </Route>
      </Switch>
    </React.Fragment>
  );
};
