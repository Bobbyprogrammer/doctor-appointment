import express from "express";
import {
  createConsultation,
  getMyConsultations,
  getAssignedConsultationsForDoctor,
  getAllConsultationsForAdmin,
} from "../controllers/consultation.controller.js";
import { protectRoute, authorizeRoles } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.js";

const router = express.Router();

// Patient: create consultation (booking step 1 - before payment)
router.post(
  "/",
  protectRoute,
  authorizeRoles("patient"),
  upload.array("files"),
  createConsultation 
);

// Patient: list own consultations
router.get(
  "/my",
  protectRoute,
  authorizeRoles("patient"),
  getMyConsultations
);

// Doctor: list assigned consultations
router.get(
  "/doctor/assigned",
  protectRoute,
  authorizeRoles("doctor"),
  getAssignedConsultationsForDoctor
);

// Admin: list all consultations
router.get(
  "/admin",
  protectRoute,
  authorizeRoles("admin", "super_admin"),
  getAllConsultationsForAdmin
);


export default router;

