export default function ServicesList({ services }) {
  return (
    <section className="card">
      <h2>Servicios activos</h2>
      <p className="muted">Explora duracion y precio de cada servicio.</p>
      {services.length === 0 ? <p className="muted">No hay servicios cargados.</p> : null}
      <ul className="list-reset list-grid">
        {services.map((service) => (
          <li key={service.id} className="item-card">
            <div className="item-title">{service.nombre}</div>
            <div className="item-meta">
              <span>{service.duracionMin} min</span>
              <span>{service.precioReferencia} €</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
