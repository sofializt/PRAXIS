import { useState } from "react";
import logo from "../assets/praxis.svg";
import loginIcon from "../assets/User.svg";

export default function LoginAdmin({ onLogin }) {
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleLogin = async () => {
    if (!correo || !contraseña) {
      alert("Completa todos los campos");
      return;
    }

    setCargando(true);

    try {
      const res = await fetch("https://backend-isu.onrender.com/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          correo,
          contraseña
        })
      });

      const data = await res.json();

      if (data.usuario) {
        localStorage.setItem("usuarioAdmin", JSON.stringify(data.usuario));
        onLogin(data.usuario);
      } else {
        alert(data.message);
      }

    } catch (error) {
      console.error(error);
      alert("Error en el servidor");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      fontFamily: "Montserrat, sans-serif",
    }}>

      {/* LADO IZQUIERDO VERDE */}
      <div style={{
        width: "45%",
        backgroundColor: "#00482B",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <img src={logo} alt="logo" style={{ width: "220px" }} />
      </div>

      {/* LADO DERECHO BLANCO */}
      <div style={{
        width: "55%",
        backgroundColor: "#FFFFFF",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 80px"
      }}>

        {/* TÍTULO */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "40px"
        }}>
          <img src={loginIcon} alt="admin" style={{ width: "35px" }} />
          <h2 style={{
            color: "#00482B",
            margin: 0,
            fontWeight: "700"
          }}>
            Administrador
          </h2>
        </div>

        {/* FORM */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          maxWidth: "350px",
          gap: "20px"
        }}>

          <input
            placeholder="Correo"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            style={{
              padding: "14px",
              borderRadius: "12px",
              border: "2px solid #E0E0E0",
              outline: "none"
            }}
            onFocus={(e) => e.target.style.border = "2px solid #007B3E"}
            onBlur={(e) => e.target.style.border = "2px solid #E0E0E0"}
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={contraseña}
            onChange={(e) => setContraseña(e.target.value)}
            style={{
              padding: "14px",
              borderRadius: "12px",
              border: "2px solid #E0E0E0",
              outline: "none"
            }}
            onFocus={(e) => e.target.style.border = "2px solid #007B3E"}
            onBlur={(e) => e.target.style.border = "2px solid #E0E0E0"}
          />

          <button
            onClick={handleLogin}
            disabled={cargando}
            style={{
              backgroundColor: cargando ? "#A5D6A7" : "#007B3E",
              color: "white",
              border: "none",
              padding: "14px",
              borderRadius: "12px",
              cursor: "pointer",
              fontWeight: "700",
              transition: "0.3s"
            }}
            onMouseEnter={(e)=> {
              if(!cargando) e.target.style.backgroundColor="#00562A"
            }}
            onMouseLeave={(e)=> {
              if(!cargando) e.target.style.backgroundColor="#007B3E"
            }}
          >
            {cargando ? "Ingresando..." : "Ingresar"}
          </button>

        </div>
      </div>
    </div>
  );
}