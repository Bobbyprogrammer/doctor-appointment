import express from "express";
import { upload } from "../middlewares/multer.js";
import { deletePatient, getPatients, updatePatient } from "../controllers/patient.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/all", getPatients);
router.delete("/delete/:id", deletePatient);
router.put("/me",protectRoute,upload.single("profilePic"), updatePatient);


export default router;
