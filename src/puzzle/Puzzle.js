import React, { Component } from 'react';
import Board from './Board';
import StepCounter from './StepCounter';
import jack from '../jack.png';
import './puzzle.styl'

class Puzzle extends Component {
  state = {
    image: jack,
    stepCount: 0,
    isAutoPlaying: false,
    message: '',
  }

  constructor(props){
    super(props);
    this.reader = new FileReader();
    this.reader.onload = ()=>this.setState({image: this.reader.result})
  }

  loadImage = e =>{
    this.reader.readAsDataURL(e.target.files[0]);
  }

  reset = () => {
    this.setState({image: jack});
  }

  handleBoardSwap = () => {
    const stepCount = this.state.stepCount += 1;
    this.setState({ stepCount });
  }

  handleSolve = () => {
    this.setState({ isAutoPlaying: true });
    this.board.handleSolve()
      .then(message => this.setState({ message }))
      .catch(message => this.setState({ message }))
      .then(() => {
        this.setState({ isAutoPlaying: false });
      });
  }

  handleReset = () => {
    this.board.shuffle();
    this.setState({ stepCount: 0, message: '' });
  }

  render() {
    const { image, stepCount, isAutoPlaying, message } = this.state;

    return (
      <div className='puzzle'>
        <div className='img sample' style={{backgroundImage: `url('${image}')`}}/>
        <Board
          image={image} swap={this.handleBoardSwap}
          isAutoPlaying={isAutoPlaying} ref={node => this.board = node}
        />
        <StepCounter stepCount={stepCount} />
        <div>{message}</div>
        <footer className='footer'>
          <div className='input'>
            <input type='file' accept='image/*' onChange={this.loadImage} />
            {image===jack?null:<button onClick={this.reset}>Jack</button>}
          </div>
          <button onClick={this.handleSolve} disabled={isAutoPlaying}>
            {isAutoPlaying ? 'Jack 正在玩...' : 'Jack 幫你玩'}
          </button>
          <button onClick={this.handleReset} disabled={isAutoPlaying}>
            重新來過
          </button>
        </footer>
      </div>
    );
  }
}

export default Puzzle;
