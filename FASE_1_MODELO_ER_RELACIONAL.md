# BarberSoft - Fase 1 (Modelo ER/Relacional)

Fecha: 2026-05-04

## 1) Entidades principales

### `usuarios`

- id (PK)
- nombre
- email (UNIQUE)
- password_hash
- rol (`cliente`, `barbero`, `admin`)
- activo
- created_at
- updated_at

### `servicios`

- id (PK)
- nombre
- descripcion
- duracion_min
- precio_referencia
- activo
- created_at
- updated_at

### `barberos`

- id (PK)
- usuario_id (FK -> usuarios.id, UNIQUE)
- especialidad
- created_at
- updated_at

### `horarios_barbero`

- id (PK)
- barbero_id (FK -> barberos.id)
- dia_semana (0-6)
- hora_inicio
- hora_fin
- activo
- created_at
- updated_at

### `citas`

- id (PK)
- cliente_id (FK -> usuarios.id)
- barbero_id (FK -> barberos.id)
- servicio_id (FK -> servicios.id)
- fecha_inicio (datetime)
- fecha_fin (datetime)
- estado (`pendiente`, `confirmada`, `completada`, `cancelada`)
- notas
- created_at
- updated_at

## 2) Relaciones

- Un `usuario` puede ser:
  - cliente (reserva citas)
  - barbero (1:1 con `barberos`)
  - admin
- Un `barbero` tiene muchos `horarios_barbero`.
- Un `barbero` tiene muchas `citas`.
- Un `cliente` (usuario) tiene muchas `citas`.
- Un `servicio` puede estar en muchas `citas`.

## 3) Restricciones clave

1. `usuarios.email` unico.
2. `barberos.usuario_id` unico (un usuario barbero solo tiene un perfil barbero).
3. `citas.fecha_fin > citas.fecha_inicio`.
4. No solapamiento de citas por barbero:
   - Restriccion logica en backend antes de insertar/actualizar.
5. Reserva con antelacion minima 24h:
   - Validacion de negocio en backend.
6. Cancelacion con antelacion minima 24h:
   - Validacion de negocio en backend.

## 4) Regla de no solapamiento (logica)

Para crear una cita nueva, rechazar si existe una cita no cancelada del mismo barbero donde:

- `nueva.fecha_inicio < existente.fecha_fin`
- y `nueva.fecha_fin > existente.fecha_inicio`

## 5) Diagrama relacional (texto)

- `usuarios (1) ---- (0..1) barberos`
- `barberos (1) ---- (N) horarios_barbero`
- `usuarios(cliente) (1) ---- (N) citas`
- `barberos (1) ---- (N) citas`
- `servicios (1) ---- (N) citas`

## 6) Nota de alcance

El modulo de pagos no se incluye en el modelo del MVP actual.
