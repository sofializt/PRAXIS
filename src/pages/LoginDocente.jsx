import { useState } from "react";
import logo from "../assets/praxis.svg";
import docenteIcon from "../assets/User.svg";
import LogoUdec from "../assets/udecblanco.png";
import RegisterDocente from "./RegisterDocente";

export default function LoginDocente({ onLogin, onAnonimo }) {
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [mostrarRegistro, setMostrarRegistro] = useState(false);
  const [cargando, setCargando] = useState(false);

  if (mostrarRegistro) {
    return (
      <RegisterDocente
        onRegistroExitoso={() => {
          setMostrarRegistro(false); // 👈 vuelve al login sin iniciar sesión
        }}
      />
    );
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!correo.trim() || !contraseña.trim()) {
      alert("Debes ingresar correo y contraseña");
      return;
    }

    setCargando(true);
    try {
      const res = await fetch("https://backend-isu.onrender.com/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, contraseña })
      });

      const data = await res.json();

      if (data.usuario) {
        localStorage.setItem("id_usuario", data.usuario.id_usuario);
        localStorage.setItem("id_rol", data.usuario.id_rol);
        localStorage.setItem("usuario", JSON.stringify(data.usuario));
        onLogin(data.usuario);
      } else {
        alert(data.message || "Credenciales incorrectas");
      }
    } catch (error) {
      console.error(error);
      alert("Error en el servidor");
    } finally {
      setCargando(false);
    }
  };

  const handleAnonimo = () => {
    localStorage.setItem("id_usuario", "12");
    localStorage.setItem("id_rol", "4");
    localStorage.setItem("usuario", JSON.stringify({
      id_usuario: 12,
      id_rol: 4,
      nombre: "Anonimo"
    }));
    onAnonimo();
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      fontFamily: "Montserrat, sans-serif",
    }}>

      {/* LADO IZQUIERDO — verde */}
      <div style={{
        width: "45%",
        backgroundColor: "#00482B",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 50px",
        animation: "slideInLeft 0.6s ease forwards"
      }}>
        <img
         src={logo}
         alt="Praxis"
         style={{ width: "200px", marginBottom: "50px", cursor: "pointer" }}
         onClick={() => window.location.href = "/"}
        />

        <svg width="120" height="160" viewBox="0 0 120 160" style={{ marginBottom: "30px" }}>
          <ellipse cx="60" cy="155" rx="25" ry="6" fill="rgba(0,0,0,0.2)"/>
          <line x1="52" y1="120" x2="45" y2="150" stroke="#007B3E" strokeWidth="8" strokeLinecap="round"
            style={{ animation: "piernaIzqStatic 1.5s ease-in-out infinite alternate", transformOrigin: "52px 120px" }}/>
          <line x1="68" y1="120" x2="75" y2="150" stroke="#007B3E" strokeWidth="8" strokeLinecap="round"
            style={{ animation: "piernaDerStatic 1.5s ease-in-out infinite alternate", transformOrigin: "68px 120px" }}/>
          <rect x="42" y="85" width="36" height="40" rx="6" fill="#007B3E"/>
          <polygon points="60,90 56,108 60,105 64,108" fill="#FFD700"/>
          <line x1="42" y1="95" x2="22" y2="112" stroke="#F5CBA7" strokeWidth="7" strokeLinecap="round"
            style={{ animation: "brazoIzqStatic 1.5s ease-in-out infinite alternate", transformOrigin: "42px 95px" }}/>
          <line x1="78" y1="95" x2="98" y2="112" stroke="#F5CBA7" strokeWidth="7" strokeLinecap="round"
            style={{ animation: "brazoDerStatic 1.5s ease-in-out infinite alternate", transformOrigin: "78px 95px" }}/>
          <rect x="100" y="108" width="18" height="14" rx="3" fill="#8B6914" stroke="#5C4A1E" strokeWidth="1.5"/>
          <path d="M 103 108 Q 103 104 109 104 Q 115 104 115 108" stroke="#5C4A1E" strokeWidth="1.5" fill="none"/>
          <rect x="55" y="72" width="10" height="16" rx="3" fill="#F5CBA7"/>
          <circle cx="60" cy="58" r="22" fill="#F5CBA7"/>
          <rect x="38" y="36" width="44" height="14" rx="7" fill="#4A2C0A"/>
          <circle cx="53" cy="55" r="3" fill="#333"/>
          <circle cx="67" cy="55" r="3" fill="#333"/>
          <path d="M 52 65 Q 60 72 68 65" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round"/>
        </svg>

        <h2 style={{
          color: "white",
          fontSize: "26px",
          fontWeight: "700",
          textAlign: "center",
          margin: "0 0 12px 0"
        }}>
          ¡Bienvenido, Profesor!
        </h2>

        <p style={{
          color: "rgba(255,255,255,0.75)",
          fontSize: "15px",
          textAlign: "center",
          lineHeight: "1.7",
          maxWidth: "280px"
        }}>
          Accede a tu cuenta para explorar escenarios educativos y tomar decisiones que impactan el aula.
        </p>

        <img src={LogoUdec} alt="UDEC" style={{ width: "160px", marginTop: "50px", opacity: 0.7 }} />
      </div>

      {/* LADO DERECHO — blanco */}
      <div style={{
        width: "55%",
        backgroundColor: "#FFFFFF",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 80px",
        animation: "slideInRight 0.6s ease forwards"
      }}>

        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "40px"
        }}>
          <img src={docenteIcon} alt="Docente" style={{ width: "36px" }} />
          <h2 style={{
            color: "#00482B",
            fontWeight: "700",
            margin: 0,
            fontSize: "24px"
          }}>
            Iniciar sesión
          </h2>
        </div>

        <form
          onSubmit={handleLogin}
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            maxWidth: "380px",
            gap: "20px"
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ fontSize: "13px", fontWeight: "600", color: "#555" }}>
              Correo electrónico
            </label>
            <input
              type="email"
              placeholder="tu@correo.com"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              style={{
                padding: "14px 18px",
                borderRadius: "12px",
                border: "2px solid #E0E0E0",
                fontSize: "15px",
                outline: "none",
                transition: "border 0.3s",
                fontFamily: "Montserrat, sans-serif"
              }}
              onFocus={(e) => e.target.style.border = "2px solid #007B3E"}
              onBlur={(e) => e.target.style.border = "2px solid #E0E0E0"}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ fontSize: "13px", fontWeight: "600", color: "#555" }}>
              Contraseña
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              style={{
                padding: "14px 18px",
                borderRadius: "12px",
                border: "2px solid #E0E0E0",
                fontSize: "15px",
                outline: "none",
                transition: "border 0.3s",
                fontFamily: "Montserrat, sans-serif"
              }}
              onFocus={(e) => e.target.style.border = "2px solid #007B3E"}
              onBlur={(e) => e.target.style.border = "2px solid #E0E0E0"}
            />
          </div>

          <div style={{ textAlign: "right", marginTop: "-8px" }}>
            <button
              type="button"
              onClick={() => setMostrarRegistro(true)}
              style={{
                background: "none",
                border: "none",
                color: "#007B3E",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: "600",
                textDecoration: "underline",
                fontFamily: "Montserrat, sans-serif"
              }}
            >
              ¿No tienes cuenta? Regístrate
            </button>
          </div>

          <button
            type="submit"
            disabled={cargando}
            style={{
              backgroundColor: cargando ? "#A5D6A7" : "#007B3E",
              color: "white",
              border: "none",
              padding: "15px",
              borderRadius: "12px",
              fontSize: "16px",
              fontWeight: "700",
              cursor: cargando ? "default" : "pointer",
              transition: "all 0.3s",
              fontFamily: "Montserrat, sans-serif",
              marginTop: "8px"
            }}
            onMouseEnter={(e) => { if (!cargando) e.target.style.backgroundColor = "#00562A"; }}
            onMouseLeave={(e) => { if (!cargando) e.target.style.backgroundColor = "#007B3E"; }}
          >
            {cargando ? "Ingresando..." : "Ingresar"}
          </button>

          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            margin: "4px 0"
          }}>
            <div style={{ flex: 1, height: "1px", backgroundColor: "#E0E0E0" }} />
            <span style={{ fontSize: "13px", color: "#999" }}>o</span>
            <div style={{ flex: 1, height: "1px", backgroundColor: "#E0E0E0" }} />
          </div>

          <button
            type="button"
            onClick={handleAnonimo}
            style={{
              backgroundColor: "white",
              color: "#007B3E",
              border: "2px solid #007B3E",
              padding: "14px",
              borderRadius: "12px",
              fontSize: "15px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s",
              fontFamily: "Montserrat, sans-serif"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#007B3E";
              e.currentTarget.style.color = "white";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "white";
              e.currentTarget.style.color = "#007B3E";
            }}
          >
            Continuar como anónimo
          </button>
        </form>
      </div>

      <style>{`
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(30px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes piernaIzqStatic {
          from { transform: rotate(-10deg); }
          to   { transform: rotate(10deg); }
        }
        @keyframes piernaDerStatic {
          from { transform: rotate(10deg); }
          to   { transform: rotate(-10deg); }
        }
        @keyframes brazoIzqStatic {
          from { transform: rotate(-15deg); }
          to   { transform: rotate(15deg); }
        }
        @keyframes brazoDerStatic {
          from { transform: rotate(15deg); }
          to   { transform: rotate(-15deg); }
        }
      `}</style>
    </div>
  );
}