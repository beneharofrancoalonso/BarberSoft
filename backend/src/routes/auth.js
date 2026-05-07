import bcrypt from "bcryptjs";
import express from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { config } from "../config.js";
import { prisma } from "../db.js";

const router = express.Router();

const registerSchema = z.object({
  nombre: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

router.post("/register", async (req, res, next) => {
  try {
    const data = registerSchema.parse(req.body);
    const exists = await prisma.usuario.findUnique({ where: { email: data.email } });
    if (exists) {
      return res.status(409).json({
        code: "EMAIL_ALREADY_IN_USE",
        message: "El email ya esta registrado.",
      });
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    const user = await prisma.usuario.create({
      data: {
        nombre: data.nombre,
        email: data.email,
        passwordHash,
        rol: "cliente",
      },
      select: { id: true, nombre: true, email: true, rol: true },
    });

    return res.status(201).json({ user });
  } catch (err) {
    return next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const data = loginSchema.parse(req.body);
    const user = await prisma.usuario.findUnique({ where: { email: data.email } });
    if (!user) {
      return res.status(401).json({ code: "INVALID_CREDENTIALS", message: "Credenciales invalidas." });
    }

    const ok = await bcrypt.compare(data.password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ code: "INVALID_CREDENTIALS", message: "Credenciales invalidas." });
    }

    const token = jwt.sign({ sub: user.id, rol: user.rol, email: user.email }, config.jwtSecret, {
      expiresIn: "12h",
    });

    return res.json({
      token,
      user: { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol },
    });
  } catch (err) {
    return next(err);
  }
});

export default router;
