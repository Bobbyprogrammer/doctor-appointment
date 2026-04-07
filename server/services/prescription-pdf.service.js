import PDFDocument from "pdfkit";
import path from "path";
import fs from "fs";

export const generatePrescriptionPdfBuffer = ({
  prescription,
  patient,
  doctor,
  consultation,
}) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        margin: 40,
      });

      const chunks = [];
      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      // =========================
      // COLORS
      // =========================
      const PRIMARY = "#0F766E";
      const SECONDARY = "#334155";
      const LIGHT_BG = "#F8FAFC";
      const BORDER = "#E2E8F0";
      const TEXT = "#0F172A";
      const MUTED = "#64748B";
      const ACCENT = "#14B8A6";
      const WHITE = "#FFFFFF";

      const pageWidth = doc.page.width;
      const contentWidth = pageWidth - 80;
      const leftX = 40;
      const rightX = 302;
      const cardWidth = 253;

      // =========================
      // HELPERS
      // =========================
      const formatDate = (date) => {
        if (!date) return "-";
        return new Date(date).toLocaleDateString("en-IE");
      };

      const formatDateTime = (date) => {
        if (!date) return "-";
        return new Date(date).toLocaleString("en-IE");
      };

      const safe = (value) => (value ? String(value) : "-");

      const drawCard = (x, y, w, h, title) => {
        doc
          .roundedRect(x, y, w, h, 10)
          .fillAndStroke(LIGHT_BG, BORDER);

        if (title) {
          doc
            .fillColor(PRIMARY)
            .font("Helvetica-Bold")
            .fontSize(11)
            .text(title, x + 15, y + 12);
        }
      };

      const drawLabelValue = (label, value, x, y, width = 220) => {
        doc
          .fillColor(MUTED)
          .font("Helvetica")
          .fontSize(9)
          .text(label, x, y, { width });

        doc
          .fillColor(TEXT)
          .font("Helvetica-Bold")
          .fontSize(11)
          .text(safe(value), x, y + 14, { width });
      };

      const drawDivider = (y) => {
        doc
          .strokeColor(BORDER)
          .lineWidth(1)
          .moveTo(40, y)
          .lineTo(pageWidth - 40, y)
          .stroke();
      };

      const ensurePageSpace = (neededHeight, currentY) => {
        if (currentY + neededHeight > doc.page.height - 80) {
          doc.addPage();
          return 40;
        }
        return currentY;
      };

      // =========================
      // PREP DATA
      // =========================
      const issueDate =
        prescription.issuedAt || prescription.createdAt || new Date();

      const patientName =
        `${patient?.firstName || ""} ${patient?.lastName || ""}`.trim() || "-";

      const doctorName =
        `${doctor?.firstName || ""} ${doctor?.lastName || ""}`.trim() || "-";

      const consultationRef = consultation?.reference || "-";
      const consultationStatus = consultation?.status || "-";

      const logoPath = path.join(process.cwd(), "public", "Logo.png");
      const hasLogo = fs.existsSync(logoPath);

      // =========================
      // HEADER
      // =========================
      if (hasLogo) {
        doc.image(logoPath, 40, 28, { width: 70 });
      }

      doc
        .fillColor(TEXT)
        .font("Helvetica-Bold")
        .fontSize(22)
        .text("QuickDoctor.ie", hasLogo ? 120 : 40, 38);

      doc
        .fillColor(MUTED)
        .font("Helvetica")
        .fontSize(10)
        .text("Digital Healthcare & Online Prescription Services", hasLogo ? 120 : 40, 66);

      doc
        .fillColor(TEXT)
        .font("Helvetica")
        .fontSize(10)
        .text("QuickDoctor.ie", 390, 40, { align: "right", width: 160 })
        .text("support@quickdoctor.ie", 390, 55, { align: "right", width: 160 })
        .text("Secure QuickDoctor Platform", 390, 70, {
          align: "right",
          width: 160,
        });

      drawDivider(115);

      // =========================
      // TITLE
      // =========================
      doc
        .fillColor(PRIMARY)
        .font("Helvetica-Bold")
        .fontSize(24)
        .text("Medical Prescription", 40, 135, {
          align: "center",
          width: contentWidth,
        });

      doc
        .fillColor(MUTED)
        .font("Helvetica")
        .fontSize(11)
        .text("Official Medication & Treatment Record", 40, 165, {
          align: "center",
          width: contentWidth,
        });

      // =========================
      // TOP META CARDS
      // =========================
      drawCard(leftX, 200, cardWidth, 90, "Prescription Details");
      drawCard(rightX, 200, cardWidth, 90, "Consultation Details");

      drawLabelValue("Reference No", prescription.reference, 60, 225, 180);
      drawLabelValue("Issued At", formatDateTime(issueDate), 60, 257, 180);

      drawLabelValue("Consultation Ref", consultationRef, 322, 225, 180);
      drawLabelValue("Status", consultationStatus, 322, 257, 180);

      // =========================
      // PATIENT + DOCTOR CARDS
      // =========================
      drawCard(leftX, 310, cardWidth, 90, "Patient Information");
      drawCard(rightX, 310, cardWidth, 90, "Doctor Information");

      drawLabelValue("Patient Name", patientName, 60, 335, 180);
      drawLabelValue("Patient Email", patient?.email || "-", 60, 367, 180);

      drawLabelValue("Doctor Name", doctorName, 322, 335, 180);
      drawLabelValue("Doctor Email", doctor?.email || "-", 322, 367, 180);

      // =========================
      // DIAGNOSIS / NOTES
      // =========================
      drawCard(40, 420, 515, 115, "Clinical Summary");

      drawLabelValue("Diagnosis", prescription.diagnosis || "-", 60, 445, 430);

      doc
        .fillColor(MUTED)
        .font("Helvetica")
        .fontSize(9)
        .text("Doctor Notes", 60, 480, { width: 430 });

      doc
        .fillColor(TEXT)
        .font("Helvetica")
        .fontSize(11)
        .text(prescription.notes || "-", 60, 495, {
          width: 470,
          lineGap: 3,
        });

      // =========================
      // MEDICINES SECTION
      // =========================
      let y = 560;

      doc
        .fillColor(PRIMARY)
        .font("Helvetica-Bold")
        .fontSize(16)
        .text("Prescribed Medicines", 40, y);

      y += 28;

      if (Array.isArray(prescription.medicines) && prescription.medicines.length > 0) {
        prescription.medicines.forEach((med, index) => {
          y = ensurePageSpace(170, y);

          // Medicine card
          doc
            .roundedRect(40, y, 515, 150, 10)
            .fillAndStroke(WHITE, BORDER);

          // Header strip
          doc
            .roundedRect(40, y, 515, 30, 10)
            .fill(PRIMARY);

          doc
            .fillColor(WHITE)
            .font("Helvetica-Bold")
            .fontSize(12)
            .text(`${index + 1}. ${med.name || "Unnamed medicine"}`, 55, y + 9);

          let cardY = y + 42;

          drawLabelValue("Generic Name", med.genericName || "-", 55, cardY, 150);
          drawLabelValue("Strength / Form", `${med.strength || "-"} ${med.form || ""}`.trim(), 220, cardY, 150);
          drawLabelValue("Adult Dose", med.adultDose || "-", 390, cardY, 120);

          cardY += 38;

          drawLabelValue("Indication", med.indication || "-", 55, cardY, 150);
          drawLabelValue("Dosage", med.dosage || "-", 220, cardY, 150);
          drawLabelValue("Frequency", med.frequency || "-", 390, cardY, 120);

          cardY += 38;

          drawLabelValue("Duration", med.duration || "-", 55, cardY, 150);
          drawLabelValue("Contraindications", med.contraindicationsNotes || "-", 220, cardY, 290);

          cardY += 38;

          doc
            .fillColor(MUTED)
            .font("Helvetica")
            .fontSize(9)
            .text("Instructions", 55, cardY, { width: 430 });

          doc
            .fillColor(TEXT)
            .font("Helvetica")
            .fontSize(10)
            .text(med.instructions || "N/A", 55, cardY + 14, {
              width: 450,
            });

          y += 170;
        });
      } else {
        doc
          .roundedRect(40, y, 515, 60, 10)
          .fillAndStroke(WHITE, BORDER);

        doc
          .fillColor(MUTED)
          .font("Helvetica")
          .fontSize(11)
          .text("No medicines added.", 55, y + 22);

        y += 80;
      }

      // =========================
      // PHARMACY SECTION
      // =========================
      if (prescription?.pharmacySnapshot?.name) {
        y = ensurePageSpace(120, y + 10);

        drawCard(40, y, 515, 105, "Preferred Pharmacy");

        drawLabelValue("Pharmacy Name", prescription.pharmacySnapshot.name, 60, y + 25, 180);
        drawLabelValue("Email", prescription.pharmacySnapshot.email || "-", 250, y + 25, 150);
        drawLabelValue("Phone", prescription.pharmacySnapshot.phone || "-", 430, y + 25, 90);

        const addressParts = [
          prescription.pharmacySnapshot.street1,
          prescription.pharmacySnapshot.street2,
          prescription.pharmacySnapshot.street3,
          prescription.pharmacySnapshot.town,
          prescription.pharmacySnapshot.county,
          prescription.pharmacySnapshot.eircode,
        ].filter(Boolean);

        doc
          .fillColor(MUTED)
          .font("Helvetica")
          .fontSize(9)
          .text("Address", 60, y + 62, { width: 430 });

        doc
          .fillColor(TEXT)
          .font("Helvetica-Bold")
          .fontSize(10)
          .text(addressParts.length > 0 ? addressParts.join(", ") : "-", 60, y + 76, {
            width: 450,
          });

        y += 125;
      }

      // =========================
      // SIGNATURE SECTION
      // =========================
      y = ensurePageSpace(120, y + 10);

      doc
        .fillColor(TEXT)
        .font("Helvetica-Bold")
        .fontSize(11)
        .text("Doctor Signature", 340, y + 10);

      doc
        .strokeColor("#94A3B8")
        .lineWidth(1)
        .moveTo(340, y + 50)
        .lineTo(520, y + 50)
        .stroke();

      doc
        .fillColor(MUTED)
        .font("Helvetica-Oblique")
        .fontSize(11)
        .text(doctorName, 340, y + 57, {
          width: 180,
          align: "center",
          lineBreak: false,
        });

      doc
        .fillColor(MUTED)
        .font("Helvetica")
        .fontSize(10)
        .text(`Irish MCRN: ${doctor?.licenseNumber || "-"}`, 340, y + 77, {
          width: 180,
          align: "center",
          lineBreak: false,
        });

      doc
        .fillColor(TEXT)
        .font("Helvetica-Bold")
        .fontSize(11)
        .text("Issued Date", 70, y + 10);

      doc
        .strokeColor("#94A3B8")
        .lineWidth(1)
        .moveTo(70, y + 50)
        .lineTo(230, y + 50)
        .stroke();

      doc
        .fillColor(MUTED)
        .font("Helvetica")
        .fontSize(11)
        .text(formatDate(issueDate), 70, y + 57, {
          width: 160,
          align: "center",
          lineBreak: false,
        });

      // =========================
      // FOOTER
      // =========================
      const footerY = doc.page.height - 45;

      drawDivider(footerY - 10);

      doc
        .fillColor(MUTED)
        .font("Helvetica")
        .fontSize(9)
        .text(
          "This prescription was digitally generated by QuickDoctor.ie",
          40,
          footerY,
          { align: "center", width: contentWidth }
        );

      doc
        .fillColor(ACCENT)
        .font("Helvetica-Bold")
        .fontSize(9)
        .text("quickdoctor.ie", 40, footerY + 16, {
          align: "center",
          width: contentWidth,
        });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};