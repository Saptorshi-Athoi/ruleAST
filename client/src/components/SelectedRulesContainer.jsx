import React, { useState } from 'react';

const SelectedRulesContainer = ({ selectedRules, setSelectedRules, mode, onDoneSelection, setOutput }) => {
  const [testCase, setTestCase] = useState('');

  const handleRun = () => {
    fetch(`/api/evaluate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rules: selectedRules, testCase }) // Send selected rules and test case
    })
      .then(response => response.json())
      .then(data => setOutput(data.output));
  };

  return (
    <div className="selected-rules-container container">
      <h3>Selected Rules</h3>
      <ul>
        {selectedRules.map(rule => (
          <li key={rule._id}>
            <span>{rule.name}</span>
            <button onClick={() => setSelectedRules(selectedRules.filter(r => r !== rule))}>Delete</button>
          </li>
        ))}
      </ul>
      {mode && <button onClick={onDoneSelection}>Done Selection</button>}
      
      {mode === 'evaluate' && (
        <div className="test-case-input">
          <h4>Input Test Case</h4>
          <textarea value={testCase} onChange={(e) => setTestCase(e.target.value)} />
          <button onClick={handleRun}>Run</button>
        </div>
      )}
    </div>
  );
};

export default SelectedRulesContainer;
