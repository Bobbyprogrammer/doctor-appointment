
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser"
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
import { notFound, errorHandler } from "./middlewares/error.middleware.js";
dotenv.config()
const app = express();

// database connection
connectDB()
// cloudinary connection
connectCloudinary()

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  })
);

// Health route
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

// 404 and global error handler (must be after routes)
app.use(notFound);
app.use(errorHandler);

const PORT=process.env.PORT || 5000

app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`);
    
})