
import express from "express";
import {
  createQuestionnaire,
  getAllQuestionnaires,
  getQuestionnaireById,
  getQuestionnaireByServiceId,
  updateQuestionnaire,
  deleteQuestionnaire,
} from "../controllers/questionnaire.controller.js";
import { protectRoute,authorizeRoles } from "../middlewares/auth.middleware.js";


const router = express.Router();

// Admin / Super Admin
router.post(
  "/",
  protectRoute,
  authorizeRoles("admin", "super_admin"),
  createQuestionnaire
);

router.get(
  "/",
  protectRoute,
  authorizeRoles("admin", "super_admin"),
  getAllQuestionnaires
);

router.get(
  "/:id",
  protectRoute,
  authorizeRoles("admin", "super_admin"),
  getQuestionnaireById
);

router.put(
  "/:id",
  protectRoute,
  authorizeRoles("admin", "super_admin"),
  updateQuestionnaire
);

router.delete(
  "/:id",
  protectRoute,
  authorizeRoles("admin", "super_admin"),
  deleteQuestionnaire
);

// Public / Patient usage for booking flow
router.get("/service/:serviceId", getQuestionnaireByServiceId);

export default router;