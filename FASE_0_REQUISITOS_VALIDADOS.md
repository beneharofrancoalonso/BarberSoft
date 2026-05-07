# BarberSoft - Fase 0 (Requisitos validados)

Fecha: 2026-05-04

## Decisiones cerradas en Fase 0

- No puede haber solapamiento de citas para un mismo barbero.
- La antelacion minima para reservar cita es de 24 horas.
- La cancelacion de citas requiere una antelacion minima de 24 horas.
- Estados de cita aprobados:
  - `pendiente`
  - `confirmada`
  - `completada`
  - `cancelada`
- El modulo de pagos queda fuera del alcance actual (no se implementa en esta fase del proyecto).

## Reglas funcionales derivadas

1. El sistema debe bloquear automaticamente la creacion de citas en franjas ya ocupadas por el mismo barbero.
2. El sistema debe impedir reservas con menos de 24 horas respecto a la fecha/hora actual.
3. El sistema debe impedir cancelaciones con menos de 24 horas respecto a la fecha/hora de la cita.
4. El estado inicial recomendado para una nueva cita es `pendiente`.
5. Solo se permite transicion de estados validas:
   - `pendiente -> confirmada`
   - `pendiente -> cancelada`
   - `confirmada -> completada`
   - `confirmada -> cancelada` (si cumple ventana de 24h)

## Fuera de alcance por ahora

- Integracion de pasarela de pago.
- Gestion de cobros y reembolsos.
- Reportes financieros.

## Implicaciones para la Fase 1 (Diseno)

- Casos de uso: incluir validaciones de antelacion y no solapamiento.
- Modelo ER: no incluir tablas de pago en el MVP actual.
- API: definir errores funcionales para:
  - `SLOT_NOT_AVAILABLE`
  - `BOOKING_WINDOW_TOO_SHORT`
  - `CANCELLATION_WINDOW_TOO_SHORT`
- UI React: mostrar mensajes claros cuando una regla de negocio no permita reservar/cancelar.
