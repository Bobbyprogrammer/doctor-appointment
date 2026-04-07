import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema(
  {
    medicineName: {
      type: String,
      required: [true, "Medicine name is required"],
      trim: true,
    },
    genericName: {
      type: String,
      default: "",
      trim: true,
    },
    strength: {
      type: String,
      default: "",
      trim: true,
    },
    form: {
      type: String,
      default: "",
      trim: true,
    },
    indication: {
      type: String,
      default: "",
      trim: true,
    },
    adultDose: {
      type: String,
      default: "",
      trim: true,
    },
    frequency: {
      type: String,
      default: "",
      trim: true,
    },
    typicalDuration: {
      type: String,
      default: "",
      trim: true,
    },
    contraindicationsNotes: {
      type: String,
      default: "",
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    importedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

// helpful indexes for searching
medicineSchema.index({ medicineName: 1 });
medicineSchema.index({ genericName: 1 });
medicineSchema.index({ indication: 1 });

// prevent duplicate same medicine+strength+form
medicineSchema.index(
  { medicineName: 1, strength: 1, form: 1 },
  { unique: true }
);

export const Medicine = mongoose.model("Medicine", medicineSchema);