import { ROUTE_PATHS } from '@constants';
import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router';
import { Mainboard, GroupDetails } from '.';
import { Header } from '@containers/com';
import { QuestionList } from '../questions';

export default () => {
  const { path } = useRouteMatch();

  return (
    <React.Fragment>
      <Header />
      <Switch>
        <Route path={path} exact component={Mainboard} />
        <Route path={ROUTE_PATHS.GROUP_QUESTIONS()} component={QuestionList} />
        <Route path={ROUTE_PATHS.GROUP_EDIT()} component={GroupDetails} />
      </Switch>
    </React.Fragment>
  );
};
