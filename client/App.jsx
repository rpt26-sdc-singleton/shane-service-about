import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      test: 'here',
    };
  }

  render() {
    return (
      <div>
        <h1>About this Course</h1>
        <h3>6,320,339 recent views</h3>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.querySelector('#about'));
