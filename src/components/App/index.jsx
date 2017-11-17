import React, { Component } from 'react';
import Counter from '../Counter';
import Random from '../Random';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Counter store={this.props.store} />
        <Random store={this.props.store} />
      </div>
    );
  }
}

export default App;

