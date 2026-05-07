export default function AgendaPage({ appointments, onDeleteAppointment }) {
  return (
    <section className="card">
      <h2>Agenda Global</h2>
      {appointments.length === 0 ? <p className="muted">No hay citas.</p> : null}
      <ul className="list-reset list-stack">
        {appointments.map((item) => (
          <li key={item.id} className="item-card item-card-row">
            <div className="item-main">
              <div className="item-title-row">
                <span className="item-title">{item.servicio?.nombre}</span>
                <span className={`status status-${item.estado}`}>{item.estado}</span>
              </div>
              <div className="item-meta">
                <span>{new Date(item.fechaInicio).toLocaleString()}</span>
                <span>Cliente: {item.cliente?.nombre}</span>
                <span>Barbero: {item.barbero?.usuario?.nombre}</span>
              </div>
            </div>
            <button className="btn btn-danger btn-sm" onClick={() => onDeleteAppointment(item.id)}>
              ✕
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}