import React, { useState, useEffect } from 'react';
import RuleContainer from './components/RuleContainer';
import SelectedRulesContainer from './components/SelectedRulesContainer';
import ASTContainer from './components/ASTContainer';
import OutputContainer from './components/OutputContainer';
import './App.css'; // Add basic styling
import axios from 'axios'

const App = () => {
  const [rules, setRules] = useState([]);
  const [selectedRules, setSelectedRules] = useState([]);
  const [mode, setMode] = useState(null); // "evaluate" or "combine"
  const [ast, setAst] = useState(null);
  const [output, setOutput] = useState(null);

  let axiosConfig = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      "Access-Control-Allow-Origin": "*",
    },
  };

  // Fetch rules from the API
  useEffect(() => {
    const fetchRules = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/rules/getRules');
        const data = await response.json();
        // console.log(data)
        // console.log(data[0].ruleString)
        setRules(data);
      } catch (error) {
        console.error("Failed to fetch rules:", error);
      }
    };
    fetchRules();
  }, []);

  const handleRuleSelection = (rule) => {
    if (mode === 'evaluate' && selectedRules.length === 0) {
      setSelectedRules([rule]);
    } else if (mode === 'combine') {
      setSelectedRules([...selectedRules, rule]);
    }
  };

  // const handleCreateRule = async (newRule) => {
  //   try {
  //     // console.log(newRule)
  //     // console.log(typeof(newRule))
  //     // console.log(JSON.stringify(newRule))
  //     // console.log(typeof(JSON.stringify(newRule)))
  //     const response = await fetch('http://localhost:8000/api/rules/create', {
  //       method: 'POST',
  //       mode:'no-cors',
  //       headers: { 
  //         'Content-Type': 'application/json',
  //         // "Access-Control-Allow-Origin": "*",
  //        },
  //       body: JSON.stringify(newRule),
  //     });
  //     const createdRule = await response.json();
  //     setRules([...rules, createdRule]); // Add new rule to the existing list
  //   } catch (error) {
  //     console.error("Failed to create rule:", error);
  //   }
  // };
  //*--------------------------------------------------------------------------------------------------------
  const handleCreateRule = async (newRule) => {
    try {
      let ruleData = {
        ruleString : newRule
      }
      const response = await axios.post('http://localhost:8000/api/rules/create', JSON.stringify(ruleData), {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const createdRule = response.data;
      setRules([...rules, createdRule]); 
    } catch (error) {
      console.error("Failed to create rule:", error);
    }
  };
  //*--------------------------------------------------------------------------------------------------------
  // Handle completion of selection
  const handleDoneSelection = async () => {
    setMode(null);
    try {
      if (mode === 'evaluate') {
        const response = await fetch(`http://localhost:8000/api/rules/evaluate/${selectedRules[0]._id}`);
        const data = await response.json();
        setAst(data.ast);
      } else if (mode === 'combine') {
        const ruleIds = selectedRules.map(rule => rule._id);
        const response = await fetch(`http://localhost:8000/api/rules/combine`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ rules: ruleIds }), // Sending selected rule IDs
        });
        const data = await response.json();
        setAst(data.ast);
      }
    } catch (error) {
      console.error("Failed to fetch AST:", error);
    }
  };


  return (
    <div className="app-container">
      <div className="left-block">
        <RuleContainer 
          rules={rules} 
          onRuleSelect={handleRuleSelection} 
          mode={mode} 
          onCreateRule={handleCreateRule}
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
