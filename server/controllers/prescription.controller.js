import { Prescription } from "../models/Prescription.js";
import { Consultation } from "../models/Consultation.js";
import { uploadToCloudinary } from "../config/cloudinary.js";

export const createPrescription = async (req, res) => {
  try {
    const { consultationId, diagnosis, notes } = req.body;

    let medicines = [];
    if (req.body.medicines) {
      try {
        medicines =
          typeof req.body.medicines === "string"
            ? JSON.parse(req.body.medicines)
            : req.body.medicines;
      } catch {
        medicines = [];
      }
    }

    if (!consultationId) {
      return res.status(400).json({
        success: false,
        message: "Consultation ID is required",
      });
    }

    if (!Array.isArray(medicines) || medicines.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one medicine is required",
      });
    }

    const consultation = await Consultation.findById(consultationId);

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: "Consultation not found",
      });
    }

    const existingPrescription = await Prescription.findOne({ consultationId });
    if (existingPrescription) {
      return res.status(400).json({
        success: false,
        message: "Prescription already exists for this consultation",
      });
    }

    const last = await Prescription.findOne({})
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

    const reference = `RX-${String(nextNumber).padStart(5, "0")}`;

    let uploadedFiles = [];

    if (req.files && req.files.length > 0) {
      try {
        for (const file of req.files) {
          const isImage = file.mimetype?.startsWith("image/");
          const ext = file.originalname.split(".").pop();

          const result = await uploadToCloudinary(file.buffer, {
            folder: "doctor-appointment/prescription-files",
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
        console.error("Prescription files upload error:", uploadError);
        return res.status(500).json({
          success: false,
          message: "Failed to upload prescription files",
          error: uploadError.message,
        });
      }
    }

    const prescription = await Prescription.create({
      consultationId: consultation._id,
      patientId: consultation.patientId,
      doctorId: consultation.doctorId || req.user._id,
      reference,
      diagnosis: diagnosis?.trim() || "",
      notes: notes?.trim() || "",
      medicines,
      files: uploadedFiles,
      issuedAt: new Date(),
    });

    if (consultation.status !== "completed") {
      consultation.status = "completed";
      await consultation.save();
    }

    return res.status(201).json({
      success: true,
      message: "Prescription created successfully",
      prescription,
    });
  } catch (error) {
    console.error("Error in createPrescription:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const getMyPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ patientId: req.user._id })
      .sort({ createdAt: -1 })
      .populate("consultationId", "reference status")
      .populate("doctorId", "firstName lastName email");

    return res.status(200).json({
      success: true,
      count: prescriptions.length,
      prescriptions,
    });
  } catch (error) {
    console.error("Error in getMyPrescriptions:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const getDoctorPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ doctorId: req.user._id })
      .sort({ createdAt: -1 })
      .populate("consultationId", "reference status")
      .populate("patientId", "firstName lastName email");

    return res.status(200).json({
      success: true,
      count: prescriptions.length,
      prescriptions,
    });
  } catch (error) {
    console.error("Error in getDoctorPrescriptions:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const getAllPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({})
      .sort({ createdAt: -1 })
      .populate("consultationId", "reference status")
      .populate("patientId", "firstName lastName email")
      .populate("doctorId", "firstName lastName email");

    return res.status(200).json({
      success: true,
      count: prescriptions.length,
      prescriptions,
    });
  } catch (error) {
    console.error("Error in getAllPrescriptions:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const getPrescriptionById = async (req, res) => {
  try {
    const { id } = req.params;

    const prescription = await Prescription.findById(id)
      .populate("consultationId", "reference status")
      .populate("patientId", "firstName lastName email")
      .populate("doctorId", "firstName lastName email");

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: "Prescription not found",
      });
    }

    return res.status(200).json({
      success: true,
      prescription,
    });
  } catch (error) {
    console.error("Error in getPrescriptionById:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const updatePrescription = async (req, res) => {
  try {
    const { id } = req.params;
    const { diagnosis, notes } = req.body;

    let medicines = undefined;
    if (req.body.medicines) {
      try {
        medicines =
          typeof req.body.medicines === "string"
            ? JSON.parse(req.body.medicines)
            : req.body.medicines;
      } catch {
        medicines = undefined;
      }
    }

    const prescription = await Prescription.findById(id);
    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: "Prescription not found",
      });
    }

    if (diagnosis !== undefined) prescription.diagnosis = diagnosis.trim();
    if (notes !== undefined) prescription.notes = notes.trim();
    if (Array.isArray(medicines)) prescription.medicines = medicines;

    let uploadedFiles = [];
    if (req.files && req.files.length > 0) {
      try {
        for (const file of req.files) {
          const isImage = file.mimetype?.startsWith("image/");
          const ext = file.originalname.split(".").pop();

          const result = await uploadToCloudinary(file.buffer, {
            folder: "doctor-appointment/prescription-files",
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

        prescription.files = [...(prescription.files || []), ...uploadedFiles];
      } catch (uploadError) {
        console.error("Prescription files upload error:", uploadError);
        return res.status(500).json({
          success: false,
          message: "Failed to upload prescription files",
          error: uploadError.message,
        });
      }
    }

    await prescription.save();

    return res.status(200).json({
      success: true,
      message: "Prescription updated successfully",
      prescription,
    });
  } catch (error) {
    console.error("Error in updatePrescription:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const deletePrescription = async (req, res) => {
  try {
    const { id } = req.params;

    const prescription = await Prescription.findById(id);
    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: "Prescription not found",
      });
    }

    await prescription.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Prescription deleted successfully",
    });
  } catch (error) {
    console.error("Error in deletePrescription:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};