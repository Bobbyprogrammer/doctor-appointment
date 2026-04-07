import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { DoctorProfile } from "../models/DoctorProfile.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../config/cloudinary.js";
import { Consultation } from "../models/Consultation.js";
import { SickCertificate } from "../models/sickCertificate.js";

export const getDoctorDashboardStats = async (req, res) => {
  try {
    const doctorId = req.user._id;

    const [
      assignedConsultations,
      underReviewConsultations,
      completedConsultations,

      assignedSickCertificates,
      underReviewSickCertificates,
      completedSickCertificates,
    ] = await Promise.all([
      Consultation.countDocuments({
        doctorId,
      }),

      Consultation.countDocuments({
        doctorId,
        status: "pending_payment",
      }),

      Consultation.countDocuments({
        doctorId,
        status: "completed",
      }),

      SickCertificate.countDocuments({
        doctorId,
      }),

      SickCertificate.countDocuments({
        doctorId,
        status: "under_review",
      }),

      SickCertificate.countDocuments({
        doctorId,
        status: {
          $in: ["certificate_generated", "approved"],
        },
      }),
    ]);

    console.log("completed",completedConsultations);
    
    return res.status(200).json({
      success: true,
      stats: {
        assignedConsultations,
        underReviewConsultations,
        completedConsultations,

        assignedSickCertificates,
        underReviewSickCertificates,
        completedSickCertificates,
      },
    });
  } catch (error) {
    console.error("Error in getDoctorDashboardStats:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


export const createDoctor = async (req, res) => {
  const getSingleValue = (value, defaultValue = "") => {
    if (Array.isArray(value)) return value[0] ?? defaultValue;
    return value ?? defaultValue;
  };

  let createdUser = null;
  let uploadedProfilePic = null;
  let uploadedDocuments = [];

  try {
    const body = req.body;

    const firstName = getSingleValue(body.firstName)?.trim();
    const lastName = getSingleValue(body.lastName)?.trim();
    const email = getSingleValue(body.email)?.trim()?.toLowerCase();
    const password = getSingleValue(body.password);
    const phone = getSingleValue(body.phone)?.trim() || "";

    const specialization = getSingleValue(body.specialization)?.trim();
    const licenseNumber = getSingleValue(body.licenseNumber)?.trim();
    const experienceYears =
      parseInt(getSingleValue(body.experienceYears), 10) || 0;
    const consultationFee =
      parseFloat(getSingleValue(body.consultationFee)) || 0;

    const genderValue = getSingleValue(body.gender);
    const gender = ["male", "female", "other"].includes(genderValue)
      ? genderValue
      : "other";

    const dateOfBirthValue = getSingleValue(body.dateOfBirth, "");
    const dateOfBirth =
      dateOfBirthValue && !isNaN(new Date(dateOfBirthValue).getTime())
        ? new Date(dateOfBirthValue)
        : null;

    const address = getSingleValue(body.address)?.trim() || "";
    const bio = getSingleValue(body.bio)?.trim() || "";

    const workStartTime = getSingleValue(body.workStartTime, null);
    const workEndTime = getSingleValue(body.workEndTime, null);

   

    let qualification = [];
    const qualificationValue = getSingleValue(body.qualification);
    if (qualificationValue) {
      try {
        qualification =
          typeof qualificationValue === "string"
            ? JSON.parse(qualificationValue)
            : qualificationValue;
      } catch (_) {
        qualification = [];
      }
    }

    let availableDays = [];
    const availableDaysValue = getSingleValue(body.availableDays);
    if (availableDaysValue) {
      try {
        const days =
          typeof availableDaysValue === "string"
            ? JSON.parse(availableDaysValue)
            : availableDaysValue;

        const allowedDays = [
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
          "sunday",
        ];

        availableDays = Array.isArray(days)
          ? days.filter((d) =>
              allowedDays.includes(String(d).toLowerCase())
            )
          : [];
      } catch (_) {
        availableDays = [];
      }
    }

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide firstName, lastName, email and password",
      });
    }

    if (!specialization || !licenseNumber) {
      return res.status(400).json({
        success: false,
        message: "Please provide specialization and licenseNumber for the doctor",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "A user already exists with this email",
      });
    }

    const existingLicense = await DoctorProfile.findOne({ licenseNumber });
    if (existingLicense) {
      return res.status(400).json({
        success: false,
        message: "A doctor with this license number already exists",
      });
    }

    const profilePicFile = req.files?.profilePic?.[0];
    const documentFiles = req.files?.documents || [];

    let profilePic = { url: "", public_id: "" };

    if (profilePicFile && profilePicFile.buffer) {
      try {
        const result = await uploadToCloudinary(profilePicFile.buffer, {
          folder: "doctor-appointment/profile-pics",
          resource_type: "image",
        });

        profilePic = {
          url: result.url,
          public_id: result.public_id,
        };

        uploadedProfilePic = result;
      } catch (uploadError) {
        console.error("Cloudinary profile pic upload error:", uploadError);
        return res.status(500).json({
          success: false,
          message: "Failed to upload profile picture",
          error: uploadError.message,
        });
      }
    }

let uploadedDocuments = [];



    if (documentFiles.length > 0) {
      try {
        for (const file of documentFiles) {


          const ext = file.originalname.split(".").pop();

          const result = await uploadToCloudinary(file.buffer, {
            folder: "doctor-appointment/doctor-documents",
            resource_type: "raw",
            public_id: `${Date.now()}-${file.originalname.replace(/\.[^/.]+$/, "")}`,
            format: ext,
          });



          uploadedDocuments.push({
            name: file.originalname,
            url: result.url,
            public_id: result.public_id,
            type: file.mimetype || "document",
          });
        }
      } catch (uploadError) {
        console.error("Cloudinary documents upload error:", uploadError);

        if (uploadedProfilePic?.public_id) {
          await deleteFromCloudinary(uploadedProfilePic.public_id, "image").catch(
            () => {}
          );
        }

        for (const doc of uploadedDocuments) {
          await deleteFromCloudinary(doc.public_id, "raw").catch(() => {});
        }

        return res.status(500).json({
          success: false,
          message: "Failed to upload doctor documents",
          error: uploadError.message,
        });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    createdUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      role: "doctor",
      profilePic,
      createdBy: req.user._id,
      isActive: true,
    });

    const doctorProfile = await DoctorProfile.create({
      userId: createdUser._id,
      specialization,
      licenseNumber,
      experienceYears,
      consultationFee,
      gender,
      dateOfBirth,
      phone: createdUser.phone,
      address,
      bio,
      qualification: Array.isArray(qualification) ? qualification : [],
      availableDays,
      workStartTime,
      workEndTime,
      status: "approved",
      createdBy: req.user._id,
      documents: uploadedDocuments,
    });

    createdUser.doctorProfile = doctorProfile._id;
    await createdUser.save({ validateBeforeSave: false });

    return res.status(201).json({
      success: true,
      message: "Doctor created successfully",
      doctor: formatDoctorResponse(createdUser, doctorProfile),
    });
  } catch (error) {
    console.error("Error in createDoctor:", error);

    if (createdUser?._id) {
      await User.findByIdAndDelete(createdUser._id).catch(() => {});
    }

    if (uploadedProfilePic?.public_id) {
      await deleteFromCloudinary(uploadedProfilePic.public_id, "image").catch(
        () => {}
      );
    }

    for (const doc of uploadedDocuments) {
      await deleteFromCloudinary(doc.public_id, "raw").catch(() => {});
    }

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const getDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" })
      .select("-password")
      .populate("doctorProfile");

    return res.status(200).json({
      success: true,
      count: doctors.length,
      doctors,
    });
  } catch (error) {
    console.error("Error in getDoctors:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// export const getDoctorById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const doctor = await User.findOne({ _id: id, role: "doctor" })
//       .select("-password")
//       .populate("doctorProfile");

//     if (!doctor) {
//       return res.status(404).json({
//         success: false,
//         message: "Doctor not found",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       doctor,
//     });
//   } catch (error) {
//     console.error("Error in getDoctorById:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Server error",
//       error: error.message,
//     });
//   }
// };

export const updateDoctor = async (req, res) => {
  const getSingleValue = (value, defaultValue = "") => {
    if (Array.isArray(value)) return value[0] ?? defaultValue;
    return value ?? defaultValue;
  };

  try {
    const { id } = req.params;
    const body = req.body;

    const user = await User.findOne({ _id: id, role: "doctor" });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    const doctorProfile = await DoctorProfile.findOne({ userId: user._id });
    if (!doctorProfile) {
      return res.status(404).json({
        success: false,
        message: "Doctor profile not found",
      });
    }

    const profilePicFile = req.files?.profilePic?.[0];
    const documentFiles = req.files?.documents || [];

    const firstName = getSingleValue(body.firstName, undefined);
    const lastName = getSingleValue(body.lastName, undefined);
    const phone = getSingleValue(body.phone, undefined);
    const password = getSingleValue(body.password, undefined);
    const emailValue = getSingleValue(body.email, undefined);

    const specialization = getSingleValue(body.specialization, undefined);
    const licenseNumber = getSingleValue(body.licenseNumber, undefined);
    const experienceYearsValue = getSingleValue(body.experienceYears, undefined);
    const consultationFeeValue = getSingleValue(body.consultationFee, undefined);
    const genderValue = getSingleValue(body.gender, undefined);
    const dateOfBirthValue = getSingleValue(body.dateOfBirth, undefined);
    const address = getSingleValue(body.address, undefined);
    const bio = getSingleValue(body.bio, undefined);
    const qualificationValue = getSingleValue(body.qualification, undefined);
    const availableDaysValue = getSingleValue(body.availableDays, undefined);
    const workStartTimeValue = getSingleValue(body.workStartTime, undefined);
    const workEndTimeValue = getSingleValue(body.workEndTime, undefined);

    const isActiveValue = getSingleValue(body.isActive, undefined);
  

    if (firstName !== undefined) user.firstName = firstName.trim();
    if (lastName !== undefined) user.lastName = lastName.trim();
    if (phone !== undefined) user.phone = phone.trim();

    if (password !== undefined && password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    if (emailValue !== undefined) {
      const normalizedEmail = emailValue.trim().toLowerCase();

      if (normalizedEmail !== user.email) {
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
          return res.status(400).json({
            success: false,
            message: "Another user already exists with this email",
          });
        }
        user.email = normalizedEmail;
      }
    }

    if (specialization !== undefined) {
      doctorProfile.specialization = specialization.trim();
    }

    if (licenseNumber !== undefined) {
      const newLicense = licenseNumber.trim();

      if (newLicense !== doctorProfile.licenseNumber) {
        const existingLicense = await DoctorProfile.findOne({
          licenseNumber: newLicense,
        });

        if (existingLicense) {
          return res.status(400).json({
            success: false,
            message: "Another doctor already exists with this license number",
          });
        }

        doctorProfile.licenseNumber = newLicense;
      }
    }

    if (experienceYearsValue !== undefined) {
      doctorProfile.experienceYears =
        parseInt(experienceYearsValue, 10) || 0;
    }

    if (consultationFeeValue !== undefined) {
      doctorProfile.consultationFee =
        parseFloat(consultationFeeValue) || 0;
    }

    if (genderValue !== undefined) {
      const allowedGenders = ["male", "female", "other"];
      if (allowedGenders.includes(genderValue)) {
        doctorProfile.gender = genderValue;
      }
    }

    if (dateOfBirthValue !== undefined) {
      const parsedDate = new Date(dateOfBirthValue);
      doctorProfile.dateOfBirth = !isNaN(parsedDate.getTime())
        ? parsedDate
        : null;
    }

    if (address !== undefined) {
      doctorProfile.address = address.trim();
    }

    if (bio !== undefined) {
      doctorProfile.bio = bio.trim();
    }

    if (isActiveValue !== undefined) {
      user.isActive = isActiveValue === "true" || isActiveValue === true;
    }

    if (qualificationValue !== undefined) {
      try {
        const parsedQualification =
          typeof qualificationValue === "string"
            ? JSON.parse(qualificationValue)
            : qualificationValue;

        if (Array.isArray(parsedQualification)) {
          doctorProfile.qualification = parsedQualification;
        }
      } catch {}
    }

    if (availableDaysValue !== undefined) {
      try {
        const parsedDays =
          typeof availableDaysValue === "string"
            ? JSON.parse(availableDaysValue)
            : availableDaysValue;

        const allowedDays = [
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
          "sunday",
        ];

        if (Array.isArray(parsedDays)) {
          doctorProfile.availableDays = parsedDays.filter((day) =>
            allowedDays.includes(String(day).toLowerCase())
          );
        }
      } catch {}
    }

    if (workStartTimeValue !== undefined) {
      doctorProfile.workStartTime =
        workStartTimeValue && typeof workStartTimeValue === "string"
          ? workStartTimeValue
          : null;
    }

    if (workEndTimeValue !== undefined) {
      doctorProfile.workEndTime =
        workEndTimeValue && typeof workEndTimeValue === "string"
          ? workEndTimeValue
          : null;
    }

    if (workStartTimeValue !== undefined) {
      doctorProfile.workStartTime =
        workStartTimeValue && typeof workStartTimeValue === "string"
          ? workStartTimeValue
          : null;
    }

    if (workEndTimeValue !== undefined) {
      doctorProfile.workEndTime =
        workEndTimeValue && typeof workEndTimeValue === "string"
          ? workEndTimeValue
          : null;
    }

    if (profilePicFile && profilePicFile.buffer) {
      try {
        if (user.profilePic?.public_id) {
          await deleteFromCloudinary(user.profilePic.public_id, "image");
        }

        const result = await uploadToCloudinary(profilePicFile.buffer, {
          folder: "doctor-appointment/profile-pics",
          resource_type: "image",
        });

        user.profilePic = {
          url: result.url,
          public_id: result.public_id,
        };
      } catch (uploadError) {
        console.error("Cloudinary upload error (updateDoctor):", uploadError);
        return res.status(500).json({
          success: false,
          message: "Failed to upload profile picture",
          error: uploadError.message,
        });
      }
    }

    if (documentFiles.length > 0) {
      try {
        const uploadedDocuments = [];

        for (const file of documentFiles) {
          const ext = file.originalname.split(".").pop();

          const result = await uploadToCloudinary(file.buffer, {
            folder: "doctor-appointment/doctor-documents",
            resource_type: "raw",
            public_id: `${Date.now()}-${file.originalname.replace(/\.[^/.]+$/, "")}`,
            format: ext,
          });
          uploadedDocuments.push({
            name: file.originalname,
            url: result.url,
            public_id: result.public_id,
            type: file.mimetype || "document",
          });
        }

        doctorProfile.documents = [
          ...(doctorProfile.documents || []),
          ...uploadedDocuments,
        ];
      } catch (uploadError) {
        console.error("Cloudinary documents upload error:", uploadError);
        return res.status(500).json({
          success: false,
          message: "Failed to upload doctor documents",
          error: uploadError.message,
        });
      }
    }

    await user.save({ validateBeforeSave: false });
    await doctorProfile.save();

    return res.status(200).json({
      success: true,
      message: "Doctor updated successfully",
      doctor: formatDoctorResponse(user, doctorProfile),
    });
  } catch (error) {
    console.error("Error in updateDoctor:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({ _id: id, role: "doctor" });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    const doctorProfile = await DoctorProfile.findOne({ userId: user._id });

    if (user.profilePic?.public_id) {
      try {
        await deleteFromCloudinary(user.profilePic.public_id);
      } catch (e) {
        console.error("Error deleting doctor profile pic from Cloudinary:", e);
      }
    }

    if (doctorProfile) {
      await doctorProfile.deleteOne();
    }

    await user.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Doctor deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteDoctor:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const formatDoctorResponse = (user, doctorProfile) => {
  return {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    role: user.role,
    isActive: user.isActive !== false,
    profilePic: user.profilePic,
    createdBy: user.createdBy,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    doctorProfile: doctorProfile
      ? {
          _id: doctorProfile._id,
          userId: doctorProfile.userId,
          specialization: doctorProfile.specialization,
          licenseNumber: doctorProfile.licenseNumber,
          experienceYears: doctorProfile.experienceYears,
          consultationFee: doctorProfile.consultationFee,
          gender: doctorProfile.gender,
          dateOfBirth: doctorProfile.dateOfBirth,
          phone: doctorProfile.phone,
          address: doctorProfile.address,
          bio: doctorProfile.bio,
          qualification: doctorProfile.qualification,
          documents: doctorProfile.documents,
          status: doctorProfile.status,
          availableDays: doctorProfile.availableDays,
          createdBy: doctorProfile.createdBy,
          createdAt: doctorProfile.createdAt,
          updatedAt: doctorProfile.updatedAt,
        }
      : null,
  };
};