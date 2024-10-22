import mongoose from "mongoose";

const ruleSchema = new mongoose.Schema({
  ruleString: {
    type: String,
    required: true
  },
  ast: {
    type: Object,  // Store the AST as a JSON object
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Rule = mongoose.model("Rule", ruleSchema);

export default Rule;
