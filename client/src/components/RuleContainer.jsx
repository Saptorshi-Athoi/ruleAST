import React, { useState } from 'react';

const RuleContainer = ({ rules, onRuleSelect, mode, setMode, selectedRules, onCreateRule }) => {
  const [newRule, setNewRule] = useState('');

  // Handle new rule creation
  const handleCreateRule = () => {
    if (newRule.trim() === '') {
      return; // Don't allow empty rules
    }
    onCreateRule(newRule); // Pass new rule to the handler
    setNewRule(''); // Reset input field after creation
  };

  return (
    <div className="rule-container container">
      {/* New rule input field */}
      <div className="create-rule-container">
        <input
          type="text"
          placeholder="Enter new rule"
          value={newRule}
          onChange={(e) => setNewRule(e.target.value)}
          className="new-rule-input"
        />
        <button onClick={handleCreateRule}>Create Rule</button>
      </div>

      <div className="all-rule-container inner-containers">
      <h3>Available Rules</h3>
        <ul>
          {rules.map(rule => (
            <li key={rule._id} className={selectedRules.includes(rule) ? 'selected' : ''}>
              <span>{rule.ruleString}</span>
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
