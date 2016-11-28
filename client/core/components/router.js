import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import reactGa from 'react-ga';
import Root from '../containers/root';
import Home from '../containers/home';
import NotFound from './not-found';

if (process.env.GOOGLE_GA) {
  reactGa.initialize(process.env.GOOGLE_GA);
}

function logPageView() {
  reactGa.set({ page: window.location.pathname });
  reactGa.pageview(window.location.pathname);
}

const RouterApp = () => (
  <Router history={browserHistory} onUpdate={logPageView}>
    <Route path="/" component={Root}>
      <IndexRoute component={Home} />
      <Route path="repositories/:repositoryType/:repositoryUser/:repositoryName" component={Home} />
      <Route path="settings" component={Home} />
      <Route path="*" component={NotFound} />
    </Route>
  </Router>
);

export default RouterApp;
