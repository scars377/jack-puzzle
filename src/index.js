import React from 'react';
import { render } from 'react-dom';
import {
  HashRouter as Router,
  Redirect,
  Switch,
  Route,
  NavLink,
} from 'react-router-dom';

import './index.styl';
import './index.html';

import Puzzle from './puzzle/Puzzle';
import DropJack from './DropJack';
import Roulette from './roulette/Roulette';

const pages = [
  { path: '/puzzle', label: 'Puzzle', component: Puzzle },
  { path: '/drop', label: 'Drop', component: DropJack },
  { path: '/roulette', label: 'Roulette', component: Roulette },
];

render(
  <Router>
    <div className="app">
      <div className="app-menu">
        {pages.map(page => (
          <NavLink to={page.path} key={page.path} activeClassName="active">{page.label}</NavLink>
        ))}
      </div>
      <div className="app-content">
        <Switch>
          <Redirect to="/puzzle" from="/" />
          {pages.map(page => (
            <Route path={page.path} component={page.component} />
          ))}
        </Switch>
      </div>
    </div>
  </Router>,
  document.querySelector('#root'));
