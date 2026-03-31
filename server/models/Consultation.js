import mongoose from "mongoose";

const consultationSchema = new mongoose.Schema(
  {
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
  },
  { timestamps: true }
);



export const Consultation = mongoose.model("Consultation", consultationSchema);

