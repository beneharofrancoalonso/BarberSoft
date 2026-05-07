import express from "express";
import { z } from "zod";
import { prisma } from "../db.js";
import { requireAuth, requireRole } from "../middlewares/auth.js";

const router = express.Router();

const schema = z.object({
  nombre: z.string().min(2),
  descripcion: z.string().optional(),
  duracionMin: z.number().int().positive(),
  precioReferencia: z.number().nonnegative(),
});

router.get("/", async (req, res, next) => {
  try {
    const rows = await prisma.servicio.findMany({
      where: { activo: true },
      orderBy: { nombre: "asc" },
    });
    return res.json(rows);
  } catch (err) {
    return next(err);
  }
});

router.post("/", requireAuth, requireRole("admin"), async (req, res, next) => {
  try {
    const data = schema.parse(req.body);
    const created = await prisma.servicio.create({ data });
    return res.status(201).json(created);
  } catch (err) {
    return next(err);
  }
});

router.put("/:id", requireAuth, requireRole("admin"), async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const data = schema.parse(req.body);
    const updated = await prisma.servicio.update({ where: { id }, data });
    return res.json(updated);
  } catch (err) {
    return next(err);
  }
});

router.patch("/:id/status", requireAuth, requireRole("admin"), async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const body = z.object({ activo: z.boolean() }).parse(req.body);
    const updated = await prisma.servicio.update({
      where: { id },
      data: { activo: body.activo },
    });
    return res.json(updated);
  } catch (err) {
    return next(err);
  }
});

router.delete("/:id", requireAuth, requireRole("admin"), async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    await prisma.servicio.delete({ where: { id } });
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
});

export default router;
