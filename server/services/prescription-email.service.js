import { mailTransporter } from "../config/mailer.js";

export const sendPrescriptionToPharmacyEmail = async ({
  to,
  pharmacyName,
  patientName,
  doctorName,
  prescriptionReference,
  pdfBuffer,
}) => {

  // console.log("PDF URL:", prescription.pdfUrl);
console.log("PDF buffer length:", pdfBuffer.length);
  return mailTransporter.sendMail({
    from: process.env.MAIL_FROM || "no-reply@example.com",
    to,
    subject: `Prescription ${prescriptionReference} for ${patientName}`,
    html: `
      <p>Hello ${pharmacyName || "Pharmacy"},</p>
      <p>Please find attached a prescription.</p>
      <p><strong>Prescription Ref:</strong> ${prescriptionReference}</p>
      <p><strong>Patient:</strong> ${patientName}</p>
      <p><strong>Doctor:</strong> ${doctorName}</p>
      <p>Regards,<br/>Doctor Appointment Team</p>
    `,
    attachments: [
      {
        filename: `${prescriptionReference}.pdf`,
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    ],
  });
};

export const sendPrescriptionToPatientEmail = async ({
  to,
  patientName,
  doctorName,
  prescriptionReference,
  pdfBuffer,
}) => {
  return mailTransporter.sendMail({
    from: process.env.MAIL_FROM || "no-reply@example.com",
    to,
    subject: `Your Prescription ${prescriptionReference}`,
    html: `
      <p>Hello ${patientName || "Patient"},</p>
      <p>Your prescription is attached.</p>
      <p><strong>Prescription Ref:</strong> ${prescriptionReference}</p>
      <p><strong>Doctor:</strong> ${doctorName}</p>
      <p>Regards,<br/>Doctor Appointment Team</p>
    `,
    attachments: [
      {
        filename: `${prescriptionReference}.pdf`,
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    ],
  });
};