/**
 * Function to evaluate the AST against the provided data.
 *
 * @param {Node} node - The root of the AST.
 * @param {Object} data - The data to evaluate the rule against (e.g., { age: 35, department: 'Sales' }).
 * @returns {boolean} - Returns true if the rule matches the data, false otherwise.
 */
export function evaluateAST(node, data) {
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
  