import { AppointmentStatus } from "@prisma/client";
import express from "express";
import { z } from "zod";
import { prisma } from "../db.js";
import { createAppError, ErrorCodes } from "../errors.js";
import { requireAuth, requireRole } from "../middlewares/auth.js";
import { assertBookingWindow, assertCancellationWindow, isValidTransition } from "../utils/appointments.js";

const router = express.Router();

const createSchema = z.object({
  barberoId: z.number().int().positive(),
  servicioId: z.number().int().positive(),
  fechaInicio: z.string().datetime(),
  notas: z.string().optional(),
});

router.get("/me", requireAuth, requireRole("cliente"), async (req, res, next) => {
  try {
    const rows = await prisma.cita.findMany({
      where: { clienteId: Number(req.user.sub) },
      include: { servicio: true, barbero: { include: { usuario: true } } },
      orderBy: { fechaInicio: "desc" },
    });
    return res.json(rows);
  } catch (err) {
    return next(err);
  }
});

router.get("/barber/me", requireAuth, requireRole("barbero"), async (req, res, next) => {
  try {
    const barber = await prisma.barbero.findUnique({ where: { usuarioId: Number(req.user.sub) } });
    if (!barber) throw createAppError(404, ErrorCodes.RESOURCE_NOT_FOUND, "Barbero no encontrado.");

    const rows = await prisma.cita.findMany({
      where: { barberoId: barber.id },
      include: { cliente: true, servicio: true },
      orderBy: { fechaInicio: "asc" },
    });
    return res.json(rows);
  } catch (err) {
    return next(err);
  }
});

router.get("/barber/week", requireAuth, requireRole("barbero"), async (req, res, next) => {
  try {
    const { start, end } = req.query;
    if (!start || !end) {
      throw createAppError(400, ErrorCodes.VALIDATION_ERROR, "Se requieren parametros start y end.");
    }

    const barber = await prisma.barbero.findUnique({ where: { usuarioId: Number(req.user.sub) } });
    if (!barber) throw createAppError(404, ErrorCodes.RESOURCE_NOT_FOUND, "Barbero no encontrado.");

    const startDate = new Date(start);
    const endDate = new Date(end);

    const rows = await prisma.cita.findMany({
      where: {
        barberoId: barber.id,
        fechaInicio: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: { cliente: true, servicio: true },
      orderBy: { fechaInicio: "asc" },
    });
    return res.json(rows);
  } catch (err) {
    return next(err);
  }
});

router.get("/admin/week", requireAuth, requireRole("admin"), async (req, res, next) => {
  try {
    const { start, end } = req.query;
    if (!start || !end) {
      throw createAppError(400, ErrorCodes.VALIDATION_ERROR, "Se requieren parametros start y end.");
    }

    const startDate = new Date(start);
    const endDate = new Date(end);

    const rows = await prisma.cita.findMany({
      where: {
        fechaInicio: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: { cliente: true, barbero: { include: { usuario: true } }, servicio: true },
      orderBy: { fechaInicio: "asc" },
    });
    return res.json(rows);
  } catch (err) {
    return next(err);
  }
});

router.get("/", requireAuth, requireRole("admin"), async (req, res, next) => {
  try {
    const rows = await prisma.cita.findMany({
      include: { cliente: true, barbero: { include: { usuario: true } }, servicio: true },
      orderBy: { fechaInicio: "asc" },
    });
    return res.json(rows);
  } catch (err) {
    return next(err);
  }
});

router.post("/", requireAuth, requireRole("cliente"), async (req, res, next) => {
  try {
    const data = createSchema.parse(req.body);
    if (!assertBookingWindow(data.fechaInicio)) {
      throw createAppError(400, ErrorCodes.BOOKING_WINDOW_TOO_SHORT, "La reserva requiere 24h de antelacion.");
    }

    const servicio = await prisma.servicio.findUnique({ where: { id: data.servicioId } });
    if (!servicio || !servicio.activo) {
      throw createAppError(404, ErrorCodes.RESOURCE_NOT_FOUND, "Servicio no encontrado o inactivo.");
    }

    const fechaInicio = new Date(data.fechaInicio);
    const fechaFin = new Date(fechaInicio.getTime() + servicio.duracionMin * 60 * 1000);

    const conflict = await prisma.cita.findFirst({
      where: {
        barberoId: data.barberoId,
        estado: { not: AppointmentStatus.cancelada },
        fechaInicio: { lt: fechaFin },
        fechaFin: { gt: fechaInicio },
      },
    });
    if (conflict) {
      throw createAppError(409, ErrorCodes.SLOT_NOT_AVAILABLE, "El horario seleccionado ya esta ocupado.");
    }

    const created = await prisma.cita.create({
      data: {
        clienteId: Number(req.user.sub),
        barberoId: data.barberoId,
        servicioId: data.servicioId,
        fechaInicio,
        fechaFin,
        estado: AppointmentStatus.pendiente,
        notas: data.notas,
      },
    });
    return res.status(201).json(created);
  } catch (err) {
    return next(err);
  }
});

router.patch("/:id/cancel", requireAuth, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const cita = await prisma.cita.findUnique({ where: { id } });
    if (!cita) throw createAppError(404, ErrorCodes.RESOURCE_NOT_FOUND, "Cita no encontrada.");

    const isAdmin = req.user.rol === "admin";
    const isOwner = req.user.rol === "cliente" && Number(req.user.sub) === cita.clienteId;
    if (!isAdmin && !isOwner) {
      throw createAppError(403, ErrorCodes.FORBIDDEN, "No tienes permisos para cancelar esta cita.");
    }

    if (!isAdmin && !assertCancellationWindow(cita.fechaInicio)) {
      throw createAppError(400, ErrorCodes.CANCELLATION_WINDOW_TOO_SHORT, "La cancelacion requiere 24h de antelacion.");
    }

    const updated = await prisma.cita.update({
      where: { id },
      data: { estado: AppointmentStatus.cancelada },
    });
    return res.json(updated);
  } catch (err) {
    return next(err);
  }
});

router.patch("/:id/status", requireAuth, requireRole("barbero", "admin"), async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const body = z.object({ estado: z.nativeEnum(AppointmentStatus) }).parse(req.body);

    const cita = await prisma.cita.findUnique({ where: { id }, include: { barbero: true } });
    if (!cita) throw createAppError(404, ErrorCodes.RESOURCE_NOT_FOUND, "Cita no encontrada.");

    if (req.user.rol === "barbero") {
      const barber = await prisma.barbero.findUnique({ where: { usuarioId: Number(req.user.sub) } });
      if (!barber || barber.id !== cita.barberoId) {
        throw createAppError(403, ErrorCodes.FORBIDDEN, "No puedes modificar citas de otro barbero.");
      }
    }

    if (!isValidTransition(cita.estado, body.estado)) {
      throw createAppError(400, ErrorCodes.INVALID_STATUS_TRANSITION, "Transicion de estado no permitida.");
    }

    if (body.estado === AppointmentStatus.cancelada && req.user.rol === "cliente" && !assertCancellationWindow(cita.fechaInicio)) {
      throw createAppError(400, ErrorCodes.CANCELLATION_WINDOW_TOO_SHORT, "La cancelacion requiere 24h de antelacion.");
    }

    const updated = await prisma.cita.update({
      where: { id },
      data: { estado: body.estado },
    });
    return res.json(updated);
  } catch (err) {
    return next(err);
  }
});

router.delete("/:id", requireAuth, requireRole("admin"), async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    await prisma.cita.delete({ where: { id } });
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
});

export default router;
