/* eslint-disable no-undef */
import React from 'react';
import enzyme from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import About from '../client/About';
import fixtures from './fixtures';

enzyme.configure({ adapter: new Adapter() });

describe('Should render the About component', () => {
  let wrapper;
  const stateMock = fixtures.stateMock1;

  beforeAll(() => {
    fetch.mockResponse(JSON.stringify({ ...stateMock.courseInfo }));
    wrapper = enzyme.mount(<About />);
  });

  afterAll(() => {
    wrapper.unmount();
  });

  test('Should re-render when a new document is loaded', () => {
    // componentDidMount() calls the above mocked response which returns a fake state with id 3
    // Test initial case
    expect(wrapper.state().courseInfo.course_id).toBe(3);
    // Set state to new mock
    const newStateMock = fixtures.stateMock2;
    wrapper.setState({ courseInfo: newStateMock.courseInfo });
    expect(wrapper.state().courseInfo.course_id).toBe(2);
    expect(wrapper.state().courseInfo.description).toBe(newStateMock.courseInfo.description);
  });
  test('Should render the correct number of skills', () => {
    // Using newStateMock
    expect(wrapper.find('.skill-name').length).toBe(2);
    // Manually change state
    wrapper.setState({ courseInfo: stateMock.courseInfo });
    expect(wrapper.find('.skill-name').length).toBe(3);
  });
  test('Should render 3 divs for Description, Skills, Other data', () => {
    expect(wrapper.find('.about').children().length).toBe(2);
    // Below class is 2/3 of the screen and contains detail/skills
    expect(wrapper.find('.two-three').children().length).toBe(2);
    // Sidebar, 1/2 of the screen and contains the Outcomes
    expect(wrapper.find('.one-three').children().length).toBe(1);
  });
  test('Should render fact-sets', () => {
    expect(wrapper.find('.fact-set').length).toBeGreaterThan(0);
  });
  test.only('Should add class .expanded when SHOW ALL is clicked', () => {
    const descriptionDiv = wrapper.find('.description');
    expect(descriptionDiv.hasClass('expanded')).toBeFalsy();
    wrapper.find('.show-more-button button').simulate('click');
    console.log(descriptionDiv);
    // expect(descriptionDiv.hasClass('expanded')).toBeTruthy();
  });
});
