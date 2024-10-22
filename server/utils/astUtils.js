class Node {
    constructor(type, left = null, right = null, value = null) {
      this.type = type;
      this.left = left;
      this.right = right;
      this.value = value;
    }
  }
  
  function isOperator(token) {
    return token === "AND" || token === "OR";
  }
  
  function precedence(op) {
    if (op === "AND") return 2;
    if (op === "OR") return 1;
    return 0;
  }
  
  function createConditionNode(condition) {
    let parts = condition.split(/(>=|<=|>|<|=)/);
  
    if (parts.length < 3) {
      throw new Error(`Invalid condition format: ${condition}`);
    }
  
    return new Node("operand", null, null, {
      field: parts[0].trim(),
      operator: parts[1].trim(),
      value: parts[2].trim()
    });
  }
  
  export function createRule(ruleString) {
    let tokens = ruleString.match(/\w+|>=|<=|>|<|=|'[^']*'|\(|\)|AND|OR/g);
    let operandStack = [];
    let operatorStack = [];
    let condition = "";
  
    for (let token of tokens) {
      if (token === "(") {
        operatorStack.push(token);
      } else if (token === ")") {
        if (condition) {
          operandStack.push(createConditionNode(condition.trim()));
          condition = "";
        }
  
        while (operatorStack.length && operatorStack[operatorStack.length - 1] !== "(") {
          let operator = operatorStack.pop();
          let rightNode = operandStack.pop();
          let leftNode = operandStack.pop();
          operandStack.push(new Node("operator", leftNode, rightNode, operator));
        }
        operatorStack.pop();
      } else if (isOperator(token)) {
        if (condition) {
          operandStack.push(createConditionNode(condition.trim()));
          condition = "";
        }
  
        while (operatorStack.length && precedence(operatorStack[operatorStack.length - 1]) >= precedence(token)) {
          let operator = operatorStack.pop();
          let rightNode = operandStack.pop();
          let leftNode = operandStack.pop();
          operandStack.push(new Node("operator", leftNode, rightNode, operator));
        }
        operatorStack.push(token);
      } else {
        condition += token + " ";
      }
    }
  
    if (condition) {
      operandStack.push(createConditionNode(condition.trim()));
    }
  
    while (operatorStack.length) {
      let operator = operatorStack.pop();
      let rightNode = operandStack.pop();
      let leftNode = operandStack.pop();
      operandStack.push(new Node("operator", leftNode, rightNode, operator));
    }
  
    return operandStack.pop();
  }
  
  // export function evaluateAST(node, data) {
  //   if (node.type === "operand") {
  //     let { field, operator, value } = node.value;
  //     let fieldValue = data[field];
  
  //     if (!isNaN(value)) {
  //       value = parseFloat(value);
  //     } else {
  //       value = value.replace(/'/g, "");
  //     }
  
  //     switch (operator) {
  //       case ">": return fieldValue > value;
  //       case "<": return fieldValue < value;
  //       case ">=": return fieldValue >= value;
  //       case "<=": return fieldValue <= value;
  //       case "=": return fieldValue === value;
  //       default: throw new Error(`Unknown operator: ${operator}`);
  //     }
  //   } else if (node.type === "operator") {
  //     let leftResult = evaluateAST(node.left, data);
  //     let rightResult = evaluateAST(node.right, data);
  
  //     if (node.value === "AND") {
  //       return leftResult && rightResult;
  //     } else if (node.value === "OR") {
  //       return leftResult || rightResult;
  //     }
  //   }
  
  //   throw new Error("Unknown node type");
  // }
  