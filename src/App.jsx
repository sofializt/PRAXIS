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
    JSON.parse(localStorage.getItem("usuario"))?.id_rol !== 4 &&
    localStorage.getItem("usuario") ? "escenarios" : "inicio"
  );

  const [cargandoAnonimo, setCargandoAnonimo] = useState(false);

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
    // Si ya hay un docente autenticado, solo llevarlo a escenarios sin tocar su sesión
    if (usuario?.id_rol === 3) {
      setPantalla("escenarios");
      return;
    }

    setCargandoAnonimo(true);
    localStorage.clear();
    for (let intento = 1; intento <= 3; intento++) {
      try {
        const res = await fetch("https://backend-isu.onrender.com/api/anonimo", {
          method: "POST",
          signal: AbortSignal.timeout(15000)
        });
        const data = await res.json();
        if (data.usuario) {
          localStorage.setItem("usuario", JSON.stringify(data.usuario));
          localStorage.setItem("id_usuario", data.usuario.id_usuario);
          localStorage.setItem("id_rol", data.usuario.id_rol);
          setUsuario(data.usuario);
          setPantalla("escenarios");
          setCargandoAnonimo(false);
          return;
        }
      } catch (error) {
        console.warn(`Intento ${intento} fallido:`, error);
        if (intento < 3) await new Promise(r => setTimeout(r, 2000));
      }
    }
    const anonimo = { id_usuario: null, id_rol: 4, nombre: "Anónimo" };
    localStorage.setItem("usuario", JSON.stringify(anonimo));
    setUsuario(anonimo);
    setPantalla("escenarios");
    setCargandoAnonimo(false);
  };

  if (usuario?.id_rol === 2) return <PanelAdministrador usuario={usuario} />;

  if (pantalla === "escenarios") {
    return (
      <Escenarios
        onCerrarSesion={cerrarSesion}
        onVolverInicio={() => setPantalla("inicio")}
        usuario={usuario}
      />
    );
  }

  if (pantalla === "inicio") {
    return (
      <Inicio
        onSoyProfesor={() => setPantalla("login")}
        onJuzga={crearAnonimo}
        usuario={usuario}
        cargandoAnonimo={cargandoAnonimo}
        onCerrarSesion={cerrarSesion}
      />
    );
  }

  if (pantalla === "login") {
    return (
      <LoginDocente
        onLogin={(u) => { setUsuario(u); setPantalla("escenarios"); }}
        onAnonimo={crearAnonimo}
        onVolver={() => setPantalla("inicio")}
      />
    );
  }

  if (pantalla === "registro") {
    return (
      <RegisterDocente
        onRegistroExitoso={() => setPantalla("login")}
        onVolverLogin={() => setPantalla("login")}
      />
    );
  }

  return null;
}