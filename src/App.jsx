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

  // ✅ URL secreta para admin
  if (window.location.pathname === "/admin") {
    if (usuario?.id_rol === 2) return <PanelAdministrador usuario={usuario} />;
    return <LoginAdmin onLogin={setUsuario} />;
  }

  // ✅ Cerrar sesión — limpia TODO antes de resetear el estado
  const cerrarSesion = () => {
    localStorage.clear();  // ← primero limpia
    setUsuario(null);      // ← luego resetea React
    setPantalla("inicio");
  };

  // ✅ Crear anónimo — limpia sesión anterior antes de crear uno nuevo
  const crearAnonimo = async () => {
    try {
      localStorage.clear(); // ← borra el anónimo anterior antes de crear uno nuevo

      const res = await fetch("http://https://backend-isu.onrender.com/api/anonimo", {
        method: "POST"
      });
      const data = await res.json();

      if (data.usuario) {
        localStorage.setItem("usuario", JSON.stringify(data.usuario));
        localStorage.setItem("id_usuario", data.usuario.id_usuario);
        localStorage.setItem("id_rol", data.usuario.id_rol);
        setUsuario(data.usuario);
      }
    } catch (error) {
      console.error("Error creando anónimo:", error);
    }
  };

  // Si ya hay sesión activa
  if (usuario) {
    if (usuario.id_rol === 2) return <PanelAdministrador usuario={usuario} />;
    return <Escenarios onCerrarSesion={cerrarSesion} />;
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