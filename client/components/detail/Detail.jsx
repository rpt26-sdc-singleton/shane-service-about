import React from 'react';

const Detail = (props) => (
  <div id="detail">
    <h2>About this Course</h2>
    <h3>
      {`${props.courseInfo.recent_views.toLocaleString('en')} recent views`}
    </h3>
    <p>{props.courseInfo.description}</p>
  </div>
);

export default Detail;
