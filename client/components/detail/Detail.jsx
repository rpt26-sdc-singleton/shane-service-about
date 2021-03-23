import React from 'react';

const Detail = (props) => {
  const { state } = props;
  return (
    <div id="detail">
      <h2>About this Course</h2>
      <h3 className="recent-views">
        {`${state.recent_views.toLocaleString('en')} recent views`}
      </h3>
      <div className="description expandable">
        {state.description.split('\n').map((para, index) => <p key={index}>{para}</p>)}
      </div>
    </div>
  );
};

export default Detail;
