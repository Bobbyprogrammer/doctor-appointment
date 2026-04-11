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
      
        const parsed = new Date(date);
      
        if (isNaN(parsed.getTime())) return "-";
      
        return parsed.toLocaleDateString("en-IE");
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
        `${prescription?.patientSnapshot?.firstName || ""} ${
          prescription?.patientSnapshot?.lastName || ""
        }`.trim() || "-";
      
        const patientDob = prescription?.patientSnapshot?.dateOfBirth
        ? new Date(prescription.patientSnapshot.dateOfBirth).toLocaleDateString("en-IE")
        : "-";
      
      const patientAddressParts = [
        prescription?.patientSnapshot?.address?.line1,
        prescription?.patientSnapshot?.address?.line2,
        prescription?.patientSnapshot?.address?.city,
        prescription?.patientSnapshot?.address?.state,
        prescription?.patientSnapshot?.address?.postalCode,
        prescription?.patientSnapshot?.address?.country,
      ].filter(Boolean);
      
      const patientAddress =
        patientAddressParts.length > 0 ? patientAddressParts.join(", ") : "-";
      
      const doctorName =
        `${doctor?.firstName || ""} ${doctor?.lastName || ""}`.trim() || "-";
      
      const consultationRef = consultation?.reference || "-";


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
        .text("Online GP Consultation Service", hasLogo ? 120 : 40, 66);

        doc
        .fillColor(TEXT)
        .font("Helvetica")
        .fontSize(10)
        .text("QuickDoctor.ie", 390, 40, { align: "right", width: 160 })
        .text("www.quickdoctor.ie", 390, 55, { align: "right", width: 160 })
        .text("info@quickdoctor.ie", 390, 70, { align: "right", width: 160 })
        .text("+353 83 413 6053", 390, 85, {
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

     

      // =========================
      // TOP META CARDS
      // =========================
      drawCard(leftX, 200, cardWidth, 90, "Prescription Details");
  

      drawLabelValue("Reference No", prescription.reference, 60, 225, 180);
      drawLabelValue("Issued At", formatDateTime(issueDate), 60, 257, 180);

    // =========================
// PATIENT CARD
// =========================
drawCard(leftX, 310, 515, 125, "Patient Information");

drawLabelValue("Patient Name", patientName, 60, 335, 220);
drawLabelValue("Date of Birth", patientDob, 320, 335, 140);

doc
  .fillColor(MUTED)
  .font("Helvetica")
  .fontSize(9)
  .text("Address", 60, 372, { width: 430 });

doc
  .fillColor(TEXT)
  .font("Helvetica-Bold")
  .fontSize(10.5)
  .text(patientAddress, 60, 386, {
    width: 450,
    lineGap: 2,
  });

   
      // =========================
      // MEDICINES SECTION
      // =========================
      let y = 470;

      doc
        .fillColor(PRIMARY)
        .font("Helvetica-Bold")
        .fontSize(16)
        .text("Prescribed Medicines", 40, y);

      y += 28;

      if (Array.isArray(prescription.medicines) && prescription.medicines.length > 0) {
        prescription.medicines.forEach((med, index) => {
          y = ensurePageSpace(145, y);
      
          // Medicine card
          doc
            .roundedRect(40, y, 515, 128, 10)
            .fillAndStroke(WHITE, BORDER);
      
          // Header strip
          doc
            .save()
            .roundedRect(40, y, 515, 30, 10)
            .clip()
            .rect(40, y, 515, 30)
            .fill(PRIMARY)
            .restore();
      
          doc
            .fillColor(WHITE)
            .font("Helvetica-Bold")
            .fontSize(12)
            .text(`${index + 1}. ${med.name || "Unnamed medicine"}`, 55, y + 9, {
              width: 460,
              ellipsis: true,
            });
      
          let cardY = y + 42;
      
          // Generic name row
          drawLabelValue("Generic Name", med.genericName || "-", 55, cardY, 430);
      
          // SAME LINE: Dosage + Frequency + Duration
          cardY += 38;
      
          drawLabelValue("Dosage", med.dosage || "-", 55, cardY, 140);
          drawLabelValue("Frequency", med.frequency || "-", 220, cardY, 140);
          drawLabelValue("Duration", med.duration || "-", 385, cardY, 120);
      
          // Instructions row
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
            .text(med.instructions || "N/A", 55, cardY + 12, {
              width: 450,
              lineGap: 2,
              ellipsis: true,
            });
      
          y += 145;
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
          "Issued following an online consultation with an IMC-registered doctor. Pharmacies may contact QuickDoctor.ie for verification.",
          40,
          footerY,
          { align: "center", width: contentWidth }
        );

    

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};