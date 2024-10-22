class Node {
    constructor(type, left = null, right = null, value = null) {
      this.type = type; // "operator" for AND/OR, "operand" for conditions
      this.left = left;
      this.right = right;
      this.value = value; // For operand nodes (condition)
    }
  }
  
  // Helper function to check if a token is an operator
  function isOperator(token) {
    return token === "AND" || token === "OR";
  }
  
  // Helper function to define operator precedence
  function precedence(op) {
    if (op === "AND") return 2;
    if (op === "OR") return 1;
    return 0;
  }
  
  //* Function to create a condition node from a simple condition string (e.g., "age > 30")
  function createConditionNode(condition) {
    let parts = condition.split(/(>=|<=|>|<|=)/); // Split by comparison operators
    
    // Error handling if split doesn't return the expected 3 parts
    if (parts.length < 3) {
      throw new Error(`Invalid condition format: ${condition}`);
    }
  
    return new Node("operand", null, null, { 
      field: parts[0].trim(), // Left-hand side of the condition (e.g., 'age')
      operator: parts[1].trim(), // Comparison operator (e.g., '>')
      value: parts[2].trim() // Right-hand side of the condition (e.g., '30')
    });
  }
  
  //! Main function to convert the rule string into an AST
  function createRule(ruleString) {
    let tokens = ruleString.match(/\w+|>=|<=|>|<|=|'[^']*'|\(|\)|AND|OR/g); // Tokenize the input
    let operandStack = []; // Stack for operands (nodes)
    let operatorStack = []; // Stack for operators (AND/OR)
    let condition = ""; // To accumulate condition tokens
  
    for (let token of tokens) {
      if (token === "(") {
        operatorStack.push(token); // Push opening parenthesis
      } else if (token === ")") {
        // Pop operators and create nodes until we find the matching "("
        if (condition) {
          operandStack.push(createConditionNode(condition.trim())); // Create a node from the accumulated condition
          condition = ""; // Clear the condition string
        }
  
        while (operatorStack.length && operatorStack[operatorStack.length - 1] !== "(") {
          let operator = operatorStack.pop();
          let rightNode = operandStack.pop();
          let leftNode = operandStack.pop();
          operandStack.push(new Node("operator", leftNode, rightNode, operator));
        }
        operatorStack.pop(); // Pop the "("
      } else if (isOperator(token)) {
        if (condition) {
          operandStack.push(createConditionNode(condition.trim())); // Create a node from the accumulated condition
          condition = ""; // Clear the condition string
        }
  
        // Handle operator precedence
        while (operatorStack.length && precedence(operatorStack[operatorStack.length - 1]) >= precedence(token)) {
          let operator = operatorStack.pop();
          let rightNode = operandStack.pop();
          let leftNode = operandStack.pop();
          operandStack.push(new Node("operator", leftNode, rightNode, operator));
        }
        operatorStack.push(token);
      } else {
        // Accumulate condition tokens (e.g., "age > 30" or "department = 'Sales'")
        condition += token + " ";
      }
    }
  
    // After processing all tokens, handle any remaining condition
    if (condition) {
      operandStack.push(createConditionNode(condition.trim())); // Create a node from the last condition
    }
  
    // Final tree construction for remaining operators
    while (operatorStack.length) {
      let operator = operatorStack.pop();
      let rightNode = operandStack.pop();
      let leftNode = operandStack.pop();
      operandStack.push(new Node("operator", leftNode, rightNode, operator));
    }
  
    return operandStack.pop(); // The root of the AST
  }
  
  //* Function to evaluate the AST against the provided data
  function evaluateAST(node, data) {
    if (node.type === "operand") {
      // Extract field, operator, and value
      let { field, operator, value } = node.value;
      let fieldValue = data[field];
  
      // Convert the value for comparison
      if (!isNaN(value)) {
        value = parseFloat(value); // For numeric comparisons
      } else {
        value = value.replace(/'/g, ""); // Remove quotes for strings
      }
  
      // Perform the comparison
      switch (operator) {
        case ">": return fieldValue > value;
        case "<": return fieldValue < value;
        case ">=": return fieldValue >= value;
        case "<=": return fieldValue <= value;
        case "=": return fieldValue === value;
        default: throw new Error(`Unknown operator: ${operator}`);
      }
    } else if (node.type === "operator") {
      let leftResult = evaluateAST(node.left, data);
      let rightResult = evaluateAST(node.right, data);
  
      if (node.value === "AND") {
        return leftResult && rightResult;
      } else if (node.value === "OR") {
        return leftResult || rightResult;
      }
    }
  
    throw new Error("Unknown node type");
  }
  
  // Example usage
  let ruleString = "((age > 30 AND department = 'Marketing')) AND (salary > 20000 OR experience > 5)";
  let astRoot = createRule(ruleString);
  
  // Hardcoded test case
  let data = {
    "age": 49,
    "department": "Marketing",
    "salary": 60000,
    "experience": 3
  };
  
  // Evaluate the rule against the test case
  let result = evaluateAST(astRoot, data);
  console.log("Result of rule evaluation:", result); // Outputs true or false
  