import xlsx from "xlsx";
import { Pharmacy } from "../models/Pharmacy.js";

const normalizeString = (value) => {
  if (value === null || value === undefined) return "";
  return String(value).trim();
};

const normalizeEmail = (value) => {
  return normalizeString(value).toLowerCase();
};

const normalizeBoolean = (value, defaultValue = true) => {
  if (value === null || value === undefined || value === "") {
    return defaultValue;
  }

  const normalized = String(value).trim().toLowerCase();

  if (["true", "1", "yes", "active"].includes(normalized)) return true;
  if (["false", "0", "no", "inactive"].includes(normalized)) return false;

  return defaultValue;
};

const getCell = (row, keys = []) => {
  for (const key of keys) {
    if (row[key] !== undefined && row[key] !== null && row[key] !== "") {
      return row[key];
    }
  }
  return "";
};

export const importPharmacies = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Pharmacy import file is required",
      });
    }

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const firstSheetName = workbook.SheetNames[0];

    if (!firstSheetName) {
      return res.status(400).json({
        success: false,
        message: "No worksheet found in uploaded file",
      });
    }

    const sheet = workbook.Sheets[firstSheetName];

   
const rawRows = xlsx.utils.sheet_to_json(sheet, {
  header: 1,
  defval: "",
  raw: false,
});

if (!Array.isArray(rawRows) || rawRows.length === 0) {
  return res.status(400).json({
    success: false,
    message: "No pharmacy records found in file",
  });
}

// Find header row dynamically
const headerRowIndex = rawRows.findIndex((row) => {
  if (!Array.isArray(row)) return false;

  const normalized = row.map((cell) =>
    String(cell || "").trim().toLowerCase()
  );

  return (
    normalized.includes("registration number") &&
    normalized.includes("trading name")
  );
});

if (headerRowIndex === -1) {
  return res.status(400).json({
    success: false,
    message:
      "Could not find pharmacy header row. Expected columns like Registration Number and Trading Name.",
  });
}

const headerRow = rawRows[headerRowIndex].map((cell) =>
  String(cell || "").trim()
);

const dataRows = rawRows.slice(headerRowIndex + 1);

const rows = dataRows
  .filter((row) =>
    Array.isArray(row) && row.some((cell) => String(cell || "").trim() !== "")
  )
  .map((row) => {
    const obj = {};
    headerRow.forEach((header, index) => {
      obj[header] = row[index] ?? "";
    });
    return obj;
  });
    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No pharmacy records found in file",
      });
    }

    let createdCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;
    const errors = [];

    for (let index = 0; index < rows.length; index++) {
      const row = rows[index];

      try {
        const registrationNumber = normalizeString(
          getCell(row, [
            "Registration Number",
            "RegistrationNumber",
            "registrationNumber",
            "registration_number",
          ])
        );

        const name = normalizeString(
          getCell(row, [
            "Trading Name",
            "TradingName",
            "name",
            "Name",
          ])
        );

        const street1 = normalizeString(
          getCell(row, ["Street 1", "Street1", "street1"])
        );

        const street2 = normalizeString(
          getCell(row, ["Street 2", "Street2", "street2"])
        );

        const street3 = normalizeString(
          getCell(row, ["Street 3", "Street3", "street3"])
        );

        const town = normalizeString(
          getCell(row, ["Town", "town"])
        );

        const county = normalizeString(
          getCell(row, ["County", "county"])
        );

        const eircode = normalizeString(
          getCell(row, ["Eircode", "eircode"])
        );

        const phone = normalizeString(
          getCell(row, ["Phone", "phone"])
        );

        const email = normalizeEmail(
          getCell(row, ["Email", "email"])
        );

        const isActive = normalizeBoolean(
          getCell(row, ["isActive", "IsActive", "Status"]),
          true
        );

        if (!registrationNumber || !name) {
          skippedCount++;
          errors.push({
            row: index + 2,
            message: "Registration Number and Trading Name are required",
          });
          continue;
        }

        const payload = {
          registrationNumber,
          name,
          street1,
          street2,
          street3,
          town,
          county,
          eircode,
          phone,
          email,
          isActive,
          importSource: "excel_import",
        };

        const existingPharmacy = await Pharmacy.findOne({ registrationNumber });

        if (existingPharmacy) {
          existingPharmacy.name = payload.name;
          existingPharmacy.street1 = payload.street1;
          existingPharmacy.street2 = payload.street2;
          existingPharmacy.street3 = payload.street3;
          existingPharmacy.town = payload.town;
          existingPharmacy.county = payload.county;
          existingPharmacy.eircode = payload.eircode;
          existingPharmacy.phone = payload.phone;
          existingPharmacy.email = payload.email;
          existingPharmacy.isActive = payload.isActive;
          existingPharmacy.importSource = payload.importSource;

          if (req.user?._id) {
            existingPharmacy.updatedBy = req.user._id;
          }

          await existingPharmacy.save();
          updatedCount++;
        } else {
          await Pharmacy.create({
            ...payload,
            createdBy: req.user?._id || null,
            updatedBy: req.user?._id || null,
          });
          createdCount++;
        }
      } catch (rowError) {
        skippedCount++;
        errors.push({
          row: index + 2,
          message: rowError.message || "Failed to process row",
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: "Pharmacy import completed",
      summary: {
        totalRows: rows.length,
        created: createdCount,
        updated: updatedCount,
        skipped: skippedCount,
      },
      errors,
    });
  } catch (error) {
    console.error("Error in importPharmacies:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to import pharmacies",
      error: error.message,
    });
  }
};



export const getPharmacies = async (req, res) => {
  try {
    const {
      q = "",
      page = 1,
      limit = 20,
      activeOnly = "true",
    } = req.query;

    const parsedPage = Math.max(parseInt(page, 10) || 1, 1);
    const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);
    const skip = (parsedPage - 1) * parsedLimit;

    const filter = {};

    if (activeOnly === "true") {
      filter.isActive = true;
    }

    if (q && String(q).trim()) {
      const search = String(q).trim();
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { registrationNumber: { $regex: search, $options: "i" } },
        { town: { $regex: search, $options: "i" } },
        { county: { $regex: search, $options: "i" } },
        { eircode: { $regex: search, $options: "i" } },
        { street1: { $regex: search, $options: "i" } },
        { street2: { $regex: search, $options: "i" } },
        { street3: { $regex: search, $options: "i" } },
      ];
    }

    const [pharmacies, total] = await Promise.all([
      Pharmacy.find(filter)
        .sort({ name: 1, town: 1 })
        .skip(skip)
        .limit(parsedLimit)
        .lean(),
      Pharmacy.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      count: pharmacies.length,
      total,
      page: parsedPage,
      totalPages: Math.ceil(total / parsedLimit),
      pharmacies,
    });
  } catch (error) {
    console.error("Error in getPharmacies:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch pharmacies",
      error: error.message,
    });
  }
};

export const getPharmacyById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid pharmacy id",
      });
    }

    const pharmacy = await Pharmacy.findById(id).lean();

    if (!pharmacy) {
      return res.status(404).json({
        success: false,
        message: "Pharmacy not found",
      });
    }

    return res.status(200).json({
      success: true,
      pharmacy,
    });
  } catch (error) {
    console.error("Error in getPharmacyById:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch pharmacy",
      error: error.message,
    });
  }
};