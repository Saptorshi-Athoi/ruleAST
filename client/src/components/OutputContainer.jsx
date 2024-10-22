import React from 'react';

const OutputContainer = ({ output }) => {
  return (
    <div className="output-container container">
      <h3>Output</h3>
      {output ? (
        <pre>{output}</pre>
      ) : (
        <p>No output to display</p>
      )}
    </div>
  );
};

export default OutputContainer;
