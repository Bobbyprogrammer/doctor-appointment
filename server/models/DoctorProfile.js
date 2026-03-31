import mongoose from "mongoose";

const doctorProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    specialization: {
      type: String,
      required: [true, "Specialization is required"],
      trim: true,
    },

    licenseNumber: {
      type: String,
      required: [true, "License number is required"],
      unique: true,
      trim: true,
    },

    experienceYears: {
      type: Number,
      default: 0,
      min: 0,
    },

    consultationFee: {
      type: Number,
      default: 0,
      min: 0,
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: "other",
    },

    dateOfBirth: {
      type: Date,
      default: null,
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    address: {
      type: String,
      default: "",
      trim: true,
    },

    bio: {
      type: String,
      default: "",
      trim: true,
    },

    qualification: [
      {
        degree: {
          type: String,
          default: "",
          trim: true,
        },
        institute: {
          type: String,
          default: "",
          trim: true,
        },
        year: {
          type: Number,
          default: null,
        },
      },
    ],

    documents: [
      {
        name: {
          type: String,
          default: "",
          trim: true,
        },
        url: {
          type: String,
          required: true,
          trim: true,
        },
        public_id: {
          type: String,
          required: true,
          trim: true,
        },
        type: {
          type: String,
          default: "document",
          trim: true,
        },
      },
    ],

    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "suspended"],
      default: "approved",
    },

    availableDays: [
      {
        type: String,
        enum: [
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
          "sunday",
        ],
      },
    ],

    workStartTime: {
      type: String,
      default: null,
      trim: true,
    },

    workEndTime: {
      type: String,
      default: null,
      trim: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

export const DoctorProfile = mongoose.model("DoctorProfile", doctorProfileSchema);

