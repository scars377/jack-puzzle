import React, { Component } from 'react';
import Board from './Board';
import jack from './jack.png';

class App extends Component {
  state = {
    image: jack
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

  render() {
    const {image} = this.state;

    return (
      <div className='app'>
        <div className='img sample' style={{backgroundImage: `url('${image}')`}}/>
        <Board image={image}/>
        <div className='input'>
          <input type='file' accept='image/*' onChange={this.loadImage} />
          {image===jack?null:<button onClick={this.reset}>Jack</button>}
        </div>
      </div>
    );
  }
}

export default App;
