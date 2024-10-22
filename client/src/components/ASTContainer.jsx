import React from 'react';

const ASTContainer = ({ ast }) => {
  return (
    <div className="ast-container container">
      <h3>AST (JSON Format)</h3>
      <div className="ast-output inner-containers">
        {ast ? (
          <pre>{JSON.stringify(ast, null, 2)}</pre>
        ) : (
          <p>No AST to display</p>
        )}
      </div>
    </div>
  );
};

export default ASTContainer;
