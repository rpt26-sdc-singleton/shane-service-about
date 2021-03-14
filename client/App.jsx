import React from 'react';
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
    let courseID;
    if (document) {
      const pathItems = window.location.href.split('/');
      courseID = pathItems[pathItems.length - 1];
    }
    courseID = !courseID ? 1 : courseID;
    console.log('fetching data with course id ', courseID);
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
        <h2 className="title bold">About this Course</h2>
        <div className="recent-views">
          <span>{this.state.courseInfo.recent_views.toLocaleString('en')} recent views</span>
        </div>
        {
          this.state.courseInfo.description.split('\n').map((paragraph) => <p className="description">{paragraph}</p>)
        }
        <div>
          <div id="learner-career-outcomes">
            <div className="data-set">
              <div className="placeholder-circle" />
              <h3 className="meta-title">Learner Career Outcomes</h3>
            </div>
            {this.state.courseInfo.learner_career_outcomes.map((set) => (
              <div className="data-set">
                <div className="icon-container">
                  <div className="gradient-blue-green">
                    <div className="icon-circle" />
                  </div>
                </div>
                <div className="fact-set">
                  <h2 className="outcomes-pct">{`${Math.round(set.pct * 100)}%`}</h2>
                  <p className="outcomes-desc">{set.outcome}</p>
                </div>
              </div>
            ))}
          </div>
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
        <div className="skills">
          <h3>Skills You Will Gain</h3>
          <ul>
            {this.state.courseInfo.skills_you_will_gain.map((skill) => <li>{skill}</li>)}
          </ul>
        </div>
      </div>
    );
  }
}

export default App;
