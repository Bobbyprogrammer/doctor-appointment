
import mongoose from "mongoose";
import { Consultation } from "../models/Consultation.js";
import { Prescription } from "../models/Prescription.js";
import { uploadToCloudinary } from "../config/cloudinary.js";
import { generatePrescriptionPdfBuffer } from "../services/prescription-pdf.service.js";
import {
  sendPrescriptionToPharmacyEmail,
  sendPrescriptionToPatientEmail,
} from "../services/prescription-email.service.js";


const normalizeMedicines = (rawMedicines = []) => {
  if (!Array.isArray(rawMedicines)) return [];

  return rawMedicines
    .filter((med) => med && typeof med === "object")
    .map((med) => ({
      medicineId: med.medicineId || null,
      name: String(med.name || "").trim(),
      genericName: String(med.genericName || "").trim(),
      strength: String(med.strength || "").trim(),
      form: String(med.form || "").trim(),
      indication: String(med.indication || "").trim(),
      adultDose: String(med.adultDose || "").trim(),
      dosage: String(med.dosage || "").trim(),
      frequency: String(med.frequency || "").trim(),
      duration: String(med.duration || "").trim(),
      contraindicationsNotes: String(med.contraindicationsNotes || "").trim(),
      instructions: String(med.instructions || "").trim(),
    }))
    .filter((med) => med.medicineId && med.name);
};


export const createPrescription = async (req, res) => {
  try {
    const { consultationId, diagnosis = "", notes = "" } = req.body;

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

    medicines = normalizeMedicines(medicines);

    if (!consultationId) {
      return res.status(400).json({
        success: false,
        message: "Consultation ID is required",
      });
    }

    if (!Array.isArray(medicines) || medicines.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one valid selected medicine is required",
      });
    }

    const consultation = await Consultation.findById(consultationId)
      .select(
        "patientId doctorId patientDob patientAddress reference status selectedPharmacySnapshot"
      )
      .populate("patientId", "firstName lastName email phone")
      .populate("doctorId", "firstName lastName email");

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

    // =========================
    // OPTIONAL FILES
    // =========================
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

    // =========================
    // PHARMACY SNAPSHOT
    // =========================
    const pharmacySnapshot = consultation.selectedPharmacySnapshot || {
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

    // =========================
    // PATIENT SNAPSHOT
    // =========================
    const patientSnapshot = {
      firstName: consultation.patientId?.firstName || "",
      lastName: consultation.patientId?.lastName || "",
      email: consultation.patientId?.email || "",
      dateOfBirth: consultation.patientDob || null,

      address: {
        line1: consultation.patientAddress?.line1 || "",
        line2: consultation.patientAddress?.line2 || "",
        city: consultation.patientAddress?.city || "",
        state: consultation.patientAddress?.state || "",
        postalCode: consultation.patientAddress?.postalCode || "",
        country: consultation.patientAddress?.country || "",
      },
    };

    const prescription = await Prescription.create({
      consultationId: consultation._id,
      patientId: consultation.patientId?._id || consultation.patientId,
      doctorId:
        consultation.doctorId?._id || consultation.doctorId || req.user._id,
      reference,
      diagnosis: diagnosis?.trim() || "",
      notes: notes?.trim() || "",
      medicines,
      files: uploadedFiles, // optional
      pharmacySnapshot,
      patientSnapshot,
      issuedAt: new Date(),
    });

    const pdfBuffer = await generatePrescriptionPdfBuffer({
      prescription,
      patient: consultation.patientId,
      doctor: consultation.doctorId,
      consultation,
    });

    const pdfUpload = await uploadToCloudinary(pdfBuffer, {
      folder: "doctor-appointment/prescription-pdfs",
      resource_type: "raw",
      public_id: `${reference}`,
      format: "pdf",
    });

    prescription.pdfUrl = pdfUpload.url;
    prescription.pdfPublicId = pdfUpload.public_id;
    await prescription.save();

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


export const sendPrescriptionToPharmacy = async (req, res) => {
  try {
    const { id } = req.params;

    const prescription = await Prescription.findById(id)
      .populate("patientId", "firstName lastName email")
      .populate("doctorId", "firstName lastName email")
      .populate("consultationId", "reference status");

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: "Prescription not found",
      });
    }

    if (prescription.sentToPharmacy) {
      return res.status(400).json({
        success: false,
        message: "Prescription already sent to pharmacy",
      });
    }
    if (!prescription.pharmacySnapshot?.email) {
      return res.status(400).json({
        success: false,
        message: "No pharmacy email found for this prescription",
      });
    }

    const pdfBuffer = await generatePrescriptionPdfBuffer({
      prescription,
      patient: prescription.patientId,
      doctor: prescription.doctorId,
      consultation: prescription.consultationId,
    });

    if (!pdfBuffer || pdfBuffer.length === 0) {
      return res.status(500).json({
        success: false,
        message: "Failed to generate prescription PDF",
      });
    }

    const patientName = `${prescription.patientId?.firstName || ""} ${
      prescription.patientId?.lastName || ""
    }`.trim();

    const doctorName = `${prescription.doctorId?.firstName || ""} ${
      prescription.doctorId?.lastName || ""
    }`.trim();

    await sendPrescriptionToPharmacyEmail({
      to: prescription.pharmacySnapshot.email,
      pharmacyName: prescription.pharmacySnapshot.name,
      patientName,
      doctorName,
      prescriptionReference: prescription.reference,
      pdfBuffer,
    });

    prescription.sentToPharmacy = true;
    prescription.sentToPharmacyAt = new Date();
    prescription.sentToPharmacyBy = req.user._id;
    await prescription.save();

    return res.status(200).json({
      success: true,
      message: "Prescription sent to pharmacy successfully",
    });
  } catch (error) {
    console.error("Error in sendPrescriptionToPharmacy:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send prescription to pharmacy",
      error: error.message,
    });
  }
};


