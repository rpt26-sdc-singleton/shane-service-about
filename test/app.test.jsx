/* eslint-disable no-undef */
import React from 'react';
import enzyme from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import App from '../client/App';

enzyme.configure({ adapter: new Adapter() });

describe('Should render the About component', () => {
  let wrapper;
  const stateMock = {
    courseInfo: {
      course_id: 3,
      recent_views: 1738,
      description: 'Officia lorem labore landjaeger sunt culpa sed sint ball tip magna',
      learner_career_outcomes: [{ icon: 'signpost', pct: 0.51, outcome: 'started a new career after completing these courses' }],
      metadata: [{ icon: 'certificate', title: 'Shareable Certificate', subtitle: 'Earn a Certificate upon completion' }],
      what_you_will_learn: [],
      skills_you_will_gain: [],
    },
  };

  beforeAll(() => {
    wrapper = enzyme.shallow(<App />, { disableLifecycleMethods: true });
  });

  test('Should re-render when a new document is loaded', () => {
    expect(wrapper.state().courseInfo.course_id).toBe(0);
    wrapper.setState({ courseInfo: stateMock.courseInfo });
    expect(wrapper.state().courseInfo.course_id).toBe(3);
    expect(wrapper.state().courseInfo.description).toBe(stateMock.courseInfo.description);
  });
  test.todo('Should contain data sets');
  test.todo('Should render 3 divs for Description, Skills, Other data');
  test.todo('Should render the correct number of skills');
});
