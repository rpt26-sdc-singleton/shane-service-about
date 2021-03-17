import React from 'react';
import './style.css';

import Detail from './components/detail/Detail.jsx';
import Meta from './components/meta/Meta.jsx';
import Skills from './components/skills/Skills.jsx';

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
    const { courseInfo } = this.state;
    return (
      <div className="about">
        <div className="two-three">
          <Detail state={courseInfo} />
          <Skills state={courseInfo} />
        </div>
        <div className="one-three">
          <Meta state={courseInfo} />
        </div>
      </div>
    );
  }
}

export default App;
