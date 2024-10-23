import express from "express";
import { createRuleController, combineRulesController, evaluateRuleController, getAllRules } from "../controllers/ruleController.js";

const router = express.Router();

router.get("/getRules", getAllRules);
router.post("/create", createRuleController);
router.post("/combine", combineRulesController);
router.post("/evaluate", evaluateRuleController);

export default router;
