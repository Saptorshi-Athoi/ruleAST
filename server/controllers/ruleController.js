import Rule from "../models/ruleModel.js";
import CombinedRule from "../models/combinedRuleModel.js";
import { createRule} from "../utils/astUtils.js";
import { combineRules } from "../utils/combineRules.js";
import { evaluateAST } from "../utils/evaluateAST.js";

export const createRuleController = async (req, res) => {
  try {
    const { ruleString } = req.body;  // Assume ruleString is passed in the request body

    // Create the AST from the rule string
    const astRoot = createRule(ruleString);
    
    // Convert the AST to a formatted JSON string (same as console.log(JSON.stringify(astRoot, null, 2)))
    // const formattedAST = JSON.stringify(astRoot, null, 2);
    
    // Save the rule and its AST in the database
    const newRule = new Rule({
      ruleString: ruleString,
      ast: astRoot // Save the raw AST object (not formatted)
    });
    await newRule.save();

    // Send the formatted JSON as the response
    res.status(200).json(astRoot);
  } catch (error) {
    // In case of any error, send back an error response
    res.status(400).json({ message: "Error creating rule", error: error.message });
  }
};

export const getAllRules = async (req, res) => {
  try {
    const rules = await Rule.find({});
    res.status(200).json(rules);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching rules', error });
  }
};



// @desc Combine rules
// export const combineRulesController = async (req, res) => {
//   try {
//     const { ruleIds } = req.body;

//     const rules = await Rule.find({ _id: { $in: ruleIds } });

//     const combinedAst = combineRules(rules.map(rule => rule.ast));
//     res.status(200).json({ combinedAst });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };
// import CombinedRule from "../models/CombinedRule.js";
// import { combineRules } from "../utils/combineRules.js";
// import Rule from "../models/Rule.js"; // Assuming you have the Rule model for original rules

export const combineRulesController = async (req, res) => {
  try {
    const { ruleId1, ruleId2, operator } = req.body;

    // Fetch the two rules from the database
    const rule1 = await Rule.findById(ruleId1);
    const rule2 = await Rule.findById(ruleId2);

    // console.log(rule1)

    if (!rule1 || !rule2) {
      return res.status(404).json({ message: "One or both rules not found" });
    }

    // Combine the rules
    const combinedAST = combineRules(rule1.ast, rule2.ast, operator);

    // Save the combined rule in the new collection
    const newCombinedRule = new CombinedRule({
      combinedRule: combinedAST,
      operator,
    });

    await newCombinedRule.save();

    // Send the response with the combined AST (formatted as JSON)
    res.status(201).json({
      message: "Combined rule created successfully",
      newCombinedRule
    });
  } catch (error) {
    res.status(500).json({ message: "Error combining rules", error });
  }
};







// @desc Evaluate a rule
export const evaluateRuleController = async (req, res) => {
  try {
    const { ruleId, data } = req.body;

    const rule = await Rule.findById(ruleId);
    if (!rule) {
      return res.status(404).json({ message: "Rule not found" });
    }

    const result = evaluateAST(rule.ast, data);
    res.status(200).json({ result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
