export default function ClientePage({
  services,
  barbers,
  appointments,
  reserveForm,
  setReserveForm,
  onReserve,
  onCancelAppointment,
}) {
  return (
    <section className="grid">
      <article className="card">
        <h2>Reservar cita</h2>
        <p className="muted">Selecciona barbero, servicio y fecha/hora.</p>
        <form onSubmit={onReserve} className="form">
          <select
            value={reserveForm.barberoId}
            onChange={(e) => setReserveForm((prev) => ({ ...prev, barberoId: e.target.value }))}
            required
          >
            <option value="">Selecciona barbero</option>
            {barbers.map((barber) => (
              <option key={barber.id} value={barber.id}>
                {barber.usuario.nombre} (ID {barber.id})
              </option>
            ))}
          </select>
          <select
            value={reserveForm.servicioId}
            onChange={(e) => setReserveForm((prev) => ({ ...prev, servicioId: e.target.value }))}
            required
          >
            <option value="">Selecciona servicio</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.nombre}
              </option>
            ))}
          </select>
          <input
            type="datetime-local"
            value={reserveForm.fechaInicio}
            onChange={(e) => setReserveForm((prev) => ({ ...prev, fechaInicio: e.target.value }))}
            required
          />
          <textarea
            placeholder="Notas (opcional)"
            value={reserveForm.notas}
            onChange={(e) => setReserveForm((prev) => ({ ...prev, notas: e.target.value }))}
          />
          <button className="btn" type="submit">
            Reservar
          </button>
        </form>
      </article>

      <article className="card">
        <h2>Mis citas</h2>
        {appointments.length === 0 ? <p className="muted">Sin citas registradas.</p> : null}
        <ul className="list-reset list-stack">
          {appointments.map((item) => (
            <li key={item.id} className="item-card item-card-row">
              <div className="item-main">
                <div className="item-title">{item.servicio?.nombre}</div>
                <div className="item-meta">
                  <span>{new Date(item.fechaInicio).toLocaleString()}</span>
                  <span className={`status status-${item.estado}`}>{item.estado}</span>
                </div>
              </div>
              {item.estado !== "cancelada" ? (
                <button className="btn btn-danger" onClick={() => onCancelAppointment(item.id)}>
                  Cancelar
                </button>
              ) : null}
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}
