import PDFDocument from "pdfkit";
import path from "path";
import fs from "fs";

export const generateSickCertificatePdfBuffer = ({ request, doctor }) => {
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
      const PRIMARY = "#0F766E"; // teal
      const SECONDARY = "#334155"; // slate
      const LIGHT_BG = "#F8FAFC";
      const BORDER = "#E2E8F0";
      const TEXT = "#0F172A";
      const MUTED = "#64748B";
      const ACCENT = "#14B8A6";

      const pageWidth = doc.page.width;
      const contentWidth = pageWidth - 80;

      // =========================
      // HELPERS
      // =========================
      const formatDate = (date) => {
        if (!date) return "-";
        return new Date(date).toLocaleDateString("en-IE");
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

      // =========================
      // PREP DATA
      // =========================
      const issueDate = request.certificateIssueDate || new Date();
      const fromDate = formatDate(request.startDate);
      const toDate = formatDate(request.endDate);

      const totalDays =
        request.startDate && request.endDate
          ? Math.ceil(
              (new Date(request.endDate) - new Date(request.startDate)) /
                (1000 * 60 * 60 * 24)
            ) + 1
          : 0;

      const patientName =
        `${request.firstName || ""} ${request.lastName || ""}`.trim() || "-";

      const doctorName =
        `${doctor?.firstName || ""} ${doctor?.lastName || ""}`.trim() || "-";

      const fullAddress = [
        request.addressLine1,
        request.addressLine2,
        request.city,
        request.stateRegion,
        request.postalCode,
        request.country,
      ]
        .filter(Boolean)
        .join(", ");

      const purposeText =
        request.certificatePurpose === "studies"
          ? "Studies"
          : request.certificatePurpose === "travel"
          ? "Travel"
          : request.certificatePurpose === "work_from_home"
          ? "Work From Home"
          : "Work";

      // =========================
      // LOGO
      // =========================
      const logoPath = path.join(process.cwd(), "public", "Logo.png");
      const hasLogo = fs.existsSync(logoPath);

      // =========================
      // HEADER
      // =========================
      if (hasLogo) {
        doc.image(logoPath, 40, 30, { width: 70 });
      }

      doc
        .fillColor(TEXT)
        .font("Helvetica-Bold")
        .fontSize(22)
        .text("QuickDoctor.ie", hasLogo ? 120 : 40, 40);

      doc
        .fillColor(MUTED)
        .font("Helvetica")
        .fontSize(10)
        .text("Digital Healthcare & Medical Certification", hasLogo ? 120 : 40, 68);

      doc
        .fillColor(TEXT)
        .font("Helvetica")
        .fontSize(10)
        .text("QuickDoctor.ie", 390, 40, { align: "right", width: 160 })
        .text("info@quickdoctor.ie", 390, 55, { align: "right", width: 160 })
        .text("Medical Certificate Services", 390, 70, {
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
        .text("Sick Certificate", 40, 135, {
          align: "center",
          width: contentWidth,
        });

      doc
        .fillColor(MUTED)
        .font("Helvetica")
        .fontSize(11)
        .text("Official Medical Leave Certification", 40, 165, {
          align: "center",
          width: contentWidth,
        });

      // =========================
      // CERTIFICATE META CARD
      // =========================
      drawCard(40, 200, 515, 80, "Certificate Details");

      drawLabelValue("Reference No", request.reference, 60, 225, 120);
      drawLabelValue("Issue Date", formatDate(issueDate), 200, 225, 120);
      drawLabelValue("Doctor", doctorName, 340, 225, 150);
      drawLabelValue("Irish MCRN", doctor?.licenseNumber || "-", 340, 225 + 32, 150);

      // =========================
      // PATIENT CARD
      // =========================
      drawCard(40, 300, 515, 115, "Patient Information");

      drawLabelValue("Full Name", patientName, 60, 325, 180);
      drawLabelValue("Date of Birth", formatDate(request.dateOfBirth), 260, 325, 120);
      drawLabelValue("Email", request.email, 400, 325, 130);

      drawLabelValue("Phone", request.phone, 60, 360, 180);
      drawLabelValue("Purpose", purposeText, 260, 360, 120);

      doc
        .fillColor(MUTED)
        .font("Helvetica")
        .fontSize(9)
        .text("Address", 400, 360, { width: 130 });

      doc
        .fillColor(TEXT)
        .font("Helvetica-Bold")
        .fontSize(10)
        .text(fullAddress || "-", 400, 374, { width: 130 });

      // =========================
      // LEAVE DETAILS CARD
      // =========================
      drawCard(40, 435, 515, 105, "Medical Leave Details");

      drawLabelValue("Unfit For", purposeText, 60, 460, 150);
      drawLabelValue("From", fromDate, 220, 460, 100);
      drawLabelValue("Until", toDate, 330, 460, 100);
      drawLabelValue("Number of Days", totalDays || "-", 440, 460, 90);

      doc
        .fillColor(MUTED)
        .font("Helvetica")
        .fontSize(9)
        .text("Medical Reason / Illness", 60, 495, { width: 430 });

      doc
        .fillColor(TEXT)
        .font("Helvetica-Bold")
        .fontSize(11)
        .text(request.illnessDescription || "-", 60, 510, { width: 430 });

      // =========================
      // CERTIFICATION STATEMENT
      // =========================
      drawCard(40, 560, 515, 95, "Doctor Certification");

      const statement = `I, Dr. ${doctorName}, a registered Irish General Practitioner, hereby certify that ${patientName} is medically unfit for ${purposeText.toLowerCase()} from ${fromDate} until ${toDate}. This certificate has been issued based on the medical information provided and clinical review completed through QuickDoctor.ie.`;

      doc
        .fillColor(TEXT)
        .font("Helvetica")
        .fontSize(11)
        .text(statement, 60, 590, {
          width: 475,
          lineGap: 4,
          align: "justify",
        });

  // =========================
// SIGNATURE AREA
// =========================

// LEFT SIDE - ISSUE DATE
doc
.fillColor(TEXT)
.font("Helvetica-Bold")
.fontSize(11)
.text("Date of Issue", 70, 695);

doc
.strokeColor("#94A3B8")
.lineWidth(1)
.moveTo(70, 735)
.lineTo(230, 735)
.stroke();

doc
.fillColor(MUTED)
.font("Helvetica")
.fontSize(11)
.text(formatDate(issueDate), 70, 742, {
  width: 160,
  align: "center",
  lineBreak: false,
});

// RIGHT SIDE - DOCTOR SIGNATURE
doc
.fillColor(TEXT)
.font("Helvetica-Bold")
.fontSize(11)
.text("Doctor Signature", 340, 695);

doc
.strokeColor("#94A3B8")
.lineWidth(1)
.moveTo(340, 735)
.lineTo(520, 735)
.stroke();

// Doctor Name just under line
doc
.fillColor(MUTED)
.font("Helvetica")
.fontSize(11)
.text(doctorName, 340, 742, {
  width: 180,
  align: "center",
  lineBreak: false,
});

// MCRN below doctor name
doc
.fillColor(MUTED)
.font("Helvetica")
.fontSize(10)
.text(`Irish MCRN: ${doctor?.licenseNumber || "-"}`, 340, 762, {
  width: 180,
  align: "center",
  lineBreak: false,
});

      // =========================
      // FOOTER
      // =========================
      drawDivider(790);

      doc
        .fillColor(MUTED)
        .font("Helvetica")
        .fontSize(9)
        .text(
          "Employers may contact QuickDoctor.ie to verify the authenticity of this certificate.",
          40,
          802,
          { align: "center", width: contentWidth }
        );

     

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};