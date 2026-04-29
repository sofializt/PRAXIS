import { useState } from "react";
import Inicio from "./pages/Inicio";
import LoginDocente from "./pages/LoginDocente";
import Escenarios from "./pages/Escenarios";
import LoginAdmin from "./pages/LoginAdmin";
import PanelAdministrador from "./pages/PanelAdministrador";
import RegisterDocente from "./pages/RegisterDocente";

export default function App() {
  const [usuario, setUsuario] = useState(
    JSON.parse(localStorage.getItem("usuario")) ||
    JSON.parse(localStorage.getItem("usuarioAdmin")) ||
    null
  );

  const [pantalla, setPantalla] = useState(
    // Si ya hay sesión de docente, arranca en escenarios
    JSON.parse(localStorage.getItem("usuario"))?.id_rol !== 4 &&
    localStorage.getItem("usuario") ? "escenarios" : "inicio"
  );

  if (window.location.pathname === "/admin") {
    if (usuario?.id_rol === 2) return <PanelAdministrador usuario={usuario} />;
    return <LoginAdmin onLogin={setUsuario} />;
  }

  const cerrarSesion = () => {
    localStorage.clear();
    setUsuario(null);
    setPantalla("inicio");
  };

  const crearAnonimo = async () => {
    localStorage.clear();
    for (let intento = 1; intento <= 3; intento++) {
      try {
        const res = await fetch("https://backend-isu.onrender.com/api/anonimo", {
          method: "POST",
          signal: AbortSignal.timeout(8000)
        });
        const data = await res.json();
        if (data.usuario) {
          localStorage.setItem("usuario", JSON.stringify(data.usuario));
          localStorage.setItem("id_usuario", data.usuario.id_usuario);
          localStorage.setItem("id_rol", data.usuario.id_rol);
          setUsuario(data.usuario);
          setPantalla("escenarios");
          return;
        }
      } catch (error) {
        console.warn(`Intento ${intento} fallido:`, error);
        if (intento < 3) await new Promise(r => setTimeout(r, 1500));
      }
    }
    const anonimo = { id_usuario: null, id_rol: 4, nombre: "Anónimo" };
    localStorage.setItem("usuario", JSON.stringify(anonimo));
    setUsuario(anonimo);
    setPantalla("escenarios");
  };

  if (usuario?.id_rol === 2) return <PanelAdministrador usuario={usuario} />;

  if (pantalla === "escenarios") {
    return (
      <Escenarios
        onCerrarSesion={cerrarSesion}
        onVolverInicio={() => setPantalla("inicio")}  // ← para volver al inicio
        usuario={usuario}
      />
    );
  }

  if (pantalla === "inicio") {
    return (
      <Inicio
        onSoyProfesor={() => setPantalla("login")}
        onJuzga={crearAnonimo}
        usuario={usuario}  // ← aquí llega el usuario docente
      />
    );
  }

  if (pantalla === "login") {
    return (
      <LoginDocente
        onLogin={(u) => { setUsuario(u); setPantalla("escenarios"); }}
        onAnonimo={crearAnonimo}
      />
    );
  }

  if (pantalla === "registro") {
    return <RegisterDocente onRegistroExitoso={() => setPantalla("login")} />;
  }

  return null;
}