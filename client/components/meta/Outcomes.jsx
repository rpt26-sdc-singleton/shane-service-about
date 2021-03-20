import React from 'react';

const Outcomes = (props) => {
  const { state, svgs } = props;
  return (
    <div id="outcomes">
      <div className="outcomes-title-set">
        <div className="outcome-icon">
          <div className="circle-outline">
            <svg className="user-icon" viewBox="0 0 48 48">
              <path d={svgs.userSVG?.body || ''} role="presentation" />
              <path d={svgs.userSVG?.head || ''} role="presentation" />
            </svg>
          </div>
        </div>
        <h2>Learner Career Outcomes</h2>
      </div>
      {state.learner_career_outcomes.map((outcome) => (
        <div key={outcome.icon} className="outcome-set">
          <div className={`icon-background ${outcome.icon}`}>
            <div className="icon-container">
              <svg className="outcome-icon" viewBox={outcome.icon === 'careerDirectionSVG' ? '0 0 25 25' : '0 0 48 48'}>
                <path d={outcome.icon === "careerPromotionSVG" ? svgs[outcome.icon]?.outside : svgs[outcome.icon]} role="presentation" />
                {outcome.icon === "careerPromotionSVG" ? <path d={svgs[outcome.icon]?.inside} role="presentation" /> : null }
              </svg>
            </div>
          </div>
          <h2 className="outcome-pct">{`${Math.round(outcome.pct * 100)}%`}</h2>
          <h3>{outcome.outcome}</h3>
        </div>
      ))}
    </div>
  );
};

export default Outcomes;
