import express from "express";
import {
  createPrescription,
  getMyPrescriptions,
  getDoctorPrescriptions,
  getAllPrescriptions,
  getPrescriptionById,
  updatePrescription,
  deletePrescription,
} from "../controllers/prescription.controller.js";
import { protectRoute,authorizeRoles } from "../middlewares/auth.middleware.js";

import { upload } from "../middlewares/multer.js"

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