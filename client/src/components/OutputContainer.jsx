import React from 'react';

const OutputContainer = ({ output }) => {
  return (
    <div className="output-container container">
      <h3>Output</h3>
      <div className="inner-containers output-inner-container">
        {output ? (
          <pre>{output}</pre>
        ) : (
          <p>No output to display</p>
        )}
      </div>
    </div>
  );
};

export default OutputContainer;
