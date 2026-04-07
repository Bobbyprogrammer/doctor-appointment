import express from "express";
import multer from "multer";
import { getPharmacies, getPharmacyById, importPharmacies } from "../controllers/pharmacy.controller.js";
import { protectRoute, authorizeRoles } from "../middlewares/auth.middleware.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

// Admin / Super Admin: import pharmacies from excel/csv
router.post(
  "/import",
  protectRoute,
  authorizeRoles("admin", "super_admin"),
  upload.single("file"),
  importPharmacies
);



// Get pharmacy list/search - patient, doctor, admin
router.get(
  "/",
  protectRoute,
  authorizeRoles("patient", "doctor", "admin", "super_admin"),
  getPharmacies
);

// Get single pharmacy by id
router.get(
  "/:id",
  protectRoute,
  authorizeRoles("patient", "doctor", "admin", "super_admin"),
  getPharmacyById
);

export default router;