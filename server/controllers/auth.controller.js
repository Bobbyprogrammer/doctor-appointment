import bcrypt from "bcryptjs";
import {User} from "../models/User.js";
import {DoctorProfile} from "../models/DoctorProfile.js";
import { generateToken } from "../utils/generateToken.js";
import { uploadToCloudinary } from "../config/cloudinary.js";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    let profilePic = {
      url: "",
      public_id: "",
    };

    if (req.file && req.file.buffer) {
      try {
        const result = await uploadToCloudinary(req.file.buffer, {
          folder: "doctor-appointment/profile-pics",
        });
        profilePic = { url: result.url, public_id: result.public_id };
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        return res.status(500).json({
          success: false,
          message: "Failed to upload profile picture",
          error: uploadError.message,
        });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      role: "patient",
      profilePic,
    });

    const token = generateToken({
      id: user._id.toString(),
      role: user.role,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    });

    return res.status(201).cookie("token", token, cookieOptions).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profilePic: user.profilePic,
      },
    });
  } catch (error) {
    console.error("Error in registerUser:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};



export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account is deactivated",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (user.role === "doctor") {
      const doctorProfile = await DoctorProfile.findOne({ userId: user._id });

      if (!doctorProfile) {
        return res.status(404).json({
          success: false,
          message: "Doctor profile not found",
        });
      }

      if (doctorProfile.status !== "approved") {
        return res.status(403).json({
          success: false,
          message: `Doctor account is ${doctorProfile.status}`,
        });
      }
    }

    const token = generateToken({
      id: user._id.toString(),
      role: user.role,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    });

    user.lastLoginAt = new Date();
    await user.save({ validateBeforeSave: false });

    return res.status(200).cookie("token", token, cookieOptions).json({
      success: true,
      message: "Logged in successfully",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profilePic: user.profilePic,
        lastLoginAt: user.lastLoginAt,
      },
    });
  } catch (error) {
    console.error("Error in loginUser:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const logoutUser = (req, res) => {
  res
    .cookie("token", "", {
      ...cookieOptions,
      maxAge: 0,
      expires: new Date(0),
    })
    .status(200)
    .json({ success: true, message: "Logged out successfully" });
};

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      return res.status(500).json({
        success: false,
        message: "Admin credentials not configured",
      });
    }

    if (email !== adminEmail || password !== adminPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials",
      });
    }

    const user = await User.findOne({ email: adminEmail });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Admin user not found in database",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Admin account is deactivated",
      });
    }

    const token = generateToken({
      id: user._id.toString(),
      role: user.role,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    });

    user.lastLoginAt = new Date();
    await user.save({ validateBeforeSave: false });

    return res.status(200).cookie("token", token, cookieOptions).json({
      success: true,
      message: "Admin logged in successfully",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profilePic: user.profilePic,
        lastLoginAt: user.lastLoginAt,
      },
    });
  } catch (error) {
    console.error("Error in adminLogin:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const getUser=async(req,res)=>{
  try {
    const user=req.user;
    return res.json({user,success:true})
    
  } catch (error) {
    console.log("error to get authenticated User");
    return res.json({message:"internal server error"})
    
    
  }
}