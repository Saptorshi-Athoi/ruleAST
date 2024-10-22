import mongoose from 'mongoose';

const combinedRuleSchema = new mongoose.Schema({
  combinedRule: {
    type: Object,
    required: true,
  },
  operator: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const CombinedRule = mongoose.model('CombinedRules', combinedRuleSchema);
export default CombinedRule
