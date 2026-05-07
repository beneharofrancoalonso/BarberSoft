# BarberSoft Backend (Fase 2)

## Requisitos

- Node.js 20+

## Inicio rapido

1. Copiar variables de entorno:

   - Copia `.env.example` a `.env`

2. Instalar dependencias:

   - `npm install`

3. Generar cliente Prisma y migracion inicial:

   - `npm run prisma:generate`
   - `npm run prisma:migrate`

4. Levantar servidor:

   - `npm run dev`

Servidor base:

- `GET /api/v1/health`

Modulos incluidos:

- Auth: `/api/v1/auth`
- Services: `/api/v1/services`
- Appointments: `/api/v1/appointments`
