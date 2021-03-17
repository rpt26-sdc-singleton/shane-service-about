import React from 'react';

const Outcomes = (props) => {
  const { state } = props;
  return (
    <div id="outcomes">
      <div className="outcomes-title-set">
        <div className="circle-outline" />
        <h2>Learner Career Outcomes</h2>
      </div>
      {state.learner_career_outcomes.map((outcome) => (
        <div className="outcome-set">
          <div className="icon-background placeholder-circle">
            <div className="outcome-icon" />
          </div>
          <h2>{`${Math.round(outcome.pct * 100)}%`}</h2>
          <h3>{outcome.outcome}</h3>
        </div>
      ))}
    </div>
  );
};

export default Outcomes;
