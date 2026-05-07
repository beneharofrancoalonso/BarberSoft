import jwt from "jsonwebtoken";
import { config } from "../config.js";
import { ErrorCodes } from "../errors.js";

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({
      code: ErrorCodes.UNAUTHORIZED,
      message: "Token requerido.",
    });
  }

  try {
    req.user = jwt.verify(token, config.jwtSecret);
    return next();
  } catch {
    return res.status(401).json({
      code: ErrorCodes.UNAUTHORIZED,
      message: "Token invalido o expirado.",
    });
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.rol)) {
      return res.status(403).json({
        code: ErrorCodes.FORBIDDEN,
        message: "No tienes permisos para esta operacion.",
      });
    }
    return next();
  };
}
