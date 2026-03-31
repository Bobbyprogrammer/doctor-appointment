import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    questionText: {
      type: String,
      required: true,
      trim: true,
    },
    questionKey: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: [
        "short_text",
        "long_text",
        "single_select",
        "multi_select",
        "yes_no",
        "number",
        "date",
      ],
      required: true,
    },
    placeholder: {
      type: String,
      default: "",
      trim: true,
    },
    helpText: {
      type: String,
      default: "",
      trim: true,
    },
    options: [
      {
        label: {
          type: String,
          required: true,
          trim: true,
        },
        value: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],
    isRequired: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    showIf: {
      questionKey: {
        type: String,
        default: "",
      },
      operator: {
        type: String,
        enum: ["equals", "not_equals", "includes"],
        default: "equals",
      },
      value: {
        type: mongoose.Schema.Types.Mixed,
        default: null,
      },
    },
  },
  { _id: true }
);

const questionnaireSchema = new mongoose.Schema(
  {
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    questions: [questionSchema],
    isActive: {
      type: Boolean,
      default: true,
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

export const Questionnaire = mongoose.model("Questionnaire", questionnaireSchema);