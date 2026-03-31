import multer from "multer";

/**
 * 404 - route not found
 */
export const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Not found - ${req.originalUrl}`,
  });
};

/**
 * Global error handler - handles app errors and Multer errors
 */
export const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || "Internal server error";

  // Multer errors
  if (err instanceof multer.MulterError) {
    statusCode = 400;
    switch (err.code) {
      case "LIMIT_FILE_SIZE":
        message = "File too large. Maximum size is 2MB.";
        break;
      case "LIMIT_FILE_COUNT":
        message = "Too many files.";
        break;
      case "LIMIT_UNEXPECTED_FILE":
        message = "Unexpected field name for file upload.";
        break;
      default:
        message = err.message;
    }
  }

  // Multer fileFilter passed an Error (e.g. invalid file type)
  if (err.message && err.message.includes("Only image files")) {
    statusCode = 400;
  }

  // JWT errors (if they slip through)
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token.";
  }
  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired.";
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      ?.map((e) => e.message)
      .join(", ") || message;
  }

  // Mongoose duplicate key (e.g. duplicate email)
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyPattern || {})[0] || "field";
    message = `Duplicate value for ${field}.`;
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
