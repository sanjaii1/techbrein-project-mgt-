/**
 * Custom operational error class.
 * Distinguishes known application errors (e.g. 404, 400)
 * from unexpected programmer errors (e.g. TypeError).
 */
class AppError extends Error {
  /**
   * @param {string} message  - Human-readable error message
   * @param {number} statusCode - HTTP status code to send
   */
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // mark as a trusted, expected error
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
