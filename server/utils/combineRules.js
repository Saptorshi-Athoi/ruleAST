class Node {
    constructor(type, left = null, right = null, value = null) {
      this.type = type;
      this.left = left;
      this.right = right;
      this.value = value;
    }
  }

/**
 * Combines two AST trees with a given operator (AND/OR).
 *
 * @param {Node} ast1 - The first AST tree.
 * @param {Node} ast2 - The second AST tree.
 * @param {string} operator - The operator to combine the two ASTs ("AND" or "OR").
 * @returns {Node} - A new AST with the two trees combined.
 */
export function combineRules(ast1, ast2, operator) {
  if (!ast1 || !ast2) {
    throw new Error('Both ASTs must be provided for combining.');
  }

  if (!isOperator(operator)) {
    throw new Error(`Invalid operator: ${operator}. Must be "AND" or "OR".`);
  }

  // Create a new node with the given operator and link the two ASTs
  return new Node('operator', ast1, ast2, operator);
}

// Helper function to check if a token is an operator
function isOperator(token) {
  return token === "AND" || token === "OR";
}
