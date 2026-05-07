import { NavLink, useLocation } from "react-router-dom";

export default function Layout({ auth, onLogout, children, error, okMessage }) {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <main className="container">
      <header className="header card">
        <div className="header-top">
          <div>
            <h1>BarberSoft</h1>
            <p className="subtitle">Reserva de citas de peluquería, barbería y estética.</p>
          </div>
          {auth ? (
            <span className="session-pill">
              Sesion: <strong>{auth.user.nombre}</strong> ({auth.user.rol})
            </span>
          ) : (
            <span className="session-pill session-pill--guest">Sesion no iniciada</span>
          )}
        </div>
        <nav className="nav">
          {!isHome ? (
            <NavLink to="/" className="nav-link">
              Inicio
            </NavLink>
          ) : null}
          {auth ? (
            <>
              {auth.user.rol === "cliente" ? (
                <NavLink to="/cliente" className="nav-link">
                  Panel cliente
                </NavLink>
              ) : null}
              {auth.user.rol === "barbero" ? (
                <NavLink to="/barbero" className="nav-link">
                  Panel barbero
                </NavLink>
              ) : null}
              {auth.user.rol === "admin" ? (
                <>
                  <NavLink to="/admin" className="nav-link">
                    Panel admin
                  </NavLink>
                  <NavLink to="/agenda" className="nav-link">
                    Agenda
                  </NavLink>
                </>
              ) : null}
            </>
          ) : (
            <NavLink to="/auth" className="nav-link">
              Login / Registro
            </NavLink>
          )}
          {auth ? (
            <button className="btn btn-danger nav-logout" onClick={onLogout}>
              Cerrar sesion
            </button>
          ) : null}
        </nav>
      </header>
      {children}
      {error ? <p className="msg error">{error}</p> : null}
      {okMessage ? <p className="msg ok">{okMessage}</p> : null}
    </main>
  );
}