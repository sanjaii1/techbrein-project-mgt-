/**
 * Global error-handling middleware.
 *
 * Two tiers of errors:
 *  1. Operational (AppError)  → send the actual message + its status code
 *  2. Unexpected / programmer → log full stack, send generic 500
 *
 * Prisma error codes are also translated here so that no raw
 * database error ever leaks to the client.
 */
export const errorHandler = (err, req, res, next) => {
  // ── Prisma: unique-constraint violation (e.g. duplicate email) ──
  if (err.code === "P2002") {
    const field = err.meta?.target?.[0] ?? "field";
    return res.status(409).json({
      success: false,
      message: `A record with this ${field} already exists.`,
    });
  }

  // ── Prisma: record not found (update/delete on non-existent id) ──
  if (err.code === "P2025") {
    return res.status(404).json({
      success: false,
      message: err.meta?.cause ?? "Record not found.",
    });
  }

  // ── Prisma: foreign-key constraint failed ──
  if (err.code === "P2003") {
    return res.status(409).json({
      success: false,
      message:
        "Operation aborted: related records exist. Remove linked records first.",
    });
  }

  // ── Operational errors thrown via `new AppError(msg, status)` ──
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // ── Unknown / programmer errors ──
  console.error("UNHANDLED ERROR at URL:", req.originalUrl);
  console.error(err);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: err.message,
    stack: err.stack,
  });
};