import mongoose from "mongoose";

const uploadedFileSchema = new mongoose.Schema(
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

const sickCertificateSchema = new mongoose.Schema(
  {
    // =========================
    // PATIENT LINK
    // =========================
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    reference: {
      type: String,
      unique: true,
      trim: true,
    },

    // =========================
    // STEP 1 - PERSONAL INFO
    // =========================
    certificatePurpose: {
      type: String,
      enum: ["studies", "work", "travel", "work_from_home"],
      required: true,
    },

    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    dateOfBirth: {
      type: Date,
      required: true,
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: "other",
    },

    addressLine1: {
      type: String,
      required: true,
      trim: true,
    },

    addressLine2: {
      type: String,
      default: "",
      trim: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    stateRegion: {
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
      default: "Ireland",
      trim: true,
    },

    // =========================
    // STEP 2 - MEDICAL QUESTIONS
    // =========================
    employerOrOrganization: {
      type: String,
      required: true,
      trim: true,
    },

    consultationReason: {
      type: String,
      required: true,
      trim: true,
    },

    hasMedicalEmergency: {
      type: Boolean,
      default: false,
    },

    canTravelToClinic: {
      type: Boolean,
      default: true,
    },

    isPregnant: {
      type: Boolean,
      default: false,
    },

    awareOfRedFlags: {
      type: Boolean,
      default: true,
    },

    symptoms: {
      type: [String],
      default: [],
    },

    illnessDescription: {
      type: String,
      required: true,
      trim: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    proofFiles: {
      type: [uploadedFileSchema],
      default: [],
    },

    // =========================
    // STEP 3 - VARIATION / PRICE
    // =========================
    variationType: {
      type: String,
      enum: ["express", "standard"],
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      default: 0,
    },

    // =========================
    // PAYMENT
    // =========================
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "refunded"],
      default: "unpaid",
    },

    stripeCheckoutSessionId: {
      type: String,
      default: null,
    },

    stripePaymentIntentId: {
      type: String,
      default: null,
    },

    paidAt: {
      type: Date,
      default: null,
    },

    // =========================
    // REQUEST STATUS
    // =========================
    status: {
      type: String,
      enum: [
        "pending_payment",
        "waiting_for_review",
        "under_review",
        "approved",
        "certificate_generated",
        "rejected",
        "cancelled",
      ],
      default: "pending_payment",
    },

    doctorReviewNotes: {
      type: String,
      default: "",
      trim: true,
    },

    // =========================
    // GENERATED CERTIFICATE
    // =========================
    certificateIssueDate: {
      type: Date,
      default: null,
    },

    certificatePdfUrl: {
      type: String,
      default: "",
      trim: true,
    },

    certificatePdfPublicId: {
      type: String,
      default: "",
      trim: true,
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
  },
  { timestamps: true }
);

export const SickCertificate = mongoose.model(
  "SickCertificate",
  sickCertificateSchema
);