# BarberSoft - Fase 2 (Implementacion backend)

Fecha: 2026-05-04

## Entregables implementados

- Estructura base de backend en `backend/`.
- API Express con prefijo `/api/v1`.
- Prisma configurado con modelo relacional MVP (sin pagos).
- Rutas iniciales implementadas:
  - `auth`: login y registro cliente.
  - `services`: listado y CRUD admin.
  - `appointments`: reserva, cancelacion, agenda por rol y cambio de estado.
- Middlewares de autenticacion JWT y autorizacion por rol.
- Validaciones de negocio en backend:
  - No solapamiento de citas por barbero.
  - Reserva con minimo 24h de antelacion.
  - Cancelacion con minimo 24h de antelacion.
  - Transiciones de estado permitidas.

## Archivos clave

- `backend/prisma/schema.prisma`
- `backend/src/app.js`
- `backend/src/server.js`
- `backend/src/routes/auth.js`
- `backend/src/routes/services.js`
- `backend/src/routes/appointments.js`
- `backend/src/middlewares/auth.js`
- `backend/src/middlewares/error-handler.js`

## Nota operativa

Durante la instalacion de dependencias en este entorno hubo errores de sistema de archivos (`EBADF`/`TAR_ENTRY_ERROR`) y no se pudo completar `npm install` automaticamente.  
El codigo queda listo para ejecutar en cuanto el entorno permita instalar paquetes.
