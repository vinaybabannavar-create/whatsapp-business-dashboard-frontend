// backend/routes/analyticsRoutes.js
import express from "express";
import { getDashboardStats } from "../controllers/analyticsController.js";

const router = express.Router();

// GET /api/analytics/dashboard?range=Today|Week|Month
router.get("/dashboard", getDashboardStats);

export default router;
