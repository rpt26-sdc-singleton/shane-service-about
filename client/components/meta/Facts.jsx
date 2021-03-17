import React from 'react';

const Facts = (props) => {
  const { state } = props;
  return (
    <div id="facts">
      {state.metadata.map((set) => (
        <div key={set._id} className="fact-set">
          <div className="circle circle-outline" />
          <h2 className="fact-title">{set.title}</h2>
          <h3 className="fact-title">{set.subtitle}</h3>
        </div>
      ))}
    </div>
  );
};

export default Facts;
