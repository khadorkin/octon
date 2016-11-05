import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import Root from '../containers/root';
import Home from '../containers/home';

const RouterApp = () => (
  <Router history={browserHistory}>
    <Route path="/" component={Root}>
      <IndexRoute component={Home} />
      <Route path="repositories/:repositoryId" component={Home} />
      <Route path="settings" component={Home} />
    </Route>
  </Router>
);

export default RouterApp;
