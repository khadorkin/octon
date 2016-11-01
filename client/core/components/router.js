import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import Root from '../containers/root';
import Home from '../containers/home';
import Settings from '../../settings/containers/settings';

const RouterApp = () => (
  <Router history={browserHistory}>
    <Route path="/" component={Root}>
      <IndexRoute component={Home} />
      <Route path="settings" component={Settings} />
    </Route>
  </Router>
);

export default RouterApp;
