import express from "express";
import { createRuleController, combineRulesController, evaluateRuleController } from "../controllers/ruleController.js";

const router = express.Router();

router.post("/create", createRuleController);
router.post("/combine", combineRulesController);
router.post("/evaluate", evaluateRuleController);

export default router;
