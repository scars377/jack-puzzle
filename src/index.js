import React from 'react';
import {render} from 'react-dom';
import App from './App';
import DropJack from './DropJack';
import './index.css';
import './index.html';

render(
  <div>
    <App />
    <DropJack />
  </div>,
  document.querySelector('#root'));
