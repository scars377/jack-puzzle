import React, { Component } from 'react';
import Board from './Board';
import StepCounter from './StepCounter';
import jack from './jack.png';

class App extends Component {
  state = {
    image: jack,
    stepCount: 0,
  }

  constructor(props) {
    super(props);
    this.reader = new FileReader();
    this.reader.onload = () => this.setState({ image: this.reader.result });
  }

  loadImage = (e) => {
    this.reader.readAsDataURL(e.target.files[0]);
  }

  reset = () => {
    this.setState({ image: jack });
  }

  handleBoardSwap = () => {
    const stepCount = this.state.stepCount += 1;
    this.setState({ stepCount });
  }

  render() {
    const { image, stepCount } = this.state;

    return (
      <div className="app">
        <div className="img sample" style={{ backgroundImage: `url('${image}')` }} />
        <Board image={image} swap={this.handleBoardSwap} />
        <StepCounter stepCount={stepCount} />
        <div className="input">
          <input type="file" accept="image/*" onChange={this.loadImage} />
          {image === jack ? null : <button onClick={this.reset}>Jack</button>}
        </div>
      </div>
    );
  }
}

export default App;
