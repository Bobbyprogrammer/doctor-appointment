import mongoose from "mongoose";
import { Blog } from "../models/Blog.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../config/cloudinary.js";

// =========================
// CREATE BLOG
// =========================
export const createBlog = async (req, res) => {
  try {
    const {
      title,
      slug,
      shortDescription = "",
      content,
      category = "general",
      tags = [],
      authorName = "Admin",
      isPublished = false,
      isFeatured = false,
    } = req.body;

    if (!title || !slug || !content) {
      return res.status(400).json({
        success: false,
        message: "Title, slug and content are required",
      });
    }

    const existingBlog = await Blog.findOne({ slug: slug.toLowerCase().trim() });

    if (existingBlog) {
      return res.status(400).json({
        success: false,
        message: "A blog with this slug already exists",
      });
    }

    let thumbnail = "";
    let thumbnailPublicId = "";

    if (req.file) {
      const uploaded = await uploadToCloudinary(req.file.buffer, {
        folder: "telemedicine/blogs",
        resource_type: "image",
      });

      thumbnail = uploaded.url;
      thumbnailPublicId = uploaded.public_id;
    }

    const parsedTags =
      typeof tags === "string"
        ? tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean)
        : Array.isArray(tags)
        ? tags
        : [];

    const blog = await Blog.create({
      title: title.trim(),
      slug: slug.toLowerCase().trim(),
      shortDescription: shortDescription.trim(),
      content,
      thumbnail,
      thumbnailPublicId,
      category: category.trim(),
      tags: parsedTags,
      authorName: authorName.trim(),
      isPublished: String(isPublished) === "true" || isPublished === true,
      isFeatured: String(isFeatured) === "true" || isFeatured === true,
      publishedAt:
        String(isPublished) === "true" || isPublished === true
          ? new Date()
          : null,
      createdBy: req.user?._id || null,
      updatedBy: req.user?._id || null,
    });

    return res.status(201).json({
      success: true,
      message: "Blog created successfully",
      blog,
    });
  } catch (error) {
    console.error("Error in createBlog:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// =========================
// GET ALL PUBLISHED BLOGS (PUBLIC)
// =========================
export const getPublishedBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ isPublished: true })
      .sort({ publishedAt: -1, createdAt: -1 })
      .select("-content");

    return res.status(200).json({
      success: true,
      count: blogs.length,
      blogs,
    });
  } catch (error) {
    console.error("Error in getPublishedBlogs:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// =========================
// GET BLOG BY SLUG (PUBLIC)
// =========================
export const getPublishedBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const blog = await Blog.findOne({
      slug: slug.toLowerCase().trim(),
      isPublished: true,
    });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    return res.status(200).json({
      success: true,
      blog,
    });
  } catch (error) {
    console.error("Error in getPublishedBlogBySlug:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// =========================
// GET ALL BLOGS FOR ADMIN
// =========================
export const getAllBlogsForAdmin = async (req, res) => {
  try {
    const blogs = await Blog.find({})
      .sort({ createdAt: -1 })
      .populate("createdBy", "firstName lastName email")
      .populate("updatedBy", "firstName lastName email");

    return res.status(200).json({
      success: true,
      count: blogs.length,
      blogs,
    });
  } catch (error) {
    console.error("Error in getAllBlogsForAdmin:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// =========================
// GET BLOG BY ID (ADMIN)
// =========================
export const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid blog id",
      });
    }

    const blog = await Blog.findById(id)
      .populate("createdBy", "firstName lastName email")
      .populate("updatedBy", "firstName lastName email");

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    return res.status(200).json({
      success: true,
      blog,
    });
  } catch (error) {
    console.error("Error in getBlogById:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// =========================
// UPDATE BLOG
// =========================
export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid blog id",
      });
    }

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    const {
      title,
      slug,
      shortDescription,
      content,
      category,
      tags,
      authorName,
      isPublished,
      isFeatured,
    } = req.body;

    // Check slug uniqueness if changed
    if (slug && slug.toLowerCase().trim() !== blog.slug) {
      const existingSlug = await Blog.findOne({
        slug: slug.toLowerCase().trim(),
        _id: { $ne: blog._id },
      });

      if (existingSlug) {
        return res.status(400).json({
          success: false,
          message: "Another blog already uses this slug",
        });
      }
    }

    // Replace thumbnail if new one uploaded
    if (req.file) {
      if (blog.thumbnailPublicId) {
        await deleteFromCloudinary(blog.thumbnailPublicId, "image");
      }

      const uploaded = await uploadToCloudinary(req.file.buffer, {
        folder: "telemedicine/blogs",
        resource_type: "image",
      });

      blog.thumbnail = uploaded.url;
      blog.thumbnailPublicId = uploaded.public_id;
    }

    const parsedTags =
      typeof tags === "string"
        ? tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean)
        : Array.isArray(tags)
        ? tags
        : blog.tags;

    if (title !== undefined) blog.title = title.trim();
    if (slug !== undefined) blog.slug = slug.toLowerCase().trim();
    if (shortDescription !== undefined) blog.shortDescription = shortDescription.trim();
    if (content !== undefined) blog.content = content;
    if (category !== undefined) blog.category = category.trim();
    if (authorName !== undefined) blog.authorName = authorName.trim();
    blog.tags = parsedTags;

    if (isFeatured !== undefined) {
      blog.isFeatured = String(isFeatured) === "true" || isFeatured === true;
    }

    if (isPublished !== undefined) {
      const nextPublished = String(isPublished) === "true" || isPublished === true;

      if (!blog.isPublished && nextPublished) {
        blog.publishedAt = new Date();
      }

      if (!nextPublished) {
        blog.publishedAt = null;
      }

      blog.isPublished = nextPublished;
    }

    blog.updatedBy = req.user?._id || null;

    await blog.save();

    return res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      blog,
    });
  } catch (error) {
    console.error("Error in updateBlog:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// =========================
// DELETE BLOG
// =========================
export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid blog id",
      });
    }

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    if (blog.thumbnailPublicId) {
      await deleteFromCloudinary(blog.thumbnailPublicId, "image");
    }

    await Blog.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteBlog:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};