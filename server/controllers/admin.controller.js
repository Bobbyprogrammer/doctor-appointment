import {User} from "../models/User.js"
import {Service} from "../models/Service.js"
import {Consultation} from "../models/Consultation.js"


export const getDashboardStats = async (req, res) => {
  try {
    const [totalPatients, totalDoctors, totalServices, totalConsultations] =
      await Promise.all([
        User.countDocuments({ role: "patient" }),
        User.countDocuments({ role: "doctor" }),
        Service.countDocuments(),
        Consultation.countDocuments(),
      ]);

    return res.status(200).json({
      success: true,
      stats: {
        totalPatients,
        totalDoctors,
        totalServices,
        totalConsultations,
      },
    });
  } catch (error) {
    console.error("Error in getDashboardStats:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};