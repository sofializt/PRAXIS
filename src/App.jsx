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

  const [pantalla, setPantalla] = useState("inicio");

  // URL secreta para admin
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

    // Intentar hasta 3 veces
    for (let intento = 1; intento <= 3; intento++) {
      try {
        const res = await fetch("https://backend-isu.onrender.com/api/anonimo", {
          method: "POST",
          signal: AbortSignal.timeout(8000) // 8 segundos máximo por intento
        });
        const data = await res.json();

        if (data.usuario) {
          localStorage.setItem("usuario", JSON.stringify(data.usuario));
          localStorage.setItem("id_usuario", data.usuario.id_usuario);
          localStorage.setItem("id_rol", data.usuario.id_rol);
          setUsuario(data.usuario);
          return; // éxito, salir
        }
      } catch (error) {
        console.warn(`Intento ${intento} fallido:`, error);
        if (intento < 3) {
          await new Promise(r => setTimeout(r, 1500)); // esperar 1.5s antes de reintentar
        }
      }
    }

    // Si falló todo, crear anónimo local sin BD
    console.warn("Backend no disponible, usando anónimo local");
    const anomimo = { id_usuario: null, id_rol: 4, nombre: "Anónimo" };
    localStorage.setItem("usuario", JSON.stringify(anomimo));
    setUsuario(anomimo);
  };

  // Si ya hay sesión activa
  if (usuario) {
    if (usuario.id_rol === 2) return <PanelAdministrador usuario={usuario} />;
    return <Escenarios onCerrarSesion={cerrarSesion} usuario={usuario} />;
  }

  // Inicio público
  if (pantalla === "inicio") {
    return (
      <Inicio
        onSoyProfesor={() => setPantalla("login")}
        onJuzga={crearAnonimo}
      />
    );
  }

  // Login docente
  if (pantalla === "login") {
    return (
      <LoginDocente
        onLogin={setUsuario}
        onAnonimo={crearAnonimo}
      />
    );
  }

  // Registro docente
  if (pantalla === "registro") {
    return <RegisterDocente onRegistroExitoso={() => setPantalla("login")} />;
  }

  return null;
}