import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      courseInfo: {
        skills_you_will_gain: [],
      },
    };
  }

  componentDidMount() {
    console.log('fetching data...');
    fetch('http://localhost:3002/api/about/1')
      .then((response) => response.json())
      .then((data) => {
        this.setState({ courseInfo: data });
      })
      .catch((err) => console.error(err));
  }

  render() {
    return (
      <div>
        <h1>About this Course</h1>
        <h3>{this.state.courseInfo.recent_views?.toLocaleString('en') || '0'} recent views</h3>
        <div>
          <h3>Skills You Will Gain</h3>
          <ul>
            {this.state.courseInfo.skills_you_will_gain?.map((skill) => <li>{skill}</li>) || ''}
          </ul>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.querySelector('#about'));
