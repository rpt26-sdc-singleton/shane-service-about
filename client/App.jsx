import React from 'react';
import ReactDOM from 'react-dom';
import './style.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      courseInfo: {
        course_id: 0,
        recent_views: 0,
        description: '',
        learner_career_outcomes: [{ icon: '', pct: 0.00, outcome: '' }],
        metadata: [{ icon: '', title: '', subtitle: '' }],
        what_you_will_learn: [],
        skills_you_will_gain: [],
      },
    };
  }

  componentDidMount() {
    console.log(window.location.href.split('/'));
    const pathItems = window.location.href.split('/');
    const courseID = pathItems[pathItems.length - 1];
    console.log('fetching data...');
    fetch(`http://localhost:3002/api/about/${courseID}`)
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
        <h3>{this.state.courseInfo.recent_views.toLocaleString('en')} recent views</h3>
        <p>{this.state.courseInfo.description}</p>
        <div className="skills">
          <h3>Skills You Will Gain</h3>
          <ul>
            {this.state.courseInfo.skills_you_will_gain.map((skill) => <li>{skill}</li>)}
          </ul>
        </div>
        <div>
          <div className="data-set">
            <div className="placeholder-circle" />
            <h3>Learner Career Outcomes</h3>
          </div>
          {this.state.courseInfo.learner_career_outcomes.map((set) => (
            <div className="data-set">
              <div className="placeholder-circle" />
              <h1>{`${Math.round(set.pct * 100)}%`}</h1>
              <p>{set.outcome}</p>
            </div>
          ))}
          {this.state.courseInfo.metadata.map((set) => (
            <div className="data-set">
              <div className="placeholder-circle" />
              <div className="title-subtitle">
                <h2>{set.title}</h2>
                <p>{set.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.querySelector('#about'));
