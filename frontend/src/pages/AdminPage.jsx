export default function AdminPage({
  services,
  barbers,
  clients,
  newServiceForm,
  setNewServiceForm,
  onCreateService,
  onDeleteService,
  newBarberForm,
  setNewBarberForm,
  onCreateBarber,
  onDeleteBarber,
  onDeleteClient,
}) {
  return (
    <section className="grid">
      <article className="card">
        <h2>Crear servicio</h2>
        <p className="muted">Agrega nuevos servicios al catalogo.</p>
        <form onSubmit={onCreateService} className="form">
          <input
            placeholder="Nombre"
            value={newServiceForm.nombre}
            onChange={(e) => setNewServiceForm((prev) => ({ ...prev, nombre: e.target.value }))}
            required
          />
          <input
            placeholder="Descripcion"
            value={newServiceForm.descripcion}
            onChange={(e) => setNewServiceForm((prev) => ({ ...prev, descripcion: e.target.value }))}
          />
          <input
            placeholder="Duracion en minutos"
            type="number"
            value={newServiceForm.duracionMin}
            onChange={(e) => setNewServiceForm((prev) => ({ ...prev, duracionMin: e.target.value }))}
            required
          />
          <input
            placeholder="Precio referencia"
            type="number"
            step="0.01"
            value={newServiceForm.precioReferencia}
            onChange={(e) => setNewServiceForm((prev) => ({ ...prev, precioReferencia: e.target.value }))}
            required
          />
          <button className="btn" type="submit">
            Guardar servicio
          </button>
        </form>
      </article>

      <article className="card">
        <h2>Servicios</h2>
        {services.length === 0 ? <p className="muted">No hay servicios.</p> : null}
        <ul className="list-reset list-stack">
          {services.map((item) => (
            <li key={item.id} className="item-card">
              <div className="item-title-row">
                <span className="item-title">{item.nombre}</span>
                <button className="btn btn-danger btn-sm" onClick={() => onDeleteService(item.id)}>
                  ✕
                </button>
              </div>
              <div className="item-meta">
                <span>{item.duracionMin} min</span>
                <span>{item.precioReferencia} €</span>
              </div>
            </li>
          ))}
        </ul>
      </article>

      <article className="card">
        <h2>Crear barbero</h2>
        <p className="muted">Agrega nuevos barberos al sistema.</p>
        <form onSubmit={onCreateBarber} className="form">
          <input
            placeholder="Nombre"
            value={newBarberForm.nombre}
            onChange={(e) => setNewBarberForm((prev) => ({ ...prev, nombre: e.target.value }))}
            required
          />
          <input
            placeholder="Email"
            type="email"
            value={newBarberForm.email}
            onChange={(e) => setNewBarberForm((prev) => ({ ...prev, email: e.target.value }))}
            required
          />
          <input
            placeholder="Password"
            type="password"
            value={newBarberForm.password}
            onChange={(e) => setNewBarberForm((prev) => ({ ...prev, password: e.target.value }))}
            required
          />
          <button className="btn btn-secondary" type="submit">
            Crear barbero
          </button>
        </form>
      </article>

      <article className="card">
        <h2>Barberos</h2>
        {barbers.length === 0 ? <p className="muted">No hay barberos.</p> : null}
        <ul className="list-reset list-stack">
          {barbers.map((item) => (
            <li key={item.id} className="item-card">
              <div className="item-title-row">
                <span className="item-title">{item.usuario?.nombre}</span>
                <button className="btn btn-danger btn-sm" onClick={() => onDeleteBarber(item.id)}>
                  ✕
                </button>
              </div>
              <div className="item-meta">
                <span>{item.usuario?.email}</span>
              </div>
            </li>
          ))}
        </ul>
      </article>

      <article className="card">
        <h2>Clientes</h2>
        {clients.length === 0 ? <p className="muted">No hay clientes.</p> : null}
        <ul className="list-reset list-stack">
          {clients.map((item) => (
            <li key={item.id} className="item-card">
              <div className="item-title-row">
                <span className="item-title">{item.nombre}</span>
                <button className="btn btn-danger btn-sm" onClick={() => onDeleteClient(item.id)}>
                  ✕
                </button>
              </div>
              <div className="item-meta">
                <span>{item.email}</span>
              </div>
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}