export const sendPrescriptionToPatient = async (req, res) => {
  try {
    const { id } = req.params;

    const prescription = await Prescription.findById(id)
      .populate("patientId", "firstName lastName email")
      .populate("doctorId", "firstName lastName email")
      .populate("consultationId", "reference status");

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: "Prescription not found",
      });
    }

    if (!prescription.patientId?.email) {
      return res.status(400).json({
        success: false,
        message: "Patient email not found",
      });
    }

    if (prescription.sentToPatientEmail) {
      return res.status(400).json({
        success: false,
        message: "Prescription already sent to patient email",
      });
    }

    const pdfBuffer = await generatePrescriptionPdfBuffer({
      prescription,
      patient: prescription.patientId,
      doctor: prescription.doctorId,
      consultation: prescription.consultationId,
    });

    if (!pdfBuffer || pdfBuffer.length === 0) {
      return res.status(500).json({
        success: false,
        message: "Failed to generate prescription PDF",
      });
    }

    const patientName = `${prescription.patientId?.firstName || ""} ${
      prescription.patientId?.lastName || ""
    }`.trim();

    const doctorName = `${prescription.doctorId?.firstName || ""} ${
      prescription.doctorId?.lastName || ""
    }`.trim();

    await sendPrescriptionToPatientEmail({
      to: prescription.patientId.email,
      patientName,
      doctorName,
      prescriptionReference: prescription.reference,
      pdfBuffer,
    });

    prescription.sentToPatientEmail = true;
    prescription.sentToPatientEmailAt = new Date();
    prescription.sentToPatientEmailBy = req.user._id;
    await prescription.save();

    return res.status(200).json({
      success: true,
      message: "Prescription sent to patient email successfully",
    });
  } catch (error) {
    console.error("Error in sendPrescriptionToPatient:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send prescription to patient",
      error: error.message,
    });
  }
};

export const downloadPrescriptionPdf = async (req, res) => {
  try {
    const { id } = req.params;

    const prescription = await Prescription.findById(id).select(
      "reference pdfUrl"
    );

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: "Prescription not found",
      });
    }

    if (!prescription.pdfUrl) {
      return res.status(400).json({
        success: false,
        message: "Prescription PDF is not available",
      });
    }

    return res.status(200).json({
      success: true,
      fileName: `${prescription.reference}.pdf`,
      url: prescription.pdfUrl,
    });
  } catch (error) {
    console.error("Error in downloadPrescriptionPdf:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get prescription PDF",
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

    if (Array.isArray(medicines)) {
      medicines = normalizeMedicines(medicines);
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

    if (Array.isArray(medicines) && medicines.length > 0) {
      prescription.medicines = medicines;
    }

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