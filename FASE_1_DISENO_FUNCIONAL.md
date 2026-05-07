# BarberSoft - Fase 1 (Diseno funcional)

Fecha: 2026-05-04

## 1) Objetivo funcional

Disenar un sistema web para gestionar reservas de barberia con tres roles:

- Cliente
- Barbero
- Admin

El sistema debe cumplir las reglas cerradas en Fase 0:

- Sin solapamiento de citas por barbero.
- Reserva con antelacion minima de 24 horas.
- Cancelacion con antelacion minima de 24 horas.
- Sin pagos en el MVP actual.

## 2) Modulos del sistema

### 2.1 Autenticacion y autorizacion

- Registro/inicio de sesion (segun estrategia del proyecto).
- Control de acceso por rol.
- Sesion segura (JWT recomendado para API REST).

### 2.2 Gestion de servicios (Admin)

- Crear, editar, activar/desactivar servicios.
- Cada servicio define:
  - nombre
  - descripcion
  - duracion_min
  - precio_referencia (informativo, sin cobro online)

### 2.3 Gestion de empleados/barberos (Admin)

- Alta/baja logica de barberos.
- Asignacion de horario laboral.
- Activacion/desactivacion de disponibilidad.

### 2.4 Agenda (Barbero/Admin)

- Vista diaria/semanal de citas.
- Cambio de estado de cita.
- Filtros por fecha/estado/cliente.

### 2.5 Reserva de citas (Cliente)

- Consultar catalogo de servicios.
- Seleccionar barbero, fecha y hora disponible.
- Confirmar reserva.
- Consultar historial propio.
- Cancelar cita (si cumple regla de 24h).

## 3) Casos de uso principales

1. Cliente reserva cita.
2. Cliente consulta historial de citas.
3. Cliente cancela cita (con validacion 24h).
4. Barbero visualiza agenda del dia.
5. Barbero confirma/completa cita.
6. Admin gestiona servicios.
7. Admin gestiona barberos y sus horarios.
8. Admin consulta agenda global.

## 4) Reglas de negocio

1. Una cita no puede solapar a otra del mismo barbero.
2. Una reserva solo se permite si faltan al menos 24 horas.
3. Una cancelacion solo se permite si faltan al menos 24 horas.
4. Estados permitidos: `pendiente`, `confirmada`, `completada`, `cancelada`.
5. Transiciones permitidas:
   - `pendiente -> confirmada`
   - `pendiente -> cancelada`
   - `confirmada -> completada`
   - `confirmada -> cancelada` (si cumple ventana 24h)

## 5) Pantallas minimas (React)

### Publicas

- Login
- Registro (si se habilita autorregistro)

### Cliente

- Catalogo de servicios
- Flujo de reserva
- Mis citas / historial

### Barbero

- Agenda del dia/semana
- Detalle de cita

### Admin

- Dashboard basico
- CRUD servicios
- CRUD barberos
- Agenda global

## 6) Criterios de aceptacion de Fase 1

- Diseno funcional documentado.
- Casos de uso y reglas de negocio sin ambiguedad.
- Pantallas objetivo definidas por rol.
- Base para modelado ER y API REST lista para Fase 2.
