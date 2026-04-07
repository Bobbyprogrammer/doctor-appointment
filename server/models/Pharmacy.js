import mongoose from "mongoose";

const pharmacySchema = new mongoose.Schema(
  {
    registrationNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    street1: {
      type: String,
      default: "",
      trim: true,
    },
    street2: {
      type: String,
      default: "",
      trim: true,
    },
    street3: {
      type: String,
      default: "",
      trim: true,
    },
    town: {
      type: String,
      default: "",
      trim: true,
    },
    county: {
      type: String,
      default: "",
      trim: true,
    },
    eircode: {
      type: String,
      default: "",
      trim: true,
    },
    phone: {
      type: String,
      default: "",
      trim: true,
    },
    email: {
      type: String,
      default: "",
      trim: true,
      lowercase: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    importSource: {
      type: String,
      default: "manual",
      trim: true,
    },
  },
  { timestamps: true }
);

export const Pharmacy = mongoose.model("Pharmacy", pharmacySchema);