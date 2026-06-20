/**
 * Centralized error handling middleware.
 * Catches all errors thrown in controllers/services and sends a clean JSON response.
 */
const errorHandler = (err, req, res, next) => {
  // Log the error for server-side debugging
  console.error(`[ERROR] ${err.message}`);
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      messages,
    });
  }

  // Mongoose bad ObjectId (invalid ID format)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    return res.status(400).json({
      success: false,
      error: 'Invalid ID format',
    });
  }

  // Custom errors with statusCode
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: err.message || 'Internal Server Error',
  });
};

module.exports = errorHandler;
