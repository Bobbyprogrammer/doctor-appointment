import express from "express";

import { protectRoute, authorizeRoles } from "../middlewares/auth.middleware.js";

import { getDashboardStats } from "../controllers/admin.controller.js";

const router = express.Router();


router.get(
  "/stats",
  protectRoute,
  authorizeRoles("admin", "super_admin"),
  getDashboardStats
);





export default router;
