import express from "express";
import {
  importMedicines,
  getAllMedicines,
  getMedicineById,
  deleteMedicine,
} from "../controllers/medicine.controller.js";

import { protectRoute, authorizeRoles } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.js";

const router = express.Router();

// =========================
// COMMON (doctor/admin/patient if needed later)
// =========================
router.get(
  "/",
  protectRoute,
  authorizeRoles("doctor", "admin", "super_admin"),
  getAllMedicines
);

router.get(
  "/:id",
  protectRoute,
  authorizeRoles("doctor", "admin", "super_admin"),
  getMedicineById
);

// =========================
// ADMIN
// =========================
router.post(
  "/import",
  protectRoute,
  authorizeRoles("admin", "super_admin"),
  upload.single("file"),
  importMedicines
);

router.delete(
  "/:id",
  protectRoute,
  authorizeRoles("admin", "super_admin"),
  deleteMedicine
);

export default router;