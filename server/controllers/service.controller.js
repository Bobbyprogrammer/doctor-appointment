import { Service } from "../models/Service.js";
import { generateSlug } from "../utils/generateSlug.js";

export const createService = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      price,
      discountedPrice,
      durationMinutes,
      doctorType,
      minAge,
      maxAge,
      allowForChild,
      allowForSomeoneElse,
    } = req.body;

    if (!name || price === undefined || price === null) {
      return res.status(400).json({
        success: false,
        message: "Please provide name and price",
      });
    }

    const slug = generateSlug(name);

    const existing = await Service.findOne({
      slug: slug.toLowerCase().trim(),
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "A service with this name already exists",
      });
    }

    const parsedPrice = Number(price);
    const parsedDiscountedPrice =
      discountedPrice !== undefined &&
      discountedPrice !== null &&
      discountedPrice !== ""
        ? Number(discountedPrice)
        : null;

    if (isNaN(parsedPrice) || parsedPrice < 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be a valid positive number",
      });
    }

    if (
      parsedDiscountedPrice !== null &&
      (isNaN(parsedDiscountedPrice) || parsedDiscountedPrice < 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "Discounted price must be a valid positive number",
      });
    }

    if (
      parsedDiscountedPrice !== null &&
      parsedDiscountedPrice > parsedPrice
    ) {
      return res.status(400).json({
        success: false,
        message: "Discounted price cannot be greater than actual price",
      });
    }

    const service = await Service.create({
      name: name.trim(),
      slug,
      description: description?.trim() || "",
      category: category?.trim() || "general",
      price: parsedPrice,
      discountedPrice: parsedDiscountedPrice,
      durationMinutes:
        durationMinutes !== undefined &&
        durationMinutes !== null &&
        durationMinutes !== ""
          ? Number(durationMinutes)
          : 15,
      doctorType: doctorType?.trim() || "gp",
      minAge:
        minAge !== undefined && minAge !== null && minAge !== ""
          ? Number(minAge)
          : null,
      maxAge:
        maxAge !== undefined && maxAge !== null && maxAge !== ""
          ? Number(maxAge)
          : null,
      allowForChild:
        allowForChild !== undefined
          ? allowForChild === true || allowForChild === "true"
          : true,
      allowForSomeoneElse:
        allowForSomeoneElse !== undefined
          ? allowForSomeoneElse === true || allowForSomeoneElse === "true"
          : false,
      createdBy: req.user?._id || null,
    });

    return res.status(201).json({
      success: true,
      message: "Service created successfully",
      service,
    });
  } catch (error) {
    console.error("Error in createService:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const getServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: services.length,
      services,
    });
  } catch (error) {
    console.error("Error in getServices:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findById(id);
    if (!service || !service.isActive) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }
    return res.status(200).json({
      success: true,
      service,
    });
  } catch (error) {
    console.error("Error in getServiceById:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    // If name changes, regenerate slug automatically
    if (updates.name && updates.name.trim() !== service.name) {
      const newSlug = generateSlug(updates.name);

      const existing = await Service.findOne({
        slug: newSlug,
        _id: { $ne: id },
      });

      if (existing) {
        return res.status(400).json({
          success: false,
          message: "Another service with this name already exists",
        });
      }

      service.name = updates.name.trim();
      service.slug = newSlug;
    }

    if (updates.description !== undefined) {
      service.description = updates.description?.trim() || "";
    }

    if (updates.category !== undefined) {
      service.category = updates.category?.trim() || "general";
    }

    if (updates.doctorType !== undefined) {
      service.doctorType = updates.doctorType?.trim() || "gp";
    }

    if (updates.price !== undefined) {
      const parsedPrice = Number(updates.price);

      if (isNaN(parsedPrice) || parsedPrice < 0) {
        return res.status(400).json({
          success: false,
          message: "Price must be a valid positive number",
        });
      }

      service.price = parsedPrice;
    }

    if (updates.discountedPrice !== undefined) {
      const parsedDiscountedPrice =
        updates.discountedPrice !== null && updates.discountedPrice !== ""
          ? Number(updates.discountedPrice)
          : null;

      if (
        parsedDiscountedPrice !== null &&
        (isNaN(parsedDiscountedPrice) || parsedDiscountedPrice < 0)
      ) {
        return res.status(400).json({
          success: false,
          message: "Discounted price must be a valid positive number",
        });
      }

      service.discountedPrice = parsedDiscountedPrice;
    }

    if (
      service.discountedPrice !== null &&
      service.discountedPrice > service.price
    ) {
      return res.status(400).json({
        success: false,
        message: "Discounted price cannot be greater than actual price",
      });
    }

    if (updates.durationMinutes !== undefined) {
      service.durationMinutes =
        updates.durationMinutes !== null && updates.durationMinutes !== ""
          ? Number(updates.durationMinutes)
          : 15;
    }

    if (updates.minAge !== undefined) {
      service.minAge =
        updates.minAge !== null && updates.minAge !== ""
          ? Number(updates.minAge)
          : null;
    }

    if (updates.maxAge !== undefined) {
      service.maxAge =
        updates.maxAge !== null && updates.maxAge !== ""
          ? Number(updates.maxAge)
          : null;
    }

    if (updates.allowForChild !== undefined) {
      service.allowForChild =
        updates.allowForChild === true || updates.allowForChild === "true";
    }

    if (updates.allowForSomeoneElse !== undefined) {
      service.allowForSomeoneElse =
        updates.allowForSomeoneElse === true ||
        updates.allowForSomeoneElse === "true";
    }

    if (updates.isActive !== undefined) {
      service.isActive =
        updates.isActive === true || updates.isActive === "true";
    }

    service.updatedBy = req.user?._id || null;

    await service.save();

    return res.status(200).json({
      success: true,
      message: "Service updated successfully",
      service,
    });
  } catch (error) {
    console.error("Error in updateService:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    await service.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Service deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteService:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

