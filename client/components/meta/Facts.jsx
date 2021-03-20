import React from 'react';

const Facts = (props) => {
  const { state, svgs } = props;
  return (
    <div id="facts">
      {state.metadata.map((set) => (
        <div key={set.title} className="fact-set">
          <div>
            <div className="circle circle-outline" />
          </div>
          <div>
            <h2 className="fact-title">{set.title}</h2>
            <h3 className="fact-subtitle">{set.subtitle}</h3>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Facts;
