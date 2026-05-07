# BarberSoft - Fase 4 (Frontend React)

Fecha: 2026-05-04

## Entregables implementados

- Aplicacion frontend en `frontend/` creada con React + Vite.
- Integracion API con backend (`http://localhost:3001/api/v1`) usando `axios`.
- Estructura refactorizada con rutas y componentes separados para facilitar evaluacion academica.
- Flujo de autenticacion implementado:
  - Registro de cliente.
  - Login con persistencia de sesion en `localStorage`.
  - Logout.
- Vistas funcionales por rol:
  - **Publico**: servicios activos y listado de barberos.
  - **Cliente**: reserva de cita, listado de mis citas, cancelacion.
  - **Barbero**: agenda propia y cambio de estado de cita.
  - **Admin**: agenda global y creacion de servicios.

## Estructura frontend destacada

- `frontend/src/App.jsx`: orquestacion de estado global y enrutado.
- `frontend/src/lib/api.js`: cliente HTTP centralizado.
- `frontend/src/components/Layout.jsx`: layout comun y navegacion.
- `frontend/src/components/ServicesList.jsx`: catalogo reutilizable.
- `frontend/src/pages/AuthPage.jsx`: login y registro.
- `frontend/src/pages/ClientePage.jsx`: reserva y mis citas.
- `frontend/src/pages/BarberoPage.jsx`: agenda y estados.
- `frontend/src/pages/AdminPage.jsx`: gestion admin.

## Ajuste backend para integracion frontend

- Se agrega endpoint `GET /api/v1/barbers`:
  - Archivo: `backend/src/routes/barbers.js`
  - Registro en app: `backend/src/app.js`

Esto permite al cliente seleccionar barbero por nombre al crear una reserva.

## Validacion tecnica

- Backend tests ejecutados correctamente (`npm test` en `backend`).
- Frontend compilado correctamente (`npm run build` en `frontend`).

## Ejecucion local recomendada

1. Backend:
   - En `backend`: `npm run dev`
2. Frontend:
   - En `frontend`: `npm run dev`
3. Abrir la URL de Vite (normalmente `http://localhost:5173`).

## Criterio de cierre de Fase 4

- Frontend React conectado al backend y con flujos principales operativos por rol.
- Base lista para evolucionar a UX final, componentes reutilizables y pruebas de frontend.
