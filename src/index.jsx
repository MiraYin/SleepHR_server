// enter point
import React from 'react';
import ReactDom from 'react-dom';
import { Router, browserHistory } from 'react-router';
import routes from './routes';
require('./stylesheets/base.scss');
require('./stylesheets/home.scss');
require('./stylesheets/survey.scss');
require('./stylesheets/scoreboard.scss');
require('./stylesheets/report.scss');
require('./stylesheets/success.scss');

ReactDom.render(
  <Router history={browserHistory} routes={routes} />,
  document.querySelector('#app')
);