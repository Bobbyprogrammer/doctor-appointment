import express from "express";
import {
  createPrescription,
  getMyPrescriptions,
  getDoctorPrescriptions,
  getAllPrescriptions,
  getPrescriptionById,
  updatePrescription,
  deletePrescription,
  sendPrescriptionToPharmacy,
  sendPrescriptionToPatient,
  downloadPrescriptionPdf,
} from "../controllers/prescription.controller.js";
import { protectRoute, authorizeRoles } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.js";

const router = express.Router();

// Patient: own prescriptions
router.get(
  "/my",
  protectRoute,
  authorizeRoles("patient"),
  getMyPrescriptions
);

// Doctor: own issued prescriptions
router.get(
  "/doctor",
  protectRoute,
  authorizeRoles("doctor"),
  getDoctorPrescriptions
);

// Admin: all prescriptions
router.get(
  "/admin",
  protectRoute,
  authorizeRoles("admin", "super_admin"),
  getAllPrescriptions
);

// Single prescription
router.get(
  "/:id",
  protectRoute,
  authorizeRoles("patient", "doctor", "admin", "super_admin"),
  getPrescriptionById
);

// Download PDF
router.get(
  "/:id/download",
  protectRoute,
  authorizeRoles("patient", "doctor", "admin", "super_admin"),
  downloadPrescriptionPdf
);

// Send to pharmacy
router.post(
  "/:id/send-to-pharmacy",
  protectRoute,
  authorizeRoles("doctor", "admin", "super_admin"),
  sendPrescriptionToPharmacy
);

// Send to patient email
router.post(
  "/:id/send-to-patient-email",
  protectRoute,
  authorizeRoles("doctor", "admin", "super_admin"),
  sendPrescriptionToPatient
);

// Create prescription
router.post(
  "/",
  protectRoute,
  authorizeRoles("doctor", "admin", "super_admin"),
  upload.array("files"),
  createPrescription
);

// Update prescription
router.put(
  "/:id",
  protectRoute,
  authorizeRoles("doctor", "admin", "super_admin"),
  upload.array("files"),
  updatePrescription
);

// Delete prescription
router.delete(
  "/:id",
  protectRoute,
  authorizeRoles("admin", "super_admin"),
  deletePrescription
);

export default router;