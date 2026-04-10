import mongoose from "mongoose";

const consultationSchema = new mongoose.Schema(
  {


    pharmacySelectionType: {
  type: String,
  enum: ["listed", "other", "none"],
  default: "none",
},

selectedPharmacyId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Pharmacy",
  default: null,
},

selectedPharmacySnapshot: {
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
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    patientType: {
      type: String,
      enum: ["self", "child", "other"],
      default: "self",
    },
    patientDob: {
      type: Date,
      default: null,
    },

    patientAddress: {
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
        default: "Ireland",
        trim: true,
      },
    },
    scheduledAt: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: [
        "pending_payment",
        "waiting_for_review",
        "under_review",
        "doctor_message_sent",
        "completed",
        "rejected",
        "cancelled",
      ],
      default: "pending_payment",
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "refunded"],
      default: "unpaid",
    },
    amount: {
      type: Number,
      default: 0,
    },
    notes: {
      type: String,
      default: "",
      trim: true,
    },
    questionnaireAnswers: [
      {
        questionId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
        questionKey: {
          type: String,
          required: true,
          trim: true,
        },
        questionText: {
          type: String,
          required: true,
          trim: true,
        },
        questionType: {
          type: String,
          required: true,
          trim: true,
        },
        answer: {
          type: mongoose.Schema.Types.Mixed,
          default: null,
        },
      },
    ],
    files: [
      {
        name: String,
        url: String,
        public_id: String,
        type: {
          type: String,
          default: "document",
        },
      },
    ],
    reference: {
      type: String,
      unique: true,
    },
    hasEmergencyFlag: {
      type: Boolean,
      default: false,
    },

    assignmentHistory: [
      {
        doctorId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          default: null,
        },
        assignedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          default: null,
        },
        note: {
          type: String,
          default: "",
          trim: true,
        },
        assignedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    statusHistory: [
      {
        status: {
          type: String,
          enum: [
            "pending_payment",
            "waiting_for_review",
            "under_review",
            "doctor_message_sent",
            "completed",
            "rejected",
            "cancelled",
          ],
        },
        changedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          default: null,
        },
        note: {
          type: String,
          default: "",
          trim: true,
        },
        changedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
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



    
  },
  { timestamps: true }
);

export const Consultation = mongoose.model("Consultation", consultationSchema);