import {User} from "../models/User.js";
import bcrypt from "bcryptjs";
import { uploadToCloudinary,deleteFromCloudinary } from "../config/cloudinary.js";

export const getPatients=async(req,res)=>{
     try {
       const patients=await User.find({role:"patient"})
   
       return res.json({
         success:true,
         patients
       })
       
     } catch (error) {
       console.log("error to fetch patients");
       return res.json({message:"Internal server error"})
       
       
     }
   }



export const updatePatient = async (req, res) => {
  try {
    const id = req.user._id;
    const { firstName, lastName, email, password, phone } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    if (user.role !== "patient") {
      return res.status(400).json({
        success: false,
        message: "Selected user is not a patient",
      });
    }

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "User already exists with this email",
        });
      }
    }

    let updatedProfilePic = user.profilePic;

    if (req.file && req.file.buffer) {
      try {
        if (user.profilePic?.public_id) {
          await deleteFromCloudinary(user.profilePic.public_id);
        }

        const result = await uploadToCloudinary(req.file.buffer, {
          folder: "doctor-appointment/profile-pics",
        });

        updatedProfilePic = {
          url: result.url,
          public_id: result.public_id,
        };
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        return res.status(500).json({
          success: false,
          message: "Failed to upload profile picture",
          error: uploadError.message,
        });
      }
    }

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.profilePic = updatedProfilePic;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Patient updated successfully",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profilePic: user.profilePic,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error in updatePatient:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};




export const deletePatient = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    if (user.role !== "patient") {
      return res.status(400).json({
        success: false,
        message: "Selected user is not a patient",
      });
    }

    if (user.profilePic?.public_id) {
      try {
        await deleteFromCloudinary(user.profilePic.public_id);
      } catch (cloudinaryError) {
        console.error("Cloudinary delete error:", cloudinaryError);
      }
    }

    await User.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Patient deleted successfully",
    });
  } catch (error) {
    console.error("Error in deletePatient:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};