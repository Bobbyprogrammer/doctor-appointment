
import mongoose from "mongoose";
import { SickCertificate } from "../models/sickCertificate.js";
import { User } from "../models/User.js";
import { DoctorProfile } from "../models/DoctorProfile.js";
import { uploadToCloudinary } from "../config/cloudinary.js";
import { generateSickCertificatePdfBuffer } from "../services/sickCertificate-pdf.service.js";
import { sendSickCertificateToPatientEmail } from "../services/sickCertificate-email.service.js";

import { stripe } from "../config/stripe.js";

const generateSickCertificateReference = async () => {
     const count = await SickCertificate.countDocuments();
     return `SC-${String(count + 1).padStart(5, "0")}`;
   };

   export const createSickCertificateRequest = async (req, res) => {
     try {
       const {
         certificatePurpose,
         firstName,
         lastName,
         email,
         phone,
         dateOfBirth,
         gender,
         addressLine1,
         addressLine2,
         city,
         stateRegion,
         postalCode,
         country,
         employerOrOrganization,
         consultationReason,
         hasMedicalEmergency,
         canTravelToClinic,
         isPregnant,
         awareOfRedFlags,
         symptoms,
         illnessDescription,
         startDate,
         endDate,
         variationType,
       } = req.body;
   
       if (!certificatePurpose || !firstName || !lastName || !email || !phone) {
         return res.status(400).json({
           success: false,
           message: "Missing required personal information",
         });
       }
   
       if (!startDate || !endDate) {
         return res.status(400).json({
           success: false,
           message: "Start and end date are required",
         });
       }
   
       const start = new Date(startDate);
       const end = new Date(endDate);
   
       const diffDays =
         Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
   
       if (diffDays > 7) {
         return res.status(400).json({
           success: false,
           message: "Maximum sick certificate duration is 7 days",
         });
       }
   
       let amount = 0;
       if (variationType === "express") amount = 20.00;
       else if (variationType === "standard") amount = 26.99;
   
       const uploadedFiles = [];
   
       if (req.files && req.files.length > 0) {
         for (const file of req.files) {
           const uploaded = await uploadToCloudinary(file.buffer, {
             folder: "telemedicine/sick-certificates/proofs",
             resource_type: "auto",
           });
   
           uploadedFiles.push({
             name: file.originalname,
             url: uploaded.url,
             public_id: uploaded.public_id,
             type: file.mimetype,
           });
         }
       }
   
       const reference = await generateSickCertificateReference();
   
       const sickRequest = await SickCertificate.create({
         patientId: req.user._id,
         reference,
   
         certificatePurpose,
         firstName,
         lastName,
         email,
         phone,
         dateOfBirth,
         gender,
         addressLine1,
         addressLine2,
         city,
         stateRegion,
         postalCode,
         country,
   
         employerOrOrganization,
         consultationReason,
         hasMedicalEmergency: hasMedicalEmergency === "true" || hasMedicalEmergency === true,
         canTravelToClinic: canTravelToClinic === "true" || canTravelToClinic === true,
         isPregnant: isPregnant === "true" || isPregnant === true,
         awareOfRedFlags: awareOfRedFlags === "true" || awareOfRedFlags === true,
         symptoms: typeof symptoms === "string" ? JSON.parse(symptoms) : symptoms || [],
         illnessDescription,
         startDate,
         endDate,
   
         proofFiles: uploadedFiles,
   
         variationType,
         amount,
         status: "pending_payment",
         paymentStatus: "unpaid",
       });
   
       return res.status(201).json({
         success: true,
         message: "Sick certificate request created successfully",
         request: sickRequest,
       });
     } catch (error) {
       console.error("Error in createSickCertificateRequest:", error);
       return res.status(500).json({
         success: false,
         message: "Failed to create sick certificate request",
         error: error.message,
       });
     }
   };


   export const getMySickCertificateRequests = async (req, res) => {
     try {
       const requests = await SickCertificate.find({ patientId: req.user._id })
         .sort({ createdAt: -1 })
         .populate("doctorId", "firstName lastName email");
   
       return res.status(200).json({
         success: true,
         count: requests.length,
         requests,
       });
     } catch (error) {
       console.error("Error in getMySickCertificateRequests:", error);
       return res.status(500).json({
         success: false,
         message: "Failed to fetch sick certificate requests",
         error: error.message,
       });
     }
   };

   export const getDoctorSickCertificateRequests = async (req, res) => {
     try {
       const requests = await SickCertificate.find({ doctorId: req.user._id })
         .sort({ createdAt: -1 })
         .populate("patientId", "firstName lastName email");
   
       return res.status(200).json({
         success: true,
         count: requests.length,
         requests,
       });
     } catch (error) {
       console.error("Error in getDoctorSickCertificateRequests:", error);
       return res.status(500).json({
         success: false,
         message: "Failed to fetch doctor sick certificate requests",
         error: error.message,
       });
     }
   };

   export const getAllSickCertificateRequests = async (req, res) => {
     try {
       const requests = await SickCertificate.find({})
         .sort({ createdAt: -1 })
         .populate("patientId", "firstName lastName email")
         .populate("doctorId", "firstName lastName email");
   
       return res.status(200).json({
         success: true,
         count: requests.length,
         requests,
       });
     } catch (error) {
       console.error("Error in getAllSickCertificateRequests:", error);
       return res.status(500).json({
         success: false,
         message: "Failed to fetch all sick certificate requests",
         error: error.message,
       });
     }
   };


   export const getSickCertificateRequestById = async (req, res) => {
     try {
       const { id } = req.params;
   
       const request = await SickCertificate.findById(id)
         .populate("patientId", "firstName lastName email")
         .populate("doctorId", "firstName lastName email");
   
       if (!request) {
         return res.status(404).json({
           success: false,
           message: "Sick certificate request not found",
         });
       }
   
       return res.status(200).json({
         success: true,
         request,
       });
     } catch (error) {
       console.error("Error in getSickCertificateRequestById:", error);
       return res.status(500).json({
         success: false,
         message: "Failed to fetch sick certificate request",
         error: error.message,
       });
     }
   };


   export const assignDoctorToSickCertificate = async (req, res) => {
     try {
       const { id } = req.params;
       const { doctorId } = req.body;
   
       if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(doctorId)) {
         return res.status(400).json({
           success: false,
           message: "Invalid request or doctor id",
         });
       }
   
       const request = await SickCertificate.findById(id);
       if (!request) {
         return res.status(404).json({
           success: false,
           message: "Sick certificate request not found",
         });
       }
   
       const doctor = await User.findById(doctorId).select("firstName lastName email role isActive");
       if (!doctor || doctor.role !== "doctor" || !doctor.isActive) {
         return res.status(400).json({
           success: false,
           message: "Invalid doctor selected",
         });
       }
   
       request.doctorId = doctorId;
   
       if (request.status === "waiting_for_review") {
         request.status = "under_review";
       }
   
       await request.save();
   
       return res.status(200).json({
         success: true,
         message: "Doctor assigned successfully",
         request,
       });
     } catch (error) {
       console.error("Error in assignDoctorToSickCertificate:", error);
       return res.status(500).json({
         success: false,
         message: "Failed to assign doctor",
         error: error.message,
       });
     }
   };



   export const updateSickCertificateStatus = async (req, res) => {
     try {
       const { id } = req.params;
       const { status, doctorReviewNotes = "" } = req.body;
   
       const allowedStatuses = [
         "under_review",
         "approved",
         "rejected",
         "certificate_generated",
       ];
   
       if (!allowedStatuses.includes(status)) {
         return res.status(400).json({
           success: false,
           message: "Invalid status",
         });
       }
   
       const request = await SickCertificate.findById(id);
   
       if (!request) {
         return res.status(404).json({
           success: false,
           message: "Sick certificate request not found",
         });
       }
   
       if (String(request.doctorId) !== String(req.user._id)) {
         return res.status(403).json({
           success: false,
           message: "Not authorized to update this request",
         });
       }
   
       request.status = status;
       request.doctorReviewNotes = doctorReviewNotes;
   
       await request.save();
   
       return res.status(200).json({
         success: true,
         message: "Status updated successfully",
         request,
       });
     } catch (error) {
       console.error("Error in updateSickCertificateStatus:", error);
       return res.status(500).json({
         success: false,
         message: "Failed to update sick certificate status",
         error: error.message,
       });
     }
   };

   export const createSickCertificatePdf = async (req, res) => {
     try {
       const { id } = req.params;
   
       const request = await SickCertificate.findById(id)
         .populate("doctorId", "firstName lastName email")
         .populate("patientId", "firstName lastName email");
   
       if (!request) {
         return res.status(404).json({
           success: false,
           message: "Sick certificate request not found",
         });
       }
   
       if (String(request.doctorId?._id || request.doctorId) !== String(req.user._id)) {
         return res.status(403).json({
           success: false,
           message: "Not authorized to generate certificate for this request",
         });
       }
   
       const doctorProfile = await DoctorProfile.findOne({ userId: req.user._id });
   
       const doctorData = {
         firstName: request.doctorId?.firstName || "",
         lastName: request.doctorId?.lastName || "",
         licenseNumber: doctorProfile?.licenseNumber || "",
       };
   
       const pdfBuffer = await generateSickCertificatePdfBuffer({
         request,
         doctor: doctorData,
       });
   
       const uploadedPdf = await uploadToCloudinary(pdfBuffer, {
         folder: "telemedicine/sick-certificates/pdfs",
         resource_type: "raw",
         public_id: request.reference,
         format: "pdf",
       });
   
       request.certificatePdfUrl = uploadedPdf.url;
       request.certificatePdfPublicId = uploadedPdf.public_id;
       request.certificateIssueDate = new Date();
       request.status = "certificate_generated";
   
       await request.save();
   
       return res.status(200).json({
         success: true,
         message: "Sick certificate PDF generated successfully",
         request,
       });
     } catch (error) {
       console.error("Error in createSickCertificatePdf:", error);
       return res.status(500).json({
         success: false,
         message: "Failed to generate sick certificate PDF",
         error: error.message,
       });
     }
   };


   export const sendSickCertificateToPatient = async (req, res) => {
     try {
       const { id } = req.params;
   
       const request = await SickCertificate.findById(id)
         .populate("patientId", "firstName lastName email")
         .populate("doctorId", "firstName lastName email");
   
       if (!request) {
         return res.status(404).json({
           success: false,
           message: "Sick certificate request not found",
         });
       }
   
       if (!request.patientId?.email) {
         return res.status(400).json({
           success: false,
           message: "Patient email not found",
         });
       }
   
       const doctorProfile = await DoctorProfile.findOne({ userId: request.doctorId?._id || request.doctorId });
   
       const doctorData = {
         firstName: request.doctorId?.firstName || "",
         lastName: request.doctorId?.lastName || "",
         licenseNumber: doctorProfile?.licenseNumber || "",
       };
   
       const pdfBuffer = await generateSickCertificatePdfBuffer({
         request,
         doctor: doctorData,
       });
   
       await sendSickCertificateToPatientEmail({
         to: request.patientId.email,
         patientName: `${request.patientId.firstName || ""} ${request.patientId.lastName || ""}`.trim(),
         reference: request.reference,
         pdfBuffer,
       });
   
       request.sentToPatientEmail = true;
       request.sentToPatientEmailAt = new Date();
       request.sentToPatientEmailBy = req.user._id;
       await request.save();
   
       return res.status(200).json({
         success: true,
         message: "Sick certificate sent to patient successfully",
       });
     } catch (error) {
       console.error("Error in sendSickCertificateToPatient:", error);
       return res.status(500).json({
         success: false,
         message: "Failed to send sick certificate to patient",
         error: error.message,
       });
     }
   };


   export const downloadSickCertificatePdf = async (req, res) => {
     try {
       const { id } = req.params;
   
       const request = await SickCertificate.findById(id);
   
       if (!request) {
         return res.status(404).json({
           success: false,
           message: "Sick certificate request not found",
         });
       }
   
       if (!request.certificatePdfUrl) {
         return res.status(400).json({
           success: false,
           message: "Certificate PDF not generated yet",
         });
       }
   
       return res.status(200).json({
         success: true,
         url: request.certificatePdfUrl,
       });
     } catch (error) {
       console.error("Error in downloadSickCertificatePdf:", error);
       return res.status(500).json({
         success: false,
         message: "Failed to fetch certificate PDF",
         error: error.message,
       });
     }
   };


   export const createSickCertificateCheckoutSession = async (req, res) => {
     try {
       const { id } = req.params;
   
       const request = await SickCertificate.findById(id);
   
       if (!request) {
         return res.status(404).json({
           success: false,
           message: "Sick certificate request not found",
         });
       }
   
       if (String(request.patientId) !== String(req.user._id)) {
         return res.status(403).json({
           success: false,
           message: "Not authorized",
         });
       }
   
       if (request.paymentStatus === "paid") {
         return res.status(400).json({
           success: false,
           message: "Payment already completed",
         });
       }

       const successUrl = `${process.env.PATIENT_APP_URL}/patient/sick-certificate?payment=success&session_id={CHECKOUT_SESSION_ID}`;
const cancelUrl = `${process.env.PATIENT_APP_URL}/patient/payment/sick-certificate?payment=cancelled`;
   
     


       const session = await stripe.checkout.sessions.create({
         payment_method_types: ["card"],
         mode: "payment",
         customer_email: request.email,
         line_items: [
           {
             price_data: {
               currency: "eur",
               product_data: {
                 name: `Sick Certificate - ${request.variationType}`,
                 description: `Sick certificate request ${request.reference}`,
               },
               unit_amount: Math.round(request.amount * 100),
             },
             quantity: 1,
           },
         ],
         success_url: successUrl,
         cancel_url: cancelUrl,
         metadata: {
           type: "sick_certificate",
           sickCertificateId: String(request._id),
         },
       });
   
       request.stripeCheckoutSessionId = session.id;
       await request.save();
   
       return res.status(200).json({
         success: true,
         url: session.url,
         message: "Checkout session created successfully",
       });
     } catch (error) {
       console.error("Error in createSickCertificateCheckoutSession:", error);
       return res.status(500).json({
         success: false,
         message: "Failed to create checkout session",
         error: error.message,
       });
     }
   };


   export const verifySickCertificatePayment = async (req, res) => {
     try {
       const { sessionId } = req.params;
   
       const session = await stripe.checkout.sessions.retrieve(sessionId);
   
       if (!session) {
         return res.status(404).json({
           success: false,
           message: "Stripe session not found",
         });
       }
   
       const sickCertificateId = session.metadata?.sickCertificateId;
       if (!sickCertificateId) {
         return res.status(400).json({
           success: false,
           message: "No sick certificate id found in session metadata",
         });
       }
   
       const request = await SickCertificate.findById(sickCertificateId);
   
       if (!request) {
         return res.status(404).json({
           success: false,
           message: "Sick certificate request not found",
         });
       }
   
       if (session.payment_status === "paid") {
         request.paymentStatus = "paid";
         request.status = "waiting_for_review";
         request.paidAt = new Date();
         request.stripePaymentIntentId = session.payment_intent;
         await request.save();
       }
   
       return res.status(200).json({
         success: true,
         paid: session.payment_status === "paid",
         request,
       });
     } catch (error) {
       console.error("Error in verifySickCertificatePayment:", error);
       return res.status(500).json({
         success: false,
         message: "Failed to verify payment",
         error: error.message,
       });
     }
   };