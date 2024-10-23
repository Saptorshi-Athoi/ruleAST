import React, { useState } from 'react';

const SelectedRulesContainer = ({ selectedRules, setSelectedRules, mode, onDoneSelection, setOutput }) => {
  const [testCase, setTestCase] = useState('');

  const handleRun = async () => {
    try {
      const response = await fetch(`/api/evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ruleId: selectedRules[0]._id, data: testCase }) // Send ruleId and test case data
      });
      
      if (!response.ok) {
        throw new Error('Failed to evaluate rule');
      }

      const result = await response.json();
      setOutput(result.result);
    } catch (error) {
      console.error('Error running evaluation:', error);
    }
  };

  return (
    <div className="selected-rules-container container">
      <h3>Selected Rules</h3>
      <div className="inner-containers selected-rules-inner-container">
        <ul>
          {selectedRules.map(rule => (
            <li key={rule._id}>
              <span>{rule.name}</span>
              <button onClick={() => setSelectedRules(selectedRules.filter(r => r !== rule))}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
      <div className="test-case-input">
        <h4>Input Test Case</h4>
        <input 
          value={testCase} 
          onChange={(e) => setTestCase(e.target.value)} 
          className="test-case-input-field all-inputs"  
        />
        <button onClick={handleRun}>Run</button>
      </div>
    </div>
  );
};

export default SelectedRulesContainer;
