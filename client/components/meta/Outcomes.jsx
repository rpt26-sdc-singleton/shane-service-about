import React from 'react';

const Outcomes = (props) => {
  const { state } = props;
  return (
    <div id="outcomes">
      <div className="outcomes-title-set">
        <div className="outcome-icon">
          <div className="circle-outline">
            <svg className="user-icon" viewBox="0 0 48 48">
              <path d="M2.2876,46 L46.0006,46 L45.0476,38.924 C44.5656,36.116 41.5416,35.138 40.2646,34.85 L24.1446,32.016 L7.9706,34.876 C5.9666,35.295 3.6456,36.597 3.2346,38.975 L2.2876,46 Z M48.2876,48 L-0.0004,48 L1.2576,38.671 C1.7506,35.818 4.1756,33.626 7.5916,32.912 L24.1436,29.984 L40.6586,32.889 C44.1826,33.684 46.5446,35.823 47.0246,38.622 L48.2876,48 Z" role="presentation" />
              <path d="M24.1465,2 C21.7165,2 19.3835,2.994 17.7485,4.727 C16.2805,6.28 15.5385,8.271 15.6565,10.334 C15.6975,11.058 16.2995,14.397 16.6945,16.465 C17.3255,19.946 19.6545,24 24.1465,24 C28.5745,24 30.8995,20.107 31.5995,16.464 C31.9985,14.398 32.6045,11.065 32.6365,10.347 C32.7305,8.239 31.9635,6.222 30.4775,4.667 C28.8555,2.972 26.5485,2 24.1465,2 M24.1465,26 C19.4355,26 15.7385,22.401 14.7285,16.831 C14.6265,16.3 13.7215,11.535 13.6595,10.448 C13.5095,7.831 14.4455,5.311 16.2935,3.353 C18.3065,1.222 21.1685,0 24.1465,0 C27.0915,0 29.9255,1.197 31.9225,3.285 C33.7905,5.238 34.7525,7.777 34.6345,10.436 C34.5855,11.531 33.6675,16.302 33.5635,16.842 C32.4795,22.49 28.8705,26 24.1465,26" role="presentation" />
            </svg>
          </div>
        </div>
        <h2>Learner Career Outcomes</h2>
      </div>
      {state.learner_career_outcomes.map((outcome) => (
        <div key={outcome.icon} className="outcome-set">
          <div className={`icon-background ${outcome.icon}`}>
            <div className="outcome-icon" />
          </div>
          <h2 className="outcome-pct">{`${Math.round(outcome.pct * 100)}%`}</h2>
          <h3>{outcome.outcome}</h3>
        </div>
      ))}
    </div>
  );
};

export default Outcomes;
