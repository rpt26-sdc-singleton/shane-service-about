import React from 'react';
import Outcomes from './Outcomes.jsx';
import Facts from './Facts.jsx';

const Meta = (props) => {
  const { state } = props;
  return (
    <div id="meta">
      <Outcomes state={state} />
      <Facts state={state} />
    </div>
  );
};

export default Meta;
