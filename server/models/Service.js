

import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Service name is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Service slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    category: {
      type: String,
      default: "general",
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Service price is required"],
      min: 0,
    },
    discountedPrice: {
      type: Number,
      default: null,
      min: 0,
    },
    durationMinutes: {
      type: Number,
      default: 15,
      min: 5,
    },
    doctorType: {
      type: String,
      default: "gp",
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    minAge: {
      type: Number,
      default: null,
    },
    maxAge: {
      type: Number,
      default: null,
    },
    allowForChild: {
      type: Boolean,
      default: true,
    },
    allowForSomeoneElse: {
      type: Boolean,
      default: false,
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
    questionnaireId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Questionnaire",
      default: null,
    },
  },
  { timestamps: true }
);

export const Service = mongoose.model("Service", serviceSchema);



