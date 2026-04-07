import express from "express";
import {
  createConsultation,
  getMyConsultations,
  getAssignedConsultationsForDoctor,
  getAllConsultationsForAdmin,
  assignDoctorByAdmin,
  updateConsultationStatusByDoctor,
  getAssignableDoctorsForConsultation,
  createCheckoutSession,
} from "../controllers/consultation.controller.js";
import { protectRoute, authorizeRoles } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.js";

const router = express.Router();

// Patient: create consultation
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

// Doctor: update consultation status
router.patch(
  "/doctor/:consultationId/status",
  protectRoute,
  authorizeRoles("doctor"),
  updateConsultationStatusByDoctor
);

// Admin: list all consultations
router.get(
  "/admin",
  protectRoute,
  authorizeRoles("admin", "super_admin"),
  getAllConsultationsForAdmin
);

// Admin: manually assign doctor
router.patch(
  "/admin/:consultationId/assign-doctor",
  protectRoute,
  authorizeRoles("admin", "super_admin"),
  assignDoctorByAdmin
);
router.get(
  "/admin/:consultationId/assignable-doctors",
  protectRoute,
  authorizeRoles("admin", "super_admin"),
  getAssignableDoctorsForConsultation
);

router.post(
  "/:consultationId/checkout-session",
  protectRoute,
  authorizeRoles("patient"),
  createCheckoutSession
);
export default router;