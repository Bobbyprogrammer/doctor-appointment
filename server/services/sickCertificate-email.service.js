import { mailTransporter } from "../config/mailer.js";

export const sendSickCertificateToPatientEmail = async ({
  to,
  patientName,
  reference,
  pdfBuffer,
}) => {
  return mailTransporter.sendMail({
    from: `"Telemedicine" <info@telemedicine.com>`,
    to,
    subject: `Your Sick Certificate ${reference}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Your Sick Certificate</h2>
        <p>Hello ${patientName || "Patient"},</p>
        <p>Your sick certificate <strong>${reference}</strong> is attached to this email.</p>
        <p>Regards,<br/>Telemedicine Team</p>
      </div>
    `,
    attachments: [
      {
        filename: `${reference}.pdf`,
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    ],
  });
};