import React from 'react';
import PropTypes from 'prop-types';

const unfamiliarThreshold = 20;

const countBlock = count => <div>STEPS: <span className="value">{count}</span></div>;

const StepCounter = ({ stepCount }) => (
  stepCount < unfamiliarThreshold ?
    <div className="step">
      {countBlock(stepCount)}
    </div>
    : <div className="step unfamiliar">
      {countBlock(stepCount)}
      <p className="note">你好像跟 Jack 不熟喔，快來請安。</p>
    </div>
);

StepCounter.propTypes = {
  stepCount: PropTypes.number.isRequired,
};

export default StepCounter;
