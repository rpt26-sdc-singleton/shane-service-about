import React from 'react';

const Skills = (props) => {
  const { state } = props;
  return (
    <div className="skills">
      <h3>Skills You Will Gain</h3>
      {state.skills_you_will_gain.map((skill) => <li>{skill}</li>)}
    </div>
  );
};

export default Skills;
