import React from 'react';

const RuleContainer = ({ rules, onRuleSelect, mode, setMode, selectedRules }) => {
  return (
    <div className="rule-container container">
      <h3>Available Rules</h3>
      <div className="all-rule-container inner-containers">
        <ul>
          {rules.map(rule => (
            <li key={rule._id} className={selectedRules.includes(rule) ? 'selected' : ''}>
              <span>{rule.name}</span>
              <button onClick={() => onRuleSelect(rule)}>Select</button>
              <button onClick={() => {/* Add delete logic */}}>Delete</button>
              <button onClick={() => {/* Add update logic */}}>Update</button>
            </li>
          ))}
        </ul>
      </div>
      <div className="rule-container-button-box">
        <button disabled={mode} onClick={() => setMode('evaluate')}>Select One</button>
        <button disabled={mode} onClick={() => setMode('combine')}>Combine</button>
        {mode && <button onClick={() => setMode(null)}>Done Selection</button>}
      </div>
    </div>
  );
};

export default RuleContainer;
