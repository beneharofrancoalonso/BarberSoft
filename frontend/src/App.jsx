import { useCallback, useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import ServicesList from "./components/ServicesList";
import AuthPage from "./pages/AuthPage";
import ClientePage from "./pages/ClientePage";
import BarberoPage from "./pages/BarberoPage";
import AdminPage from "./pages/AdminPage";
import AgendaPage from "./pages/AgendaPage";
import AgendaAdminPage from "./pages/AgendaAdminPage";
import { createApiClient } from "./lib/api";

function App() {
  const [auth, setAuth] = useState(() => {
    const raw = localStorage.getItem("barbersoft_auth");
    return raw ? JSON.parse(raw) : null;
  });
  const [services, setServices] = useState([]);
  const [barbers, setBarbers] = useState([]);
  const [clients, setClients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [weekAppointments, setWeekAppointments] = useState([]);
  const [adminWeekAppointments, setAdminWeekAppointments] = useState([]);
  const [error, setError] = useState("");
  const [okMessage, setOkMessage] = useState("");

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({ nombre: "", email: "", password: "" });
  const [reserveForm, setReserveForm] = useState({
    barberoId: "",
    servicioId: "",
    fechaInicio: "",
    notas: "",
  });
  const [newServiceForm, setNewServiceForm] = useState({
    nombre: "",
    descripcion: "",
    duracionMin: "",
    precioReferencia: "",
  });
  const [newBarberForm, setNewBarberForm] = useState({ nombre: "", email: "", password: "" });

  const api = useMemo(() => createApiClient(auth?.token), [auth]);

  const fetchPublicData = useCallback(async () => {
    const [servicesRes, barbersRes] = await Promise.all([api.get("/services"), api.get("/barbers")]);
    setServices(servicesRes.data);
    setBarbers(barbersRes.data);
    if (auth?.user?.rol === "admin") {
      const clientsRes = await api.get("/barbers/clients");
      setClients(clientsRes.data);
    }
  }, [api, auth]);

  const fetchRoleAppointments = useCallback(async () => {
    if (!auth) {
      setAppointments([]);
      return;
    }

    if (auth.user.rol === "cliente") {
      const res = await api.get("/appointments/me");
      setAppointments(res.data);
      return;
    }

    if (auth.user.rol === "barbero") {
      const res = await api.get("/appointments/barber/me");
      setAppointments(res.data);
      return;
    }

    if (auth.user.rol === "barbero") {
      const res = await api.get("/appointments/barber/me");
      setAppointments(res.data);
      return;
    }

    const res = await api.get("/appointments");
    setAppointments(res.data);
  }, [api, auth]);

  useEffect(() => {
    (async () => {
      try {
        setError("");
        await fetchPublicData();
      } catch (err) {
        setError(err?.response?.data?.message ?? "No se pudo cargar datos publicos.");
      }
    })();
  }, [fetchPublicData]);

  useEffect(() => {
    (async () => {
      if (!auth) return;
      try {
        setError("");
        await fetchRoleAppointments();
      } catch (err) {
        setError(err?.response?.data?.message ?? "No se pudo cargar la agenda.");
      }
    })();
  }, [auth, fetchRoleAppointments]);

  async function onLogin(e) {
    e.preventDefault();
    try {
      setError("");
      setOkMessage("");
      const res = await api.post("/auth/login", loginForm);
      const payload = { token: res.data.token, user: res.data.user };
      localStorage.setItem("barbersoft_auth", JSON.stringify(payload));
      setAuth(payload);
      setOkMessage("Sesion iniciada correctamente.");
    } catch (err) {
      setError(err?.response?.data?.message ?? "Error al iniciar sesion.");
    }
  }

  async function onRegister(e) {
    e.preventDefault();
    try {
      setError("");
      setOkMessage("");
      await api.post("/auth/register", registerForm);
      setOkMessage("Registro completado. Ahora puedes iniciar sesion.");
      setRegisterForm({ nombre: "", email: "", password: "" });
    } catch (err) {
      setError(err?.response?.data?.message ?? "Error al registrar usuario.");
    }
  }

  function onLogout() {
    localStorage.removeItem("barbersoft_auth");
    setAuth(null);
    setAppointments([]);
    setOkMessage("Sesion cerrada.");
  }

  async function onReserve(e) {
    e.preventDefault();
    try {
      setError("");
      setOkMessage("");
      await api.post("/appointments", {
        barberoId: Number(reserveForm.barberoId),
        servicioId: Number(reserveForm.servicioId),
        fechaInicio: new Date(reserveForm.fechaInicio).toISOString(),
        notas: reserveForm.notas || undefined,
      });
      setReserveForm({ barberoId: "", servicioId: "", fechaInicio: "", notas: "" });
      setOkMessage("Cita creada correctamente.");
      await fetchRoleAppointments();
    } catch (err) {
      setError(err?.response?.data?.message ?? "No se pudo crear la cita.");
    }
  }

  async function onCancelAppointment(id) {
    try {
      setError("");
      setOkMessage("");
      await api.patch(`/appointments/${id}/cancel`);
      setOkMessage("Cita cancelada.");
      await fetchRoleAppointments();
    } catch (err) {
      setError(err?.response?.data?.message ?? "No se pudo cancelar la cita.");
    }
  }

  async function onChangeAppointmentStatus(id, estado) {
    try {
      setError("");
      setOkMessage("");
      await api.patch(`/appointments/${id}/status`, { estado });
      setOkMessage("Estado de cita actualizado.");
      await fetchRoleAppointments();
    } catch (err) {
      setError(err?.response?.data?.message ?? "No se pudo actualizar estado.");
    }
  }

  async function onChangeAppointmentStatusAndReload(id, estado, weekStart, weekEnd) {
    try {
      setError("");
      setOkMessage("");
      await api.patch(`/appointments/${id}/status`, { estado });
      setOkMessage("Estado de cita actualizado.");
      await fetchRoleAppointments();
      if (weekStart && weekEnd) {
        await fetchWeekAppointments(weekStart, weekEnd);
        if (auth.user.rol === "admin") {
          await fetchAdminWeekAppointments(weekStart, weekEnd);
        }
      }
    } catch (err) {
      setError(err?.response?.data?.message ?? "No se pudo actualizar estado.");
    }
  }

  async function fetchWeekAppointments(start, end) {
    try {
      const res = await api.get(`/appointments/barber/week?start=${start}&end=${end}`);
      setWeekAppointments(res.data);
    } catch (err) {
      setError(err?.response?.data?.message ?? "No se pudieron cargar las citas de la semana.");
    }
  }

  async function fetchAdminWeekAppointments(start, end) {
    try {
      const res = await api.get(`/appointments/admin/week?start=${start}&end=${end}`);
      setAdminWeekAppointments(res.data);
    } catch (err) {
      setError(err?.response?.data?.message ?? "No se pudieron cargar las citas de la semana.");
    }
  }

  async function onCreateService(e) {
    e.preventDefault();
    try {
      setError("");
      setOkMessage("");
      await api.post("/services", {
        nombre: newServiceForm.nombre,
        descripcion: newServiceForm.descripcion || undefined,
        duracionMin: Number(newServiceForm.duracionMin),
        precioReferencia: Number(newServiceForm.precioReferencia),
      });
      setNewServiceForm({ nombre: "", descripcion: "", duracionMin: "", precioReferencia: "" });
      setOkMessage("Servicio creado.");
      await fetchPublicData();
    } catch (err) {
      setError(err?.response?.data?.message ?? "No se pudo crear servicio.");
    }
  }

  async function onDeleteService(id) {
    try {
      setError("");
      setOkMessage("");
      await api.delete(`/services/${id}`);
      setOkMessage("Servicio eliminado.");
      await fetchPublicData();
    } catch (err) {
      setError(err?.response?.data?.message ?? "No se pudo eliminar servicio.");
    }
  }

  async function onDeleteAppointment(id) {
    try {
      setError("");
      setOkMessage("");
      await api.delete(`/appointments/${id}`);
      setOkMessage("Cita eliminada.");
      await fetchRoleAppointments();
    } catch (err) {
      setError(err?.response?.data?.message ?? "No se pudo eliminar cita.");
    }
  }

  async function onCreateBarber(e) {
    e.preventDefault();
    try {
      setError("");
      setOkMessage("");
      await api.post("/barbers", newBarberForm);
      setOkMessage("Barbero creado.");
      setNewBarberForm({ nombre: "", email: "", password: "" });
      await fetchPublicData();
    } catch (err) {
      setError(err?.response?.data?.message ?? "No se pudo crear barbero.");
    }
  }

  async function onDeleteBarber(id) {
    try {
      setError("");
      setOkMessage("");
      await api.delete(`/barbers/${id}`);
      setOkMessage("Barbero eliminado.");
      await fetchPublicData();
    } catch (err) {
      setError(err?.response?.data?.message ?? "No se pudo eliminar barbero.");
    }
  }

  async function onDeleteClient(id) {
    try {
      setError("");
      setOkMessage("");
      await api.delete(`/barbers/client/${id}`);
      setOkMessage("Cliente eliminado.");
      const res = await api.get("/barbers/clients");
      setClients(res.data);
    } catch (err) {
      setError(err?.response?.data?.message ?? "No se pudo eliminar cliente.");
    }
  }

  return (
    <Layout auth={auth} onLogout={onLogout} error={error} okMessage={okMessage}>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <ServicesList services={services} />
            </>
          }
        />
        <Route
          path="/auth"
          element={
            auth ? (
              <Navigate to={`/${auth.user.rol}`} replace />
            ) : (
              <AuthPage
                loginForm={loginForm}
                setLoginForm={setLoginForm}
                registerForm={registerForm}
                setRegisterForm={setRegisterForm}
                onLogin={onLogin}
                onRegister={onRegister}
              />
            )
          }
        />
        <Route
          path="/cliente"
          element={
            auth?.user.rol === "cliente" ? (
              <ClientePage
                services={services}
                barbers={barbers}
                appointments={appointments}
                reserveForm={reserveForm}
                setReserveForm={setReserveForm}
                onReserve={onReserve}
                onCancelAppointment={onCancelAppointment}
              />
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />
        <Route
          path="/barbero"
          element={
            auth?.user.rol === "barbero" ? (
              <BarberoPage 
                appointments={appointments} 
                weekAppointments={weekAppointments}
                onChangeAppointmentStatus={onChangeAppointmentStatusAndReload}
                fetchWeekAppointments={fetchWeekAppointments}
              />
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />
        <Route
          path="/admin"
          element={
            auth?.user.rol === "admin" ? (
              <AdminPage
                services={services}
                barbers={barbers}
                clients={clients}
                newServiceForm={newServiceForm}
                setNewServiceForm={setNewServiceForm}
                onCreateService={onCreateService}
                onDeleteService={onDeleteService}
                newBarberForm={newBarberForm}
                setNewBarberForm={setNewBarberForm}
                onCreateBarber={onCreateBarber}
                onDeleteBarber={onDeleteBarber}
                onDeleteClient={onDeleteClient}
              />
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />
        <Route
          path="/agenda"
          element={
            auth?.user.rol === "admin" ? (
              <AgendaAdminPage 
                weekAppointments={adminWeekAppointments} 
                onChangeAppointmentStatus={onChangeAppointmentStatusAndReload}
                fetchWeekAppointments={fetchAdminWeekAppointments}
              />
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;
