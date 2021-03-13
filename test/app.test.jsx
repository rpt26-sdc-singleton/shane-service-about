import React from 'react';
import enzyme from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import App from '../client/App';

enzyme.configure({ adapter: new Adapter() });

describe('Should render the About component', () => {
  test('Should open without crashing', () => {
    const wrapper = enzyme.render(<App />);
    console.log(wrapper.children);
  });
});
