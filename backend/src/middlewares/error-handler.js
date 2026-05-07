import { ErrorCodes } from "../errors.js";

export function errorHandler(err, req, res, next) {
  if (err?.status && err?.code && err?.message) {
    return res.status(err.status).json({ code: err.code, message: err.message });
  }

  if (err?.name === "ZodError") {
    return res.status(400).json({
      code: ErrorCodes.VALIDATION_ERROR,
      message: "Datos de entrada invalidos.",
      details: err.issues,
    });
  }

  console.error(err);
  return res.status(500).json({
    code: "INTERNAL_SERVER_ERROR",
    message: "Error interno del servidor.",
  });
}
