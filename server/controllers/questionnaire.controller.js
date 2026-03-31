import { Questionnaire } from "../models/Questionnaire.js";
import { Service } from "../models/Service.js";

const normalizeQuestions = (questions = []) => {
  if (!Array.isArray(questions)) return [];

  return questions.map((question, index) => ({
    questionText: question.questionText?.trim() || "",
    questionKey: question.questionKey?.trim() || "",
    type: question.type,
    placeholder: question.placeholder?.trim() || "",
    helpText: question.helpText?.trim() || "",
    options: Array.isArray(question.options)
      ? question.options
          .filter(
            (option) =>
              option &&
              typeof option.label === "string" &&
              typeof option.value === "string"
          )
          .map((option) => ({
            label: option.label.trim(),
            value: option.value.trim(),
          }))
      : [],
    isRequired:
      question.isRequired !== undefined ? Boolean(question.isRequired) : true,
    order: question.order !== undefined ? Number(question.order) : index,
    showIf: question.showIf
      ? {
          questionKey: question.showIf.questionKey?.trim() || "",
          operator: question.showIf.operator || "equals",
          value:
            question.showIf.value !== undefined ? question.showIf.value : null,
        }
      : {
          questionKey: "",
          operator: "equals",
          value: null,
        },
  }));
};

export const createQuestionnaire = async (req, res) => {
  try {
    const { serviceId, title, description, questions, isActive } = req.body;

    if (!serviceId || !title) {
      return res.status(400).json({
        success: false,
        message: "Service ID and title are required",
      });
    }

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    const existingQuestionnaire = await Questionnaire.findOne({ serviceId });
    if (existingQuestionnaire) {
      return res.status(400).json({
        success: false,
        message: "Questionnaire already exists for this service",
      });
    }

    let parsedQuestions = [];
    if (questions) {
      try {
        parsedQuestions =
          typeof questions === "string" ? JSON.parse(questions) : questions;
      } catch {
        return res.status(400).json({
          success: false,
          message: "Invalid questions format",
        });
      }
    }

    const normalizedQuestions = normalizeQuestions(parsedQuestions);

    const invalidQuestion = normalizedQuestions.find(
      (question) =>
        !question.questionText || !question.questionKey || !question.type
    );

    if (invalidQuestion) {
      return res.status(400).json({
        success: false,
        message: "Each question must have questionText, questionKey, and type",
      });
    }

    const duplicateQuestionKey = normalizedQuestions.find(
      (question, index, arr) =>
        arr.findIndex((q) => q.questionKey === question.questionKey) !== index
    );

    if (duplicateQuestionKey) {
      return res.status(400).json({
        success: false,
        message: `Duplicate questionKey found: ${duplicateQuestionKey.questionKey}`,
      });
    }

    const questionnaire = await Questionnaire.create({
      serviceId,
      title: title.trim(),
      description: description?.trim() || "",
      questions: normalizedQuestions,
      isActive: isActive !== undefined ? Boolean(isActive) : true,
      createdBy: req.user?._id || null,
    });

    service.questionnaireId = questionnaire._id;
    await service.save({ validateBeforeSave: false });

    return res.status(201).json({
      success: true,
      message: "Questionnaire created successfully",
      questionnaire,
    });
  } catch (error) {
    console.error("Error in createQuestionnaire:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const getAllQuestionnaires = async (req, res) => {
  try {
    const questionnaires = await Questionnaire.find({})
      .sort({ createdAt: -1 })
      .populate("serviceId", "name slug category")
      .populate("createdBy", "firstName lastName email")
      .populate("updatedBy", "firstName lastName email");

    return res.status(200).json({
      success: true,
      count: questionnaires.length,
      questionnaires,
    });
  } catch (error) {
    console.error("Error in getAllQuestionnaires:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const getQuestionnaireById = async (req, res) => {
  try {
    const { id } = req.params;

    const questionnaire = await Questionnaire.findById(id)
      .populate("serviceId", "name slug category")
      .populate("createdBy", "firstName lastName email")
      .populate("updatedBy", "firstName lastName email");

    if (!questionnaire) {
      return res.status(404).json({
        success: false,
        message: "Questionnaire not found",
      });
    }

    return res.status(200).json({
      success: true,
      questionnaire,
    });
  } catch (error) {
    console.error("Error in getQuestionnaireById:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const getQuestionnaireByServiceId = async (req, res) => {
  try {
    const { serviceId } = req.params;

    const questionnaire = await Questionnaire.findOne({
      serviceId,
      isActive: true,
    }).populate("serviceId", "name slug category");

    if (!questionnaire) {
      return res.status(404).json({
        success: false,
        message: "Questionnaire not found for this service",
      });
    }

    return res.status(200).json({
      success: true,
      questionnaire,
    });
  } catch (error) {
    console.error("Error in getQuestionnaireByServiceId:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const updateQuestionnaire = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, questions, isActive } = req.body;

    const questionnaire = await Questionnaire.findById(id);
    if (!questionnaire) {
      return res.status(404).json({
        success: false,
        message: "Questionnaire not found",
      });
    }

    if (title !== undefined) {
      questionnaire.title = title?.trim() || questionnaire.title;
    }

    if (description !== undefined) {
      questionnaire.description = description?.trim() || "";
    }

    if (questions !== undefined) {
      let parsedQuestions = [];
      try {
        parsedQuestions =
          typeof questions === "string" ? JSON.parse(questions) : questions;
      } catch {
        return res.status(400).json({
          success: false,
          message: "Invalid questions format",
        });
      }

      const normalizedQuestions = normalizeQuestions(parsedQuestions);

      const invalidQuestion = normalizedQuestions.find(
        (question) =>
          !question.questionText || !question.questionKey || !question.type
      );

      if (invalidQuestion) {
        return res.status(400).json({
          success: false,
          message:
            "Each question must have questionText, questionKey, and type",
        });
      }

      const duplicateQuestionKey = normalizedQuestions.find(
        (question, index, arr) =>
          arr.findIndex((q) => q.questionKey === question.questionKey) !== index
      );

      if (duplicateQuestionKey) {
        return res.status(400).json({
          success: false,
          message: `Duplicate questionKey found: ${duplicateQuestionKey.questionKey}`,
        });
      }

      questionnaire.questions = normalizedQuestions;
    }

    if (isActive !== undefined) {
      questionnaire.isActive =
        isActive === true || isActive === "true" ? true : false;
    }

    questionnaire.updatedBy = req.user?._id || null;

    await questionnaire.save();

    return res.status(200).json({
      success: true,
      message: "Questionnaire updated successfully",
      questionnaire,
    });
  } catch (error) {
    console.error("Error in updateQuestionnaire:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const deleteQuestionnaire = async (req, res) => {
  try {
    const { id } = req.params;

    const questionnaire = await Questionnaire.findById(id);
    if (!questionnaire) {
      return res.status(404).json({
        success: false,
        message: "Questionnaire not found",
      });
    }

    await Service.findByIdAndUpdate(questionnaire.serviceId, {
      $set: { questionnaireId: null },
    });

    await questionnaire.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Questionnaire deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteQuestionnaire:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};