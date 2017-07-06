import React, { Component } from 'react';
import jack from '../jack.png';
import './roulette.styl';

class Roulette extends Component {
  state = {
    positions: [0, 0, 0],
    speeds: [0, 0, 0],
    image: jack,
  }

  componentDidMount() {
    this.startRoulette();
    this.move();
  }

  componentWillUnmount() {
    this.stop();
  }

  startRoulette = () => {
    this.speedTween = {
      time: Date.now(),
      duration: 1000,
      start: this.state.speeds.slice(),
      end: [
        0.02 + Math.random() * 0.02,
        0.02 + Math.random() * 0.02,
        0.02 + Math.random() * 0.02,
      ],
    };
  }

  stopRoulette = () => {
    this.speedTween = {
      time: Date.now(),
      duration: 200,
      start: this.state.speeds.slice(),
      end: [0, 0, 0],
    };
  }

  move = () => {
    const { positions } = this.state;
    const { start, end, time, duration } = this.speedTween;
    const n = (Date.now() - time) / duration;
    let speeds;
    if (n >= 1) {
      speeds = end;
    } else {
      speeds = start.map((p, i) => (p + n * (end[i] - start[i])));
    }

    this.setState({
      speeds,
      positions: positions.map((p, i) => ((p + speeds[i]) % 1)),
    }, () => {
      this.req = requestAnimationFrame(this.move);
    });
  }

  stop() {
    cancelAnimationFrame(this.req);
  }

  render() {
    const { positions, speeds, image } = this.state;
    const speed = speeds.reduce((a, b) => (a + b));
    const action = speed === 0 ? this.startRoulette : this.stopRoulette;
    const label = speed === 0 ? 'Start Jack' : 'Stop Jack';

    return (
      <div className="roulette" onClick={action}>
        {positions.map((p, i) => (
          <div className="stripe" key={i}>
            <div className="images" style={{ transform: `translate(-${i * 100}px, ${(p - 1) * 300}px)` }} >
              <div className="image" style={{ backgroundImage: `url(${image})` }} />
              <div className="image" style={{ backgroundImage: `url(${image})` }} />
            </div>
          </div>
        ))}
        <div className="control">
          <button onClick={action}>{label}</button>
        </div>
      </div>
    );
  }
}

export default Roulette;
