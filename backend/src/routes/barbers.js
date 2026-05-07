import express from "express";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "../db.js";
import { requireAuth, requireRole } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const rows = await prisma.barbero.findMany({
      include: {
        usuario: {
          select: { id: true, nombre: true, email: true },
        },
      },
      orderBy: { id: "asc" },
    });
    return res.json(rows);
  } catch (err) {
    return next(err);
  }
});

router.post("/", requireAuth, requireRole("admin"), async (req, res, next) => {
  try {
    const schema = z.object({
      nombre: z.string().min(2),
      email: z.string().email(),
      password: z.string().min(6),
    });
    const data = schema.parse(req.body);

    const exists = await prisma.usuario.findUnique({ where: { email: data.email } });
    if (exists) {
      return res.status(409).json({ message: "El email ya está registrado." });
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const usuario = await prisma.usuario.create({
      data: {
        nombre: data.nombre,
        email: data.email,
        passwordHash,
        rol: "barbero",
      },
    });

    const barbero = await prisma.barbero.create({
      data: { usuarioId: usuario.id },
      include: { usuario: { select: { id: true, nombre: true, email: true } } },
    });

    return res.status(201).json(barbero);
  } catch (err) {
    return next(err);
  }
});

router.delete("/:id", requireAuth, requireRole("admin"), async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const barbero = await prisma.barbero.findUnique({ where: { id } });
    if (!barbero) {
      return res.status(404).json({ message: "Barbero no encontrado." });
    }

    await prisma.barbero.delete({ where: { id } });
    await prisma.usuario.delete({ where: { id: barbero.usuarioId } });

    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
});

router.get("/clients", requireAuth, requireRole("admin"), async (req, res, next) => {
  try {
    const rows = await prisma.usuario.findMany({
      where: { rol: "cliente" },
      select: { id: true, nombre: true, email: true },
      orderBy: { nombre: "asc" },
    });
    return res.json(rows);
  } catch (err) {
    return next(err);
  }
});

router.delete("/client/:id", requireAuth, requireRole("admin"), async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const usuario = await prisma.usuario.findUnique({ where: { id } });
    if (!usuario || usuario.rol !== "cliente") {
      return res.status(404).json({ message: "Cliente no encontrado." });
    }

    await prisma.cita.deleteMany({ where: { clienteId: id } });
    await prisma.usuario.delete({ where: { id } });

    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
});

export default router;
