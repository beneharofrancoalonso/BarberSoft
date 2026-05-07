import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function upsertServicio(data) {
  const existing = await prisma.servicio.findFirst({
    where: { nombre: data.nombre },
  });

  if (existing) {
    return prisma.servicio.update({
      where: { id: existing.id },
      data,
    });
  }

  return prisma.servicio.create({ data });
}

async function main() {
  const passwordHash = await bcrypt.hash("123456", 10);

  const adminUser = await prisma.usuario.upsert({
    where: { email: "admin@barbersoft.local" },
    update: { nombre: "Admin BarberSoft", rol: "admin", passwordHash, activo: true },
    create: {
      nombre: "Admin BarberSoft",
      email: "admin@barbersoft.local",
      rol: "admin",
      passwordHash,
      activo: true,
    },
  });

  const barberUser = await prisma.usuario.upsert({
    where: { email: "barbero1@barbersoft.local" },
    update: { nombre: "Barbero Uno", rol: "barbero", passwordHash, activo: true },
    create: {
      nombre: "Barbero Uno",
      email: "barbero1@barbersoft.local",
      rol: "barbero",
      passwordHash,
      activo: true,
    },
  });

  await prisma.barbero.upsert({
    where: { usuarioId: barberUser.id },
    update: { especialidad: "Cortes clasicos y modernos" },
    create: {
      usuarioId: barberUser.id,
      especialidad: "Cortes clasicos y modernos",
    },
  });

  await upsertServicio({
    nombre: "Corte clasico",
    descripcion: "Corte tradicional con acabado limpio.",
    duracionMin: 30,
    precioReferencia: 12,
    activo: true,
  });

  await upsertServicio({
    nombre: "Corte + barba",
    descripcion: "Perfilado completo de cabello y barba.",
    duracionMin: 45,
    precioReferencia: 18,
    activo: true,
  });

  await upsertServicio({
    nombre: "Arreglo de barba",
    descripcion: "Diseño y perfilado de barba.",
    duracionMin: 20,
    precioReferencia: 9,
    activo: true,
  });

  console.log("Seed completado.");
  console.log("Admin:", adminUser.email, "password: 123456");
  console.log("Barbero:", barberUser.email, "password: 123456");
}

main()
  .catch((err) => {
    console.error("Error ejecutando seed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
