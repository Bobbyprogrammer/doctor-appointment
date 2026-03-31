import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  adminLogin,
  getUser,

} from "../controllers/auth.controller.js";
import { upload } from "../middlewares/multer.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", upload.single("profilePic"), registerUser);

router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/admin/login", adminLogin);
router.get("/me", protectRoute,getUser);

export default router;
