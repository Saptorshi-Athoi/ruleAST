import React, { useState, useEffect } from 'react';
import RuleContainer from './components/RuleContainer';
import SelectedRulesContainer from './components/SelectedRulesContainer';
import ASTContainer from './components/ASTContainer';
import OutputContainer from './components/OutputContainer';
import './App.css'; // Add basic styling

const App = () => {
  const [rules, setRules] = useState([]);
  const [selectedRules, setSelectedRules] = useState([]);
  const [mode, setMode] = useState(null); // "evaluate" or "combine"
  const [ast, setAst] = useState(null);
  const [output, setOutput] = useState(null);

  // Fetch rules from the API
  useEffect(() => {
    fetch('/api/rules') // Assuming this API fetches all the rules
      .then(response => response.json())
      .then(data => setRules(data));
  }, []);

  // Handle rule selection for evaluation or combination
  const handleRuleSelection = (rule) => {
    if (mode === 'evaluate' && selectedRules.length === 0) {
      setSelectedRules([rule]);
    } else if (mode === 'combine') {
      setSelectedRules([...selectedRules, rule]);
    }
  };

  // Handle completion of selection
  const handleDoneSelection = () => {
    setMode(null);
    // Fetch or generate AST based on selected rules
    if (mode === 'evaluate') {
      fetch(`/api/evaluate/${selectedRules[0]._id}`) // Assume this endpoint evaluates a single rule
        .then(response => response.json())
        .then(data => setAst(data.ast));
    } else if (mode === 'combine') {
      // Combine logic
      const ruleIds = selectedRules.map(rule => rule._id);
      fetch(`/api/combine`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rules: ruleIds }) // Sending selected rule IDs
      })
      .then(response => response.json())
      .then(data => setAst(data.ast));
    }
  };

  return (
    <div className="app-container">
      <div className="left-block">
        <RuleContainer 
          rules={rules} 
          onRuleSelect={handleRuleSelection} 
          mode={mode} 
          setMode={setMode}
          selectedRules={selectedRules} 
        />
        <SelectedRulesContainer 
          selectedRules={selectedRules} 
          setSelectedRules={setSelectedRules} 
          mode={mode} 
          onDoneSelection={handleDoneSelection}
          setOutput={setOutput}
        />

      </div>
      <div className="right-block">
        <ASTContainer ast={ast} />
        <OutputContainer output={output} />

      </div>
    </div>
  );
};

export default App;
