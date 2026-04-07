import express from "express";
import {
  createBlog,
  getPublishedBlogs,
  getPublishedBlogBySlug,
  getAllBlogsForAdmin,
  getBlogById,
  updateBlog,
  deleteBlog,
} from "../controllers/blog.controller.js";

import { protectRoute, authorizeRoles } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.js";

const router = express.Router();

// =========================
// PUBLIC ROUTES
// =========================
router.get("/", getPublishedBlogs);
router.get("/slug/:slug", getPublishedBlogBySlug);

// =========================
// ADMIN ROUTES
// =========================
router.get(
  "/admin/all",
  protectRoute,
  authorizeRoles("admin", "super_admin"),
  getAllBlogsForAdmin
);

router.get(
  "/admin/:id",
  protectRoute,
  authorizeRoles("admin", "super_admin"),
  getBlogById
);

router.post(
  "/admin/create",
  protectRoute,
  authorizeRoles("admin", "super_admin"),
  upload.single("thumbnail"),
  createBlog
);

router.put(
  "/admin/update/:id",
  protectRoute,
  authorizeRoles("admin", "super_admin"),
  upload.single("thumbnail"),
  updateBlog
);

router.delete(
  "/admin/:id",
  protectRoute,
  authorizeRoles("admin", "super_admin"),
  deleteBlog
);

export default router;