import xlsx from "xlsx";
import { Medicine } from "../models/Medicine.js";

// =========================
// IMPORT MEDICINES
// =========================
export const importMedicines = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Medicine file is required",
      });
    }

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const rows = xlsx.utils.sheet_to_json(worksheet, { defval: "" });

    if (!rows.length) {
      return res.status(400).json({
        success: false,
        message: "No rows found in uploaded file",
      });
    }

    let created = 0;
    let updated = 0;
    let skipped = 0;
    const errors = [];

    for (let i = 0; i < rows.length; i++) {
      try {
        const row = rows[i];

        const medicineName = String(row.medicine_name || row["medicine_name"] || "").trim();
        const genericName = String(row.generic_name || row["generic_name"] || "").trim();
        const strength = String(row.strength || "").trim();
        const form = String(row.form || "").trim();
        const indication = String(row.indication || "").trim();
        const adultDose = String(row.adult_dose || row["adult_dose"] || "").trim();
        const frequency = String(row.frequency || "").trim();
        const typicalDuration = String(row.typical_duration || row["typical_duration"] || "").trim();
        const contraindicationsNotes = String(
          row.contraindications_notes || row["contraindications_notes"] || ""
        ).trim();

        if (!medicineName) {
          skipped++;
          errors.push({
            row: i + 2,
            message: "Medicine name is required",
          });
          continue;
        }

        const existing = await Medicine.findOne({
          medicineName,
          strength,
          form,
        });

        if (existing) {
          existing.genericName = genericName;
          existing.indication = indication;
          existing.adultDose = adultDose;
          existing.frequency = frequency;
          existing.typicalDuration = typicalDuration;
          existing.contraindicationsNotes = contraindicationsNotes;
          existing.isActive = true;
          existing.importedBy = req.user?._id || null;

          await existing.save();
          updated++;
        } else {
          await Medicine.create({
            medicineName,
            genericName,
            strength,
            form,
            indication,
            adultDose,
            frequency,
            typicalDuration,
            contraindicationsNotes,
            importedBy: req.user?._id || null,
          });
          created++;
        }
      } catch (err) {
        skipped++;
        errors.push({
          row: i + 2,
          message: err.message,
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: "Medicine import completed",
      summary: {
        totalRows: rows.length,
        created,
        updated,
        skipped,
      },
      errors,
    });
  } catch (error) {
    console.error("Error in importMedicines:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while importing medicines",
      error: error.message,
    });
  }
};

// =========================
// GET ALL MEDICINES
// =========================
export const getAllMedicines = async (req, res) => {
  try {
    const { search = "", page = 1, limit = 1000 } = req.query;

    const query = {
      isActive: true,
    };

    if (search) {
      query.$or = [
        { medicineName: { $regex: search, $options: "i" } },
        { genericName: { $regex: search, $options: "i" } },
        { indication: { $regex: search, $options: "i" } },
      ];
    }

    const medicines = await Medicine.find(query)
      .sort({ medicineName: 1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Medicine.countDocuments(query);

    return res.status(200).json({
      success: true,
      count: medicines.length,
      total,
      medicines,
    });
  } catch (error) {
    console.error("Error in getAllMedicines:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// =========================
// GET SINGLE MEDICINE
// =========================
export const getMedicineById = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found",
      });
    }

    return res.status(200).json({
      success: true,
      medicine,
    });
  } catch (error) {
    console.error("Error in getMedicineById:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// =========================
// DELETE MEDICINE (SOFT)
// =========================
export const deleteMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found",
      });
    }

    medicine.isActive = false;
    await medicine.save();

    return res.status(200).json({
      success: true,
      message: "Medicine deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteMedicine:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};