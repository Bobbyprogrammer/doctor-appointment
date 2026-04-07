import { Consultation } from "../models/Consultation.js";
import { Service } from "../models/Service.js";
import { DoctorProfile } from "../models/DoctorProfile.js";
import { uploadToCloudinary } from "../config/cloudinary.js";
import { Questionnaire } from "../models/Questionnaire.js";
import { User } from "../models/User.js";
import { Pharmacy } from "../models/Pharmacy.js";

import mongoose from "mongoose";
import { stripe } from "../config/stripe.js";
export const createConsultation = async (req, res) => {
  try {
    const {
      serviceId,
      scheduledAt,
      notes,
      patientType = "self",
      patientDob,
      pharmacySelectionType = "none",
      selectedPharmacyId = null,
      selectedPharmacyOther = null,
    } = req.body;


    let questionnaireAnswers = [];
    if (req.body.questionnaireAnswers) {
      try {
        questionnaireAnswers =
          typeof req.body.questionnaireAnswers === "string"
            ? JSON.parse(req.body.questionnaireAnswers)
            : req.body.questionnaireAnswers;
      } catch {
        questionnaireAnswers = [];
      }
    }

    let redFlags = {};
    if (req.body.redFlags) {
      try {
        redFlags =
          typeof req.body.redFlags === "string"
            ? JSON.parse(req.body.redFlags)
            : req.body.redFlags;
      } catch {
        redFlags = {};
      }
    }

    let parsedSelectedPharmacyOther = null;
    if (selectedPharmacyOther) {
      try {
        parsedSelectedPharmacyOther =
          typeof selectedPharmacyOther === "string"
            ? JSON.parse(selectedPharmacyOther)
            : selectedPharmacyOther;
      } catch {
        parsedSelectedPharmacyOther = null;
      }
    }

    if (!serviceId) {
      return res.status(400).json({
        success: false,
        message: "Service is required",
      });
    }

    const service = await Service.findById(serviceId);
    if (!service || !service.isActive) {
      return res.status(404).json({
        success: false,
        message: "Service not found or inactive",
      });
    }

    const normalizedType =
      patientType === "child" || patientType === "other" ? patientType : "self";

    if (normalizedType === "child" && service.allowForChild === false) {
      return res.status(400).json({
        success: false,
        message:
          "This service is not suitable for children. Please contact your local healthcare provider.",
      });
    }

    if (normalizedType === "other" && service.allowForSomeoneElse === false) {
      return res.status(400).json({
        success: false,
        message:
          "This service must be completed by the patient themselves. Third-party requests are not allowed.",
      });
    }

    let age = null;
    let dobDate = null;

    if (patientDob) {
      const parsed = new Date(patientDob);
      if (!isNaN(parsed.getTime())) {
        dobDate = parsed;
        const diffMs = Date.now() - parsed.getTime();
        age = new Date(diffMs).getUTCFullYear() - 1970;
      }
    }

    if (age !== null) {
      if (
        service.minAge !== null &&
        service.minAge !== undefined &&
        age < service.minAge
      ) {
        return res.status(400).json({
          success: false,
          message: `This service is only available for patients aged ${service.minAge}+ years.`,
        });
      }

      if (
        service.maxAge !== null &&
        service.maxAge !== undefined &&
        age > service.maxAge
      ) {
        return res.status(400).json({
          success: false,
          message: `This service is not suitable for patients above ${service.maxAge} years.`,
        });
      }
    }

    const red = redFlags || {};
    const emergencyKeys = [
      "chestPain",
      "severeBreathingDifficulty",
      "confusion",
      "severeAbdominalPain",
      "fainting",
    ];

    const hasEmergencyFlag = emergencyKeys.some((key) => Boolean(red[key]));

    if (hasEmergencyFlag) {
      return res.status(400).json({
        success: false,
        message:
          "This condition may require urgent medical attention. Please contact emergency services or attend your nearest emergency department.",
      });
    }

    // Validate questionnaire answers against service questionnaire
    let normalizedQuestionnaireAnswers = [];

    const questionnaire = await Questionnaire.findOne({
      serviceId: service._id,
      isActive: true,
    }).lean();

    if (questionnaire) {
      if (!Array.isArray(questionnaireAnswers)) {
        return res.status(400).json({
          success: false,
          message: "Questionnaire answers must be an array",
        });
      }

      const questionMap = new Map();
      for (const question of questionnaire.questions || []) {
        questionMap.set(String(question._id), question);
      }

      const providedIds = new Set();

      for (const answerItem of questionnaireAnswers) {
        const questionId = answerItem?.questionId;

        if (!questionId) {
          return res.status(400).json({
            success: false,
            message: "Each answer must include questionId",
          });
        }

        const question = questionMap.get(String(questionId));

        if (!question) {
          return res.status(400).json({
            success: false,
            message: "One or more questionnaire questions are invalid",
          });
        }

        if (providedIds.has(String(questionId))) {
          return res.status(400).json({
            success: false,
            message: `Duplicate answer found for question: ${question.questionText}`,
          });
        }

        providedIds.add(String(questionId));

        const answerValue =
          answerItem.answer !== undefined ? answerItem.answer : null;

        if (question.isRequired) {
          const isEmptyArray =
            Array.isArray(answerValue) && answerValue.length === 0;
          const isEmptyString =
            typeof answerValue === "string" && answerValue.trim() === "";
          const isNullish = answerValue === null || answerValue === undefined;

          if (isNullish || isEmptyString || isEmptyArray) {
            return res.status(400).json({
              success: false,
              message: `Please answer: ${question.questionText}`,
            });
          }
        }

        if (answerValue !== null && answerValue !== undefined) {
          if (
            ["single_select", "yes_no", "short_text", "long_text", "date"].includes(
              question.type
            ) &&
            typeof answerValue !== "string" &&
            typeof answerValue !== "boolean"
          ) {
            return res.status(400).json({
              success: false,
              message: `Invalid answer type for question: ${question.questionText}`,
            });
          }

          if (question.type === "number" && isNaN(Number(answerValue))) {
            return res.status(400).json({
              success: false,
              message: `Invalid number answer for question: ${question.questionText}`,
            });
          }

          if (question.type === "multi_select" && !Array.isArray(answerValue)) {
            return res.status(400).json({
              success: false,
              message: `Invalid multi-select answer for question: ${question.questionText}`,
            });
          }

          if (
            ["single_select", "multi_select"].includes(question.type) &&
            Array.isArray(question.options) &&
            question.options.length > 0
          ) {
            const allowedValues = question.options.map((opt) => opt.value);

            if (question.type === "single_select") {
              if (!allowedValues.includes(String(answerValue))) {
                return res.status(400).json({
                  success: false,
                  message: `Invalid option selected for question: ${question.questionText}`,
                });
              }
            }

            if (question.type === "multi_select") {
              const invalidOption = answerValue.find(
                (val) => !allowedValues.includes(String(val))
              );

              if (invalidOption) {
                return res.status(400).json({
                  success: false,
                  message: `Invalid option selected for question: ${question.questionText}`,
                });
              }
            }
          }
        }

        normalizedQuestionnaireAnswers.push({
          questionId: question._id,
          questionKey: question.questionKey,
          questionText: question.questionText,
          questionType: question.type,
          answer: answerValue,
        });
      }

      const missingRequiredQuestions = (questionnaire.questions || []).filter(
        (question) =>
          question.isRequired &&
          !normalizedQuestionnaireAnswers.some(
            (item) => String(item.questionId) === String(question._id)
          )
      );

      if (missingRequiredQuestions.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Please answer: ${missingRequiredQuestions[0].questionText}`,
        });
      }
    }

    // Pharmacy selection handling
    let normalizedPharmacySelectionType = "none";
    let normalizedSelectedPharmacyId = null;
    let selectedPharmacySnapshot = {
      registrationNumber: "",
      name: "",
      email: "",
      phone: "",
      street1: "",
      street2: "",
      street3: "",
      town: "",
      county: "",
      eircode: "",
    };

    const serviceCategory = (service.category || "").toLowerCase();
    const serviceName = (service.name || "").toLowerCase();
    const isPrescriptionRelatedService =
      serviceCategory.includes("prescription") ||
      serviceName.includes("prescription");

    if (pharmacySelectionType === "listed") {
      if (!selectedPharmacyId) {
        return res.status(400).json({
          success: false,
          message: "Please select a pharmacy from the list",
        });
      }

      const pharmacy = await Pharmacy.findById(selectedPharmacyId).lean();

      if (!pharmacy || pharmacy.isActive === false) {
        return res.status(404).json({
          success: false,
          message: "Selected pharmacy not found or inactive",
        });
      }

      normalizedPharmacySelectionType = "listed";
      normalizedSelectedPharmacyId = pharmacy._id;
      selectedPharmacySnapshot = {
        registrationNumber: pharmacy.registrationNumber || "",
        name: pharmacy.name || "",
        email: pharmacy.email || "",
        phone: pharmacy.phone || "",
        street1: pharmacy.street1 || "",
        street2: pharmacy.street2 || "",
        street3: pharmacy.street3 || "",
        town: pharmacy.town || "",
        county: pharmacy.county || "",
        eircode: pharmacy.eircode || "",
      };
    } else if (pharmacySelectionType === "other") {
      const otherName = parsedSelectedPharmacyOther?.name?.trim() || "";
      const otherPhone = parsedSelectedPharmacyOther?.phone?.trim() || "";
      const otherEmail = parsedSelectedPharmacyOther?.email?.trim() || "";

      if (!otherName || !otherPhone || !otherEmail) {
        return res.status(400).json({
          success: false,
          message:
            "For other pharmacy, name, phone number, and email are required",
        });
      }

      normalizedPharmacySelectionType = "other";
      selectedPharmacySnapshot = {
        registrationNumber: "",
        name: otherName,
        email: otherEmail.toLowerCase(),
        phone: otherPhone,
        street1: "",
        street2: "",
        street3: "",
        town: "",
        county: "",
        eircode: "",
      };
    } else {
      normalizedPharmacySelectionType = "none";
    }

    if (
      isPrescriptionRelatedService &&
      normalizedPharmacySelectionType === "none"
    ) {
      return res.status(400).json({
        success: false,
        message: "Please select a pharmacy or enter other pharmacy details",
      });
    }

    const last = await Consultation.findOne({})
      .sort({ createdAt: -1 })
      .select("reference")
      .lean();

    let nextNumber = 1;
    if (last?.reference) {
      const parts = last.reference.split("-");
      const num = parseInt(parts[1], 10);
      if (!isNaN(num)) {
        nextNumber = num + 1;
      }
    }

    const reference = `CON-${String(nextNumber).padStart(5, "0")}`;

    let assignedDoctorId = null;

    try {
      const hasExplicitDoctor = req.body.doctorId;

      if (!hasExplicitDoctor) {
        const serviceDoctorType = (service.doctorType || "").toLowerCase();

        const targetDateRaw = scheduledAt ? new Date(scheduledAt) : new Date();
        const targetDate = !isNaN(targetDateRaw.getTime())
          ? targetDateRaw
          : new Date();

        const dayNames = [
          "sunday",
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
        ];
        const dayName = dayNames[targetDate.getDay()];

        const minutesOfDay =
          targetDate.getHours() * 60 + targetDate.getMinutes();

        const profiles = await DoctorProfile.find({
          status: "approved",
          availableDays: dayName,
        }).populate("userId", "_id isActive");

        const timeFiltered = profiles.filter((profile) => {
          const user = profile.userId;
          if (!user || !user.isActive) return false;

          if (!profile.workStartTime || !profile.workEndTime) return true;

          const parseTime = (value) => {
            if (!value || typeof value !== "string") return null;
            const [h, m] = value.split(":").map((v) => parseInt(v, 10));
            if (isNaN(h) || isNaN(m)) return null;
            return h * 60 + m;
          };

          const start = parseTime(profile.workStartTime);
          const end = parseTime(profile.workEndTime);
          if (start === null || end === null) return true;

          return minutesOfDay >= start && minutesOfDay <= end;
        });

        const skillFiltered = timeFiltered.filter((profile) => {
          const spec = (profile.specialization || "").toLowerCase();

          if (!serviceDoctorType) return true;
          if (spec === "gp") return true;

          return spec === serviceDoctorType;
        });

        const candidates =
          skillFiltered.length > 0 ? skillFiltered : timeFiltered;

        if (candidates.length > 0) {
          const workloads = await Promise.all(
            candidates.map(async (profile) => {
              const doctorId = profile.userId._id;
              const count = await Consultation.countDocuments({
                doctorId,
                status: {
                  $in: [
                    "waiting_for_review",
                    "under_review",
                    "doctor_message_sent",
                  ],
                },
              });
              return { doctorId, count };
            })
          );

          workloads.sort((a, b) => a.count - b.count);
          assignedDoctorId = workloads[0]?.doctorId || null;
        }
      }
    } catch (assignError) {
      console.error("Error in auto-assigning doctor:", assignError);
    }

    let uploadedFiles = [];

    if (req.files && req.files.length > 0) {
      try {
        for (const file of req.files) {
          const isImage = file.mimetype?.startsWith("image/");
          const ext = file.originalname.split(".").pop();

          const result = await uploadToCloudinary(file.buffer, {
            folder: "doctor-appointment/consultation-files",
            resource_type: isImage ? "image" : "raw",
            public_id: `${Date.now()}-${file.originalname.replace(/\.[^/.]+$/, "")}`,
            ...(ext ? { format: ext } : {}),
          });

          uploadedFiles.push({
            name: file.originalname,
            url: result.url,
            public_id: result.public_id,
            type: file.mimetype || "document",
          });
        }
      } catch (uploadError) {
        console.error("Consultation files upload error:", uploadError);
        return res.status(500).json({
          success: false,
          message: "Failed to upload consultation files",
          error: uploadError.message,
        });
      }
    }

    const consultation = await Consultation.create({
      patientId: req.user._id,
      serviceId: service._id,
      doctorId: assignedDoctorId,
      patientType: normalizedType,
      patientDob: dobDate,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      status: "pending_payment",
      paymentStatus: "unpaid",
      amount: service.discountedPrice ?? service.price,
      notes: notes?.trim() || "",
      questionnaireAnswers: normalizedQuestionnaireAnswers,
      hasEmergencyFlag,
      reference,
      files: uploadedFiles,

      pharmacySelectionType: normalizedPharmacySelectionType,
      selectedPharmacyId: normalizedSelectedPharmacyId,
      selectedPharmacySnapshot,
    });

    return res.status(201).json({
      success: true,
      message: "Consultation created successfully",
      consultation,
    });
  } catch (error) {
    console.error("Error in createConsultation:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

  

export const getAssignedConsultationsForDoctor = async (req, res) => {
  try {
    const consultations = await Consultation.find({ doctorId: req.user._id })
      .sort({ createdAt: -1 })
      .populate("serviceId", "name price durationMinutes")
      .populate("patientId", "firstName lastName email")
      .populate(
        "selectedPharmacyId",
        "registrationNumber name email phone street1 street2 street3 town county eircode"
      );

    return res.status(200).json({
      success: true,
      count: consultations.length,
      consultations,
    });
  } catch (error) {
    console.error("Error in getAssignedConsultationsForDoctor:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const getAllConsultationsForAdmin = async (req, res) => {
  try {
    const consultations = await Consultation.find({})
      .sort({ createdAt: -1 })
      .populate("serviceId", "name price durationMinutes")
      .populate("patientId", "firstName lastName email")
      .populate("doctorId", "firstName lastName email")
      .populate(
        "selectedPharmacyId",
        "registrationNumber name email phone street1 street2 street3 town county eircode"
      );

    return res.status(200).json({
      success: true,
      count: consultations.length,
      consultations,
    });
  } catch (error) {
    console.error("Error in getAllConsultationsForAdmin:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const getMyConsultations = async (req, res) => {
  try {
    const consultations = await Consultation.find({ patientId: req.user._id })
      .sort({ createdAt: -1 })
      .populate("serviceId", "name price durationMinutes")
      .populate("doctorId", "firstName lastName email")
      .populate(
        "selectedPharmacyId",
        "registrationNumber name email phone street1 street2 street3 town county eircode"
      );

    return res.status(200).json({
      success: true,
      count: consultations.length,
      consultations,
    });
  } catch (error) {
    console.error("Error in getMyConsultations:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


export const assignDoctorByAdmin = async (req, res) => {
  try {
    const { consultationId } = req.params;
    const { doctorId, note = "" } = req.body;

    if (!mongoose.Types.ObjectId.isValid(consultationId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid consultation id",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid doctor id",
      });
    }

    const consultation = await Consultation.findById(consultationId).populate(
      "serviceId",
      "doctorType name"
    );

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: "Consultation not found",
      });
    }

    const doctorUser = await User.findById(doctorId).select(
      "_id firstName lastName email role isActive"
    );

    if (!doctorUser || doctorUser.role !== "doctor" || !doctorUser.isActive) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found or inactive",
      });
    }

    const doctorProfile = await DoctorProfile.findOne({
      userId: doctorId,
      status: "approved",
    });

    if (!doctorProfile) {
      return res.status(400).json({
        success: false,
        message: "Doctor profile is not approved",
      });
    }

    const serviceDoctorType = (
      consultation?.serviceId?.doctorType || ""
    ).trim().toLowerCase();

    const doctorSpecialization = (
      doctorProfile.specialization || ""
    ).trim().toLowerCase();

    const isGpDoctor = doctorSpecialization === "gp";
    const isExactMatch =
      !!serviceDoctorType && doctorSpecialization === serviceDoctorType;

    if (serviceDoctorType && !isExactMatch && !isGpDoctor) {
      return res.status(400).json({
        success: false,
        message: `This doctor cannot be assigned. Only ${serviceDoctorType} or GP doctors are allowed for this consultation.`,
      });
    }

    // Availability check based on consultation scheduled time
    const targetDateRaw = consultation.scheduledAt
      ? new Date(consultation.scheduledAt)
      : new Date();

    const targetDate = !isNaN(targetDateRaw.getTime())
      ? targetDateRaw
      : new Date();

    const dayNames = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];

    const dayName = dayNames[targetDate.getDay()];
    const minutesOfDay =
      targetDate.getHours() * 60 + targetDate.getMinutes();

    const availableDays = doctorProfile.availableDays || [];
    const isAvailableOnDay = availableDays.includes(dayName);

    if (!isAvailableOnDay) {
      return res.status(400).json({
        success: false,
        message: `This doctor is not available on ${dayName}.`,
      });
    }

    if (doctorProfile.workStartTime && doctorProfile.workEndTime) {
      const start = parseTimeToMinutes(doctorProfile.workStartTime);
      const end = parseTimeToMinutes(doctorProfile.workEndTime);

      if (start !== null && end !== null) {
        const isWithinTime = minutesOfDay >= start && minutesOfDay <= end;

        if (!isWithinTime) {
          return res.status(400).json({
            success: false,
            message: "This doctor is not available at the scheduled consultation time.",
          });
        }
      }
    }

    consultation.doctorId = doctorId;

    if (
      consultation.paymentStatus === "paid" &&
      consultation.status === "pending_payment"
    ) {
      consultation.status = "waiting_for_review";
    }

    if (Array.isArray(consultation.assignmentHistory)) {
      consultation.assignmentHistory.push({
        doctorId,
        assignedBy: req.user._id,
        note,
      });
    }

    if (Array.isArray(consultation.statusHistory)) {
      consultation.statusHistory.push({
        status: consultation.status,
        changedBy: req.user._id,
        note: `Doctor assigned by admin${note ? `: ${note}` : ""}`,
      });
    }

    await consultation.save();

    const updatedConsultation = await Consultation.findById(consultation._id)
      .populate("serviceId", "name price durationMinutes doctorType")
      .populate("patientId", "firstName lastName email")
      .populate("doctorId", "firstName lastName email");

    return res.status(200).json({
      success: true,
      message: "Doctor assigned successfully",
      consultation: updatedConsultation,
    });
  } catch (error) {
    console.error("Error in assignDoctorByAdmin:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


export const updateConsultationStatusByDoctor = async (req, res) => {
  try {
    const { consultationId } = req.params;
    const { status, note = "" } = req.body;

    const allowedStatuses = [
      "under_review",
      "doctor_message_sent",
      "completed",
      "rejected",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status update",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(consultationId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid consultation id",
      });
    }

    const consultation = await Consultation.findById(consultationId);

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: "Consultation not found",
      });
    }

    if (!consultation.doctorId) {
      return res.status(400).json({
        success: false,
        message: "No doctor assigned to this consultation",
      });
    }

    if (String(consultation.doctorId) !== String(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "You can only update your assigned consultations",
      });
    }

    if (consultation.paymentStatus !== "paid") {
      return res.status(400).json({
        success: false,
        message: "Consultation status cannot be updated before payment",
      });
    }

    if (["completed", "rejected", "cancelled"].includes(consultation.status)) {
      return res.status(400).json({
        success: false,
        message: `Consultation is already ${consultation.status}`,
      });
    }

    const validTransitions = {
      waiting_for_review: ["under_review", "rejected"],
      under_review: ["doctor_message_sent", "completed", "rejected"],
      doctor_message_sent: ["under_review", "completed", "rejected"],
      pending_payment: [],
      completed: [],
      rejected: [],
      cancelled: [],
    };

    const currentStatus = consultation.status;
    const nextAllowed = validTransitions[currentStatus] || [];

    if (!nextAllowed.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot change consultation status from ${currentStatus} to ${status}`,
      });
    }

    consultation.status = status;

    if (note?.trim()) {
      consultation.notes = consultation.notes
        ? `${consultation.notes}\n${note.trim()}`
        : note.trim();
    }

    if (Array.isArray(consultation.statusHistory)) {
      consultation.statusHistory.push({
        status,
        changedBy: req.user._id,
        note,
      });
    }

    await consultation.save();

    const updatedConsultation = await Consultation.findById(consultation._id)
      .populate("serviceId", "name price durationMinutes")
      .populate("patientId", "firstName lastName email")
      .populate("doctorId", "firstName lastName email");

    return res.status(200).json({
      success: true,
      message: "Consultation status updated successfully",
      consultation: updatedConsultation,
    });
  } catch (error) {
    console.error("Error in updateConsultationStatusByDoctor:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};






const parseTimeToMinutes = (value) => {
  if (!value || typeof value !== "string") return null;
  const [h, m] = value.split(":").map((v) => parseInt(v, 10));
  if (isNaN(h) || isNaN(m)) return null;
  return h * 60 + m;
};

export const getAssignableDoctorsForConsultation = async (req, res) => {
  try {
    const { consultationId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(consultationId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid consultation id",
      });
    }

    const consultation = await Consultation.findById(consultationId)
      .populate("serviceId", "doctorType name")
      .lean();

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: "Consultation not found",
      });
    }

    const service = consultation.serviceId;
    const serviceDoctorType = (service?.doctorType || "").trim().toLowerCase();

    const targetDateRaw = consultation.scheduledAt
      ? new Date(consultation.scheduledAt)
      : new Date();

    const targetDate = !isNaN(targetDateRaw.getTime())
      ? targetDateRaw
      : new Date();

    const dayNames = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];

    const dayName = dayNames[targetDate.getDay()];
    const minutesOfDay =
      targetDate.getHours() * 60 + targetDate.getMinutes();

    const profiles = await DoctorProfile.find({
      status: "approved",
      availableDays: dayName,
    })
      .populate("userId", "firstName lastName email role isActive")
      .lean();

    const availableProfiles = profiles.filter((profile) => {
      const user = profile.userId;
      if (!user || user.role !== "doctor" || !user.isActive) return false;

      if (!profile.workStartTime || !profile.workEndTime) return true;

      const start = parseTimeToMinutes(profile.workStartTime);
      const end = parseTimeToMinutes(profile.workEndTime);

      if (start === null || end === null) return true;

      return minutesOfDay >= start && minutesOfDay <= end;
    });

    const withWorkload = await Promise.all(
      availableProfiles.map(async (profile) => {
        const doctorId = profile.userId._id;

        const activeConsultations = await Consultation.countDocuments({
          doctorId,
          status: {
            $in: [
              "waiting_for_review",
              "under_review",
              "doctor_message_sent",
            ],
          },
        });

        return {
          _id: profile.userId._id,
          firstName: profile.userId.firstName,
          lastName: profile.userId.lastName,
          email: profile.userId.email,
          specialization: profile.specialization || "",
          availableDays: profile.availableDays || [],
          workStartTime: profile.workStartTime || null,
          workEndTime: profile.workEndTime || null,
          activeConsultations,
          isGp:
            (profile.specialization || "").trim().toLowerCase() === "gp",
          isRelated:
            serviceDoctorType &&
            (profile.specialization || "").trim().toLowerCase() ===
              serviceDoctorType,
        };
      })
    );

    const relatedDoctors = withWorkload
      .filter((doc) => doc.isRelated)
      .sort((a, b) => a.activeConsultations - b.activeConsultations);

    const gpDoctors = withWorkload
      .filter((doc) => doc.isGp)
      .sort((a, b) => a.activeConsultations - b.activeConsultations);

    let doctors = [];

    if (relatedDoctors.length > 0) {
      doctors = [...relatedDoctors];

      const extraGpDoctors = gpDoctors.filter(
        (gp) => !relatedDoctors.some((doc) => String(doc._id) === String(gp._id))
      );

      doctors.push(...extraGpDoctors);
    } else if (gpDoctors.length > 0) {
      doctors = [...gpDoctors];
    } else {
      doctors = withWorkload.sort(
        (a, b) => a.activeConsultations - b.activeConsultations
      );
    }

    return res.status(200).json({
      success: true,
      consultationId,
      serviceDoctorType,
      doctors,
    });
  } catch (error) {
    console.error("Error in getAssignableDoctorsForConsultation:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};







export const createCheckoutSession = async (req, res) => {
  try {
    const { consultationId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(consultationId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid consultation id",
      });
    }

    const consultation = await Consultation.findById(consultationId)
      .populate("serviceId", "name price discountedPrice")
      .populate("patientId", "firstName lastName email");

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: "Consultation not found",
      });
    }

    if (String(consultation.patientId._id) !== String(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "You can only pay for your own consultation",
      });
    }

    if (consultation.paymentStatus === "paid") {
      return res.status(400).json({
        success: false,
        message: "Consultation is already paid",
      });
    }

    const amount = Math.round(Number(consultation.amount || 0) * 100);

    if (!amount || amount < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid consultation amount",
      });
    }

    const patientAppUrl = process.env.PATIENT_APP_URL;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: consultation.patientId?.email || undefined,
      line_items: [
        {
          price_data: {
            currency: process.env.STRIPE_CURRENCY || "usd",
            product_data: {
              name: consultation.serviceId?.name || "Consultation Payment",
              description: `Consultation Ref: ${consultation.reference}`,
            },
            unit_amount: Math.round(Number(consultation.amount) * 100),
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.PATIENT_APP_URL}/patient/consultations/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.PATIENT_APP_URL}/patient/consultations/payment-cancelled`,
      metadata: {
        consultationId: String(consultation._id),
        reference: consultation.reference,
      },
    });

    consultation.stripeCheckoutSessionId = session.id;
    await consultation.save();

    return res.status(200).json({
      success: true,
      url: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    console.error("Error in createCheckoutSession:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create checkout session",
      error: error.message,
    });
  }
};