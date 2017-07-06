import React, { Component } from 'react';
import './index.css';
import logic from './logic';

class DropJack extends Component {

  constructor(props) {
    super(props);
  }
  componentDidMount() {
    logic.init();
  }
  render() {
    return (
      <div className="drop-jack-root">
        <div id="canvas_wrap" />
      </div>
    );
  }
}

export default DropJack;
