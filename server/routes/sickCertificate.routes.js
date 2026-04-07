import express from "express";
import {
  createSickCertificateRequest,
  getMySickCertificateRequests,
  getDoctorSickCertificateRequests,
  getAllSickCertificateRequests,
  getSickCertificateRequestById,
  assignDoctorToSickCertificate,
  updateSickCertificateStatus,
  createSickCertificatePdf,
  sendSickCertificateToPatient,
  downloadSickCertificatePdf,
  createSickCertificateCheckoutSession,
  verifySickCertificatePayment,
} from "../controllers/sickCertificate.controller.js";

import { protectRoute, authorizeRoles } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.js";

const router = express.Router();

// =========================
// PATIENT
// =========================
router.post(
  "/",
  protectRoute,
  authorizeRoles("patient"),
  upload.array("proofFiles"),
  createSickCertificateRequest
);

router.get(
  "/my",
  protectRoute,
  authorizeRoles("patient"),
  getMySickCertificateRequests
);

router.post(
  "/:id/checkout-session",
  protectRoute,
  authorizeRoles("patient"),
  createSickCertificateCheckoutSession
);

router.get(
  "/verify-payment/:sessionId",
  protectRoute,
  authorizeRoles("patient"),
  verifySickCertificatePayment
);

// =========================
// DOCTOR
// =========================
router.get(
  "/doctor",
  protectRoute,
  authorizeRoles("doctor"),
  getDoctorSickCertificateRequests
);

router.patch(
  "/doctor/:id/status",
  protectRoute,
  authorizeRoles("doctor"),
  updateSickCertificateStatus
);

router.post(
  "/doctor/:id/generate-pdf",
  protectRoute,
  authorizeRoles("doctor"),
  createSickCertificatePdf
);

router.post(
  "/doctor/:id/send-patient",
  protectRoute,
  authorizeRoles("doctor"),
  sendSickCertificateToPatient
);

// =========================
// ADMIN
// =========================
router.get(
  "/admin",
  protectRoute,
  authorizeRoles("admin", "super_admin"),
  getAllSickCertificateRequests
);

router.patch(
  "/admin/:id/assign-doctor",
  protectRoute,
  authorizeRoles("admin", "super_admin"),
  assignDoctorToSickCertificate
);

// =========================
// COMMON
// =========================
router.get(
  "/:id",
  protectRoute,
  authorizeRoles("patient", "doctor", "admin", "super_admin"),
  getSickCertificateRequestById
);

router.get(
  "/:id/download-pdf",
  protectRoute,
  authorizeRoles("patient", "doctor", "admin", "super_admin"),
  downloadSickCertificatePdf
);

export default router;