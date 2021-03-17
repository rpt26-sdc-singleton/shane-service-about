import React from 'react';

const Skills = (props) => {
  const { state } = props;
  return (
    <div className="skills">
      <h2>Skills You Will Gain</h2>
      <ul className="skills-list">
        {state.skills_you_will_gain.map((skill) => <li className="skill-name">{skill}</li>)}
      </ul>
    </div>
  );
};

export default Skills;
