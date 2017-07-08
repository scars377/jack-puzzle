import React, { Component } from 'react';
import Grid from './Grid'
import Solver from './Solver';

const EMPTY_ID = 8;

class Board extends Component {
  state = {
    grids: [0, 1, 2, 3, 4, 5, 6, 7, 8],
  }

  componentDidMount() {
    this.shuffle();
    window.addEventListener('keydown', this.keydown);
  }

  componentWillUnmount(){
    window.removeEventListener('keydown', this.keydown);
  }

  componentWillReceiveProps(nextProps) {
    const {image} = this.props;
    if(image !== nextProps.image) this.shuffle();
  }

  shuffle = e => {
    const grids = this.state.grids.slice();
    grids.sort(()=>Math.random()-.5);
    this.setState({grids});
  }

  keydown = e => {
    const { isAutoPlaying } = this.props;
    if (isAutoPlaying) {
      return;
    }

    const i = this.state.grids[EMPTY_ID]; //zero position
    switch(e.keyCode){
      case 37: //left
        if(i % 3 !== 2) this.swap(i, i+1);
        break;
      case 38: //up
        if(i + 3 < 9) this.swap(i, i+3);
        break;
      case 39: //right
        if(i % 3 !== 0) this.swap(i, i-1);
        break;
      case 40: //down
        if(i - 3 >= 0) this.swap(i, i-3);
        break;
      default:
    }
  }

  swap = (i, j) => {
    const k = this.state.grids.indexOf(j); //swap target idx
    const grids = this.state.grids.slice();
    grids[EMPTY_ID] = j;
    grids[k] = i;
    this.setState({grids});
    this.props.swap();
  }

  handleClick = (pos) => () => {
    const { isAutoPlaying } = this.props;
    const zeroPos = this.state.grids[EMPTY_ID];
    const isInvalid = pos !== zeroPos - 1 // left
      && pos !== zeroPos + 1 // right
      && pos !== zeroPos - 3 // up
      && pos !== zeroPos + 3; // down

    if (isAutoPlaying || isInvalid) {
      return;
    }

    this.swap(zeroPos, pos);
  }

  handleSolve = () => new Promise((resolve, reject) => {
    const solver = new Solver(this.state.grids, EMPTY_ID);
    const { solution, message } = solver.getSolution();
    if (!solution) {
      return reject(message);
    }

    const doSolution = () => {
      if (solution.length === 0) {
        return resolve(message);
      }

      const zeroPos = this.state.grids[EMPTY_ID];
      const pos = solution.shift();
      this.swap(zeroPos, pos);
      setTimeout(doSolution, 500);
    }

    doSolution();
  })

  render() {
    const {grids} = this.state;
    const {image} = this.props;

    return (
      <div className='board'>
        {grids.map((pos, id)=>(
          <Grid
            key={id}
            pos={pos}
            id={id}
            image={image}
            visible={id!==EMPTY_ID}
            handleClick={this.handleClick(pos)}
          />
        ))}
      </div>
    );
  }
}

export default Board;
