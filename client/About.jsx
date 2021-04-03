import React from 'react';
import './style.css';

import Detail from './components/detail/Detail.jsx';
import Meta from './components/meta/Meta.jsx';
import Skills from './components/skills/Skills.jsx';

class About extends React.Component {
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
      svgs: {},
      expanded: '',
    };
  }

  componentDidMount() {
    let courseID;
    if (document) {
      const pathItems = window.location.href.split('/');
      courseID = pathItems[pathItems.length - 1];
    }
    courseID = !courseID ? 1 : courseID;
    console.log('fetching data with course id', courseID);
    fetch(`http://3.20.191.60/api/about/${courseID}`)
      .then((response) => response.json())
      .then((data) => {
        this.setState({ courseInfo: data });
      })
      .catch((err) => console.error(err));
    fetch('http://3.20.191.60/api/svgs')
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        this.setState({ svgs: data });
      });
  }

  expand() {
    this.setState({ expanded: 'expanded' });
  }

  render() {
    const { courseInfo, svgs, expanded } = this.state;
    return (
      <div className="about">
        <div className="two-three">
          <Detail state={courseInfo} expanded={expanded} click={() => { this.expand(); }} />
          <Skills state={courseInfo} />
        </div>
        <div className="one-three">
          <Meta state={courseInfo} svgs={svgs} />
        </div>
      </div>
    );
  }
}

export default About;
