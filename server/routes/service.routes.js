import express from "express";
import {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
} from "../controllers/service.controller.js";
import { protectRoute, authorizeRoles } from "../middlewares/auth.middleware.js";

const router = express.Router();


router.get("/all", getServices);


router.get("/:id", getServiceById);


router.post(
  "/create",
  protectRoute,
  authorizeRoles("admin", "super_admin"),
  createService
);


router.put(
  "/update/:id",
  protectRoute,
  authorizeRoles("admin", "super_admin"),
  updateService
);


router.delete(
  "/delete/:id",
  protectRoute,
  authorizeRoles("admin", "super_admin"),
  deleteService
);

export default router;

