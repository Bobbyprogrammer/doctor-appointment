import express from "express";
import {
  createDoctor,
  getDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
} from "../controllers/doctor.controller.js";
import { protectRoute, authorizeRoles } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.js";

const router = express.Router();


router.post(
  "/create",
  protectRoute,
  authorizeRoles("admin", "super_admin"),
  upload.fields([
    { name: "profilePic", maxCount: 1 },
    { name: "documents", maxCount: 10 },
  ]),
  createDoctor
);


router.get("/", getDoctors);

router.get("/:id", getDoctorById);

router.put(
  "/update/:id",
  protectRoute,
  authorizeRoles("admin", "super_admin"),
  upload.fields([
    { name: "profilePic", maxCount: 1 },
    { name: "documents", maxCount: 10 },
  ]),
  updateDoctor
);

router.delete(
  "/delete/:id",
  protectRoute,
  authorizeRoles("admin", "super_admin"),
  deleteDoctor
);

export default router;
