import { useState } from "react";

export default function AuthPage({
  loginForm,
  setLoginForm,
  registerForm,
  setRegisterForm,
  onLogin,
  onRegister,
}) {
  const [activeTab, setActiveTab] = useState("login");

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-tabs">
          <button
            className={`auth-tab ${activeTab === "login" ? "active" : ""}`}
            onClick={() => setActiveTab("login")}
          >
            Iniciar Sesión
          </button>
          <button
            className={`auth-tab ${activeTab === "register" ? "active" : ""}`}
            onClick={() => setActiveTab("register")}
          >
            Registrarse
          </button>
        </div>

        <div className="auth-form">
        {activeTab === "login" ? (
          <form onSubmit={onLogin} className="form">
            <h2 style={{ marginBottom: "1rem" }}>Bienvenido de nuevo</h2>
            <input
              placeholder="📧 Email"
              type="email"
              value={loginForm.email}
              onChange={(e) => setLoginForm((prev) => ({ ...prev, email: e.target.value }))}
              required
            />
            <input
              placeholder="🔒 Password"
              type="password"
              value={loginForm.password}
              onChange={(e) => setLoginForm((prev) => ({ ...prev, password: e.target.value }))}
              required
            />
            <button className="btn" type="submit" style={{ width: "100%", marginTop: "0.5rem" }}>
              Entrar
            </button>
          </form>
        ) : (
          <form onSubmit={onRegister} className="form">
            <h2 style={{ marginBottom: "1rem" }}>Crear cuenta</h2>
            <input
              placeholder="👤 Nombre completo"
              value={registerForm.nombre}
              onChange={(e) => setRegisterForm((prev) => ({ ...prev, nombre: e.target.value }))}
              required
            />
            <input
              placeholder="📧 Email"
              type="email"
              value={registerForm.email}
              onChange={(e) => setRegisterForm((prev) => ({ ...prev, email: e.target.value }))}
              required
            />
            <input
              placeholder="🔒 Password (mín 6 caracteres)"
              type="password"
              value={registerForm.password}
              onChange={(e) => setRegisterForm((prev) => ({ ...prev, password: e.target.value }))}
              required
            />
            <button className="btn btn-secondary" type="submit" style={{ width: "100%", marginTop: "0.5rem" }}>
              Crear cuenta
            </button>
          </form>
        )}
        </div>
      </div>
    </div>
  );
}