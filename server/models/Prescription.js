import mongoose from "mongoose";

const prescriptionMedicineSchema = new mongoose.Schema(
  {
    medicineId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Medicine",
      default: null,
    },

    name: {
      type: String,
      required: true,
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

    dosage: {
      type: String,
      default: "",
      trim: true,
    },

    frequency: {
      type: String,
      default: "",
      trim: true,
    },

    duration: {
      type: String,
      default: "",
      trim: true,
    },

    contraindicationsNotes: {
      type: String,
      default: "",
      trim: true,
    },

    instructions: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { _id: false }
);

const prescriptionFileSchema = new mongoose.Schema(
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
  { _id: false }
);
const patientSnapshotSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      default: "",
      trim: true,
    },
    lastName: {
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
    dateOfBirth: {
      type: Date,
      default: null,
    },
    address: {
      line1: {
        type: String,
        default: "",
        trim: true,
      },
      line2: {
        type: String,
        default: "",
        trim: true,
      },
      city: {
        type: String,
        default: "",
        trim: true,
      },
      state: {
        type: String,
        default: "",
        trim: true,
      },
      postalCode: {
        type: String,
        default: "",
        trim: true,
      },
      country: {
        type: String,
        default: "",
        trim: true,
      },
    },
  },
  { _id: false }
);
const prescriptionSchema = new mongoose.Schema(
  {
    consultationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Consultation",
      required: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reference: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    diagnosis: {
      type: String,
      default: "",
      trim: true,
    },
    notes: {
      type: String,
      default: "",
      trim: true,
    },
    medicines: {
      type: [prescriptionMedicineSchema],
      default: [],
    },
    files: {
      type: [prescriptionFileSchema],
      default: [],
    },

    pdfUrl: {
      type: String,
      default: "",
      trim: true,
    },

    pdfPublicId: {
      type: String,
      default: "",
      trim: true,
    },
    patientSnapshot: {
      type: patientSnapshotSchema,
      default: () => ({}),
    },
    pharmacySnapshot: {
      registrationNumber: {
        type: String,
        default: "",
        trim: true,
      },
      name: {
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
      phone: {
        type: String,
        default: "",
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
    },

    sentToPharmacy: {
      type: Boolean,
      default: false,
    },
    sentToPharmacyAt: {
      type: Date,
      default: null,
    },
    sentToPharmacyBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    sentToPatientEmail: {
      type: Boolean,
      default: false,
    },
    sentToPatientEmailAt: {
      type: Date,
      default: null,
    },
    sentToPatientEmailBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    issuedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const Prescription = mongoose.model("Prescription", prescriptionSchema);