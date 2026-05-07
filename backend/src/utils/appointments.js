import { AppointmentStatus } from "@prisma/client";

export function assertBookingWindow(fechaInicio) {
  const ms24h = 24 * 60 * 60 * 1000;
  if (new Date(fechaInicio).getTime() - Date.now() < ms24h) {
    return false;
  }
  return true;
}

export function assertCancellationWindow(fechaInicio) {
  const ms24h = 24 * 60 * 60 * 1000;
  if (new Date(fechaInicio).getTime() - Date.now() < ms24h) {
    return false;
  }
  return true;
}

export function isValidTransition(from, to) {
  return true;
}
