import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Blog title is required"],
      trim: true,
    },

    slug: {
      type: String,
      required: [true, "Blog slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    shortDescription: {
      type: String,
      default: "",
      trim: true,
    },

    content: {
      type: String,
      required: [true, "Blog content is required"],
      default: "",
    },

    thumbnail: {
      type: String,
      default: "",
      trim: true,
    },

    thumbnailPublicId: {
      type: String,
      default: "",
      trim: true,
    },

    category: {
      type: String,
      default: "general",
      trim: true,
    },

    tags: {
      type: [String],
      default: [],
    },

    authorName: {
      type: String,
      default: "Admin",
      trim: true,
    },

    isPublished: {
      type: Boolean,
      default: false,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    publishedAt: {
      type: Date,
      default: null,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

// Helpful indexes
blogSchema.index({ slug: 1 });
blogSchema.index({ isPublished: 1, publishedAt: -1 });
blogSchema.index({ category: 1 });
blogSchema.index({ createdAt: -1 });

export const Blog = mongoose.model("Blog", blogSchema);