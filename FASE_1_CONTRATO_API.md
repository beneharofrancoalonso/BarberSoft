# BarberSoft - Fase 1 (Contrato API inicial)

Fecha: 2026-05-04
Estilo: REST JSON

## 1) Convenciones

- Base URL: `/api/v1`
- Auth: `Authorization: Bearer <token>`
- Respuestas de error:
  - `code` (maquina)
  - `message` (humano)

Ejemplo:

```json
{
  "code": "SLOT_NOT_AVAILABLE",
  "message": "El horario seleccionado ya no esta disponible."
}
```

## 2) Endpoints de autenticacion

### `POST /auth/login`

- Entrada: `email`, `password`
- Salida: `token`, `user`

### `POST /auth/register` (opcional por estrategia)

- Entrada: `nombre`, `email`, `password`
- Salida: `user`

## 3) Endpoints de servicios

### `GET /services`

- Publico (o autenticado, segun decision final)
- Lista de servicios activos

### `POST /services` (admin)

- Crea servicio

### `PUT /services/:id` (admin)

- Edita servicio

### `PATCH /services/:id/status` (admin)

- Activa/desactiva servicio

## 4) Endpoints de barberos y horarios

### `GET /barbers`

- Lista de barberos activos

### `POST /barbers` (admin)

- Crear perfil de barbero

### `PUT /barbers/:id` (admin)

- Actualizar perfil

### `GET /barbers/:id/schedule`

- Ver horario base de barbero

### `PUT /barbers/:id/schedule` (admin)

- Actualizar horario base

## 5) Endpoints de citas

### `GET /appointments/me` (cliente)

- Historial de citas del cliente autenticado

### `GET /appointments/barber/me` (barbero)

- Agenda del barbero autenticado (filtros por fecha/estado)

### `GET /appointments` (admin)

- Agenda global (filtros por fecha/barbero/estado)

### `POST /appointments` (cliente)

- Crear reserva
- Entrada:
  - `barbero_id`
  - `servicio_id`
  - `fecha_inicio`
- Validaciones:
  - `BOOKING_WINDOW_TOO_SHORT` (si <24h)
  - `SLOT_NOT_AVAILABLE` (si solapa)

### `PATCH /appointments/:id/cancel` (cliente/admin)

- Cancela cita
- Validaciones:
  - `CANCELLATION_WINDOW_TOO_SHORT` (si <24h para cliente)

### `PATCH /appointments/:id/status` (barbero/admin)

- Cambia estado (`pendiente`, `confirmada`, `completada`, `cancelada`)
- Validacion de transicion:
  - `INVALID_STATUS_TRANSITION`

## 6) Codigos de error de negocio

- `SLOT_NOT_AVAILABLE`
- `BOOKING_WINDOW_TOO_SHORT`
- `CANCELLATION_WINDOW_TOO_SHORT`
- `INVALID_STATUS_TRANSITION`
- `RESOURCE_NOT_FOUND`
- `UNAUTHORIZED`
- `FORBIDDEN`

## 7) Criterio de cierre de Fase 1

- API definida para cubrir MVP sin pagos.
- Reglas de negocio criticas reflejadas en validaciones de endpoints.
- Listo para implementacion en Fase 2 (backend).
