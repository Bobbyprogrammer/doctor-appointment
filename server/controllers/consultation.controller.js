import { Consultation } from "../models/Consultation.js";
import { Service } from "../models/Service.js";
import { DoctorProfile } from "../models/DoctorProfile.js";
import { uploadToCloudinary } from "../config/cloudinary.js";
import { Questionnaire } from "../models/Questionnaire.js";


export const createConsultation = async (req, res) => {
  try {
    const { serviceId, scheduledAt, notes, patientType = "self", patientDob } =
      req.body;

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

        // Type validation
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
      .populate("patientId", "firstName lastName email");

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
      .populate("doctorId", "firstName lastName email");

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

