import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import connectCloudinary from "./config/cloudinary.js";

import authRoutes from "./routes/auth.routes.js";
import doctorRoutes from "./routes/doctor.routes.js";
import serviceRoutes from "./routes/service.routes.js";
import consultationRoutes from "./routes/consultation.routes.js";
import patientRoutes from "./routes/patient.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import prescriptionRoutes from "./routes/prescription.routes.js";
import questionnaireRoutes from "./routes/questionnaire.routes.js";
import stripeRoutes from "./routes/stripe.routes.js";
import pharmacyRoutes from "./routes/pharmacy.route.js";
import sickCertificateRoutes from "./routes/sickCertificate.routes.js"
import blogRoutes from "./routes/blog.routes.js";
import medicineRoutes from "./routes/medicine.routes.js";
import { notFound, errorHandler } from "./middlewares/error.middleware.js";

dotenv.config();

const app = express();

const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

// Stripe webhook FIRST
app.use("/api/stripe", stripeRoutes);

// database connection
connectDB();

// cloudinary connection
connectCloudinary();

// normal middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin(origin, callback) {
      
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running successfully",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/consultations", consultationRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/admins", adminRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/questionnaires", questionnaireRoutes);
app.use("/api/pharmacies", pharmacyRoutes);
app.use("/api/sick-certificates", sickCertificateRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/medicines", medicineRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});