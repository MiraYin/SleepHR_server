import React from 'react';
import { Route, IndexRoute } from 'react-router';

/**
 * Import all page components here
 */
import App from './components/app';
import Home from './components/views/home';
import Survey from './components/views/survey';
import Scoreboard from './components/views/scoreboard';

/**
 * All routes go here.
 * Don't forget to import the components above after adding new route.
 */
export default (
  <Route path='/' component={App}>
    <IndexRoute component={Home} />
    <Route path='survey' component={Survey} />
    <Route path='scoreboard' component={Scoreboard}/>
    <Route path='*' component={Home} />
  </Route>
);