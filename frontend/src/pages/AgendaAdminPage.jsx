import { useState, useEffect } from "react";

function getWeekDates(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const start = new Date(d);
  start.setDate(diff);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  return { start, end };
}

function formatDate(date) {
  return date.toISOString().split("T")[0];
}

export default function AgendaAdminPage({
  weekAppointments,
  onChangeAppointmentStatus,
  fetchWeekAppointments,
  onDeleteAppointment,
}) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");

  const { start: weekStart, end: weekEnd } = getWeekDates(currentDate);
  const weekDates = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    weekDates.push(d);
  }

  useEffect(() => {
    fetchWeekAppointments(
      weekStart.toISOString(),
      weekEnd.toISOString()
    );
  }, [currentDate]);

  function prevWeek() {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  }

  function nextWeek() {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  }

  function getAppointmentsForDay(date) {
    const dateStr = formatDate(date);
    return weekAppointments.filter(apt => {
      const aptDate = new Date(apt.fechaInicio).toISOString().split("T")[0];
      return aptDate === dateStr;
    });
  }

  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  const dayNames = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

  return (
    <section>
      <div className="calendar-nav">
        <button className="btn" onClick={prevWeek}>◀</button>
        <h2>{monthNames[weekStart.getMonth()]} {weekStart.getFullYear()}</h2>
        <button className="btn" onClick={nextWeek}>▶</button>
      </div>

      <div className="week-grid">
        {weekDates.map((date, idx) => (
          <div key={idx} className="day-column">
            <div className="day-header">
              {dayNames[idx]} {date.getDate()}
            </div>
            <div className="day-content">
              {getAppointmentsForDay(date).map(apt => (
                <div
                  key={apt.id}
                  className={`appointment-block status-${apt.estado}`}
                  onClick={() => { setSelectedAppointment(apt); setSelectedStatus(apt.estado); }}
                >
                  <div className="apt-time">
                    {new Date(apt.fechaInicio).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                  <div className="apt-service">{apt.servicio?.nombre}</div>
                  <div className="apt-client">{apt.cliente?.nombre}</div>
                  <div className="apt-barber">{apt.barbero?.usuario?.nombre || "Sin asignar"}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedAppointment && (
        <div className="modal-overlay" onClick={() => setSelectedAppointment(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Cambiar estado de cita</h3>
            <p><strong>Servicio:</strong> {selectedAppointment.servicio?.nombre}</p>
            <p><strong>Cliente:</strong> {selectedAppointment.cliente?.nombre}</p>
            <p><strong>Barbero:</strong> {selectedAppointment.barbero?.usuario?.nombre || "Sin asignar"}</p>
            <p><strong>Fecha:</strong> {new Date(selectedAppointment.fechaInicio).toLocaleString()}</p>
            <p><strong>Estado:</strong> <span className={`status status-${selectedAppointment.estado}`}>{selectedAppointment.estado}</span></p>
            
            <div className="form">
              <label>Cambiar estado:</label>
              <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
                <option value="pendiente">Pendiente</option>
                <option value="confirmada">Confirmada</option>
                <option value="completada">Completada</option>
                <option value="cancelada">Cancelada</option>
              </select>
              <button className="btn btn-secondary" style={{ marginTop: "0.5rem" }} onClick={async () => { await onChangeAppointmentStatus(selectedAppointment.id, selectedStatus, weekStart.toISOString(), weekEnd.toISOString()); setSelectedAppointment(null); }}>
                Guardar estado
              </button>
              {selectedAppointment.estado === "cancelada" && (
                <button className="btn btn-danger" style={{ marginTop: "0.5rem" }} onClick={async () => { await onDeleteAppointment(selectedAppointment.id); setSelectedAppointment(null); }}>
                  Eliminar cita
                </button>
              )}
            </div>
            
            <button className="btn" style={{ marginTop: "1rem", width: "100%" }} onClick={() => setSelectedAppointment(null)}>Cerrar</button>
          </div>
        </div>
      )}
    </section>
  );
}