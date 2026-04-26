import { useState, useEffect } from "react";
import logo from "../assets/praxis.svg";
import LogoUdec from "../assets/udecblanco.png";

export default function RegisterDocente({ onRegistroExitoso, onVolverLogin }) {
  const [form, setForm] = useState({
    nombre: "", apellido: "", correo: "", contraseña: "", confirmar: "",
    anos_experiencia: "", nombre_institucion: "", tipo_institucion: "", municipio: ""
  });
  const [cargando, setCargando] = useState(false);
  const [completo, setCompleto] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Detectar si todos los campos están llenos
  useEffect(() => {
    const todosLlenos = Object.values(form).every((v) => v.trim() !== "");
    setCompleto(todosLlenos);
  }, [form]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.contraseña !== form.confirmar) { alert("Las contraseñas no coinciden"); return; }
    if (!form.tipo_institucion || !form.municipio || !form.nombre_institucion) {
      alert("Complete los campos de institución"); return;
    }
    setCargando(true);
    try {
      const institucionRes = await fetch("https://backend-isu.onrender.com/api/instituciones", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre_institucion: form.nombre_institucion,
          id_municipio: Number(form.municipio),
          id_tipo_institucion: Number(form.tipo_institucion)
        })
      });
      const institucionData = await institucionRes.json();
      if (!institucionRes.ok || !institucionData.id_institucion) { alert("Error al crear la institución"); return; }

      const usuarioRes = await fetch("https://backend-isu.onrender.com/api/usuarios", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: form.nombre, apellido: form.apellido, correo: form.correo,
          contraseña: form.contraseña, anos_experiencia: Number(form.anos_experiencia),
          estado: 1, id_rol: 3, id_institucion: institucionData.id_institucion
        })
      });
      const usuarioData = await usuarioRes.json();
      if (!usuarioRes.ok) { alert("Error al crear el usuario"); return; }
      alert(usuarioData.message);
      onRegistroExitoso(usuarioData);
    } catch (error) {
      console.error(error); alert("Error en el servidor");
    } finally { setCargando(false); }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", fontFamily: "Montserrat, sans-serif" }}>

      {/* PANEL IZQUIERDO — verde */}
      <div style={{
        width: "45%", backgroundColor: "#00482B", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", padding: "60px 50px",
        animation: "slideInLeft 0.6s ease forwards"
      }}>
        <img src={logo} alt="Praxis" style={{ width: "200px", marginBottom: "30px" }} />

        {/* MUÑEQUITO CON ANIMACIÓN CONDICIONAL */}
        <div style={{ position: "relative", marginBottom: "20px" }}>
          <svg
            width="130"
            height="180"
            viewBox="0 0 130 180"
            style={{ overflow: "visible" }}
          >
            {/* Estrellitas — solo visibles cuando completo */}
            {completo && (
              <>
                <text x="5" y="55" fill="#FFD700" fontSize="18"
                  style={{ animation: "estrella1 1.2s ease-in-out infinite" }}>★</text>
                <text x="100" y="55" fill="#FFD700" fontSize="18"
                  style={{ animation: "estrella2 1.2s ease-in-out infinite" }}>★</text>
                <text x="55" y="20" fill="#FFD700" fontSize="13"
                  style={{ animation: "estrella3 1.4s ease-in-out infinite" }}>★</text>
              </>
            )}

            {/* Sombra animada */}
            <ellipse
              cx="65" cy="173" rx="22" ry="5"
              fill="rgba(0,0,0,0.2)"
              style={completo ? { animation: "sombra 1.4s ease-in-out infinite" } : {}}
            />

            {/* Todo el cuerpo en un grupo que salta */}
            <g style={completo ? { animation: "saltar 1.4s ease-in-out infinite" } : {}}>
              {/* Piernas */}
              <line
                x1="58" y1="120" x2="48" y2="155" stroke="#005E2B" strokeWidth="8" strokeLinecap="round"
                style={completo ? { animation: "piernaIzqSalto 1.4s ease-in-out infinite", transformOrigin: "58px 120px" } : { transformOrigin: "58px 120px", transform: "rotate(0deg)" }}
              />
              <line
                x1="74" y1="120" x2="84" y2="155" stroke="#005E2B" strokeWidth="8" strokeLinecap="round"
                style={completo ? { animation: "piernaDerSalto 1.4s ease-in-out infinite", transformOrigin: "74px 120px" } : { transformOrigin: "74px 120px", transform: "rotate(0deg)" }}
              />

              {/* Cuerpo */}
              <rect x="48" y="85" width="36" height="38" rx="6" fill="#007B3E" />
              <polygon points="66,90 62,107 66,104 70,107" fill="#FFD700" />

              {/* Brazos */}
              <line
                x1="48" y1="92" x2="28" y2={completo ? "68" : "110"}
                stroke="#F5CBA7" strokeWidth="7" strokeLinecap="round"
                style={completo
                  ? { animation: "brazoIzqSalto 1.4s ease-in-out infinite", transformOrigin: "48px 92px" }
                  : { transition: "all 0.4s ease" }}
              />
              <line
                x1="84" y1="92" x2="104" y2={completo ? "68" : "110"}
                stroke="#F5CBA7" strokeWidth="7" strokeLinecap="round"
                style={completo
                  ? { animation: "brazoDerSalto 1.4s ease-in-out infinite", transformOrigin: "84px 92px" }
                  : { transition: "all 0.4s ease" }}
              />

              {/* Maletín — desaparece cuando salta */}
              {!completo && (
                <g>
                  <rect x="106" y="108" width="18" height="14" rx="3" fill="#8B6914" stroke="#5C4A1E" strokeWidth="1.5" />
                  <path d="M 109 108 Q 109 104 115 104 Q 121 104 121 108" stroke="#5C4A1E" strokeWidth="1.5" fill="none" />
                </g>
              )}

              {/* Cuello */}
              <rect x="61" y="72" width="10" height="15" rx="3" fill="#F5CBA7" />

              {/* Cabeza */}
              <circle cx="66" cy="57" r="22" fill="#F5CBA7" />
              {/* Cabello */}
              <rect x="44" y="35" width="44" height="14" rx="7" fill="#4A2C0A" />

              {/* Ojos: normales o arcos de alegría */}
              {completo ? (
                <>
                  <path d="M 57 52 Q 60 47 63 52" stroke="#333" strokeWidth="2.2" fill="none" strokeLinecap="round" />
                  <path d="M 69 52 Q 72 47 75 52" stroke="#333" strokeWidth="2.2" fill="none" strokeLinecap="round" />
                </>
              ) : (
                <>
                  <circle cx="60" cy="54" r="3" fill="#333" />
                  <circle cx="72" cy="54" r="3" fill="#333" />
                </>
              )}

              {/* Sonrisa: pequeña o grande */}
              <path
                d={completo ? "M 55 66 Q 66 78 77 66" : "M 58 66 Q 66 72 74 66"}
                stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round"
                style={{ transition: "d 0.4s ease" }}
              />
            </g>
          </svg>
        </div>

        <h2 style={{
          color: "white", fontSize: completo ? "22px" : "20px", fontWeight: "700",
          textAlign: "center", marginBottom: "10px",
          transition: "font-size 0.3s ease",
          animation: completo ? "pulsoTexto 1.4s ease-in-out infinite" : "none"
        }}>
          {completo ? "¡Todo listo, profe! 🎉" : "¡Crea tu cuenta!"}
        </h2>

        <p style={{
          color: "rgba(255,255,255,0.75)", fontSize: "14px", textAlign: "center",
          lineHeight: "1.7", maxWidth: "260px"
        }}>
          {completo
            ? "Ya puedes crear tu cuenta y empezar a explorar."
            : "Regístrate para explorar escenarios educativos y tomar decisiones que impactan el aula."}
        </p>

        <img src={LogoUdec} alt="UDEC" style={{ width: "160px", marginTop: "40px", opacity: 0.7 }} />
      </div>

      {/* PANEL DERECHO — blanco */}
      <div style={{
        width: "55%", backgroundColor: "#FFFFFF", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", padding: "40px 70px",
        animation: "slideInRight 0.6s ease forwards", overflowY: "auto"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px" }}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="10" r="6" fill="#00482B" />
            <path d="M4 28c0-6.627 5.373-12 12-12s12 5.373 12 12"
              stroke="#00482B" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </svg>
          <h2 style={{ color: "#00482B", fontWeight: "700", margin: 0, fontSize: "22px" }}>Registrarme</h2>
        </div>

        <form onSubmit={handleSubmit} style={{
          display: "grid", gridTemplateColumns: "1fr 1fr",
          gap: "18px", width: "100%", maxWidth: "480px"
        }}>
          <Field label="Nombre">
            <input name="nombre" type="text" placeholder="Tu nombre" onChange={handleChange} />
          </Field>
          <Field label="Apellido">
            <input name="apellido" type="text" placeholder="Tu apellido" onChange={handleChange} />
          </Field>
          <Field label="Correo electrónico" full>
            <input name="correo" type="email" placeholder="tu@correo.com" onChange={handleChange} />
          </Field>
          <Field label="Contraseña">
            <input name="contraseña" type="password" placeholder="••••••••" onChange={handleChange} />
          </Field>
          <Field label="Confirmar contraseña">
            <input name="confirmar" type="password" placeholder="••••••••" onChange={handleChange} />
          </Field>
          <Field label="Años de experiencia">
            <input name="anos_experiencia" type="number" placeholder="0" min="0" onChange={handleChange} />
          </Field>
          <Field label="Nombre institución">
            <input name="nombre_institucion" type="text" placeholder="Ej. Colegio San Juan" onChange={handleChange} />
          </Field>
          <Field label="Tipo de institución">
            <select name="tipo_institucion" onChange={handleChange}>
              <option value="">Seleccionar...</option>
              <option value="1">Pública</option>
              <option value="2">Privada</option>
            </select>
          </Field>
          <Field label="Municipio">
            <select name="municipio" onChange={handleChange}>
              <option value="">Seleccionar...</option>
              {["Chía","Cajicá","Zipaquirá","Sopó","Cota","Tenjo","Tabio","Tocancipá","Gachancipá","Cogua"]
                .map((m, i) => <option key={i + 1} value={i + 1}>{m}</option>)}
            </select>
          </Field>

          <button
            type="submit"
            disabled={cargando}
            style={{
              gridColumn: "1 / -1",
              backgroundColor: completo ? (cargando ? "#A5D6A7" : "#007B3E") : "#A5D6A7",
              color: "white", border: "none", padding: "15px", borderRadius: "12px",
              fontSize: "16px", fontWeight: "700",
              cursor: completo && !cargando ? "pointer" : "default",
              fontFamily: "Montserrat, sans-serif", marginTop: "4px",
              transition: "background 0.4s",
              animation: completo && !cargando ? "pulsoBoton 1.4s ease-in-out infinite" : "none"
            }}
          >
            {cargando ? "Creando cuenta..." : completo ? "🎉 Crear cuenta" : "Crear cuenta"}
          </button>

          <div style={{ gridColumn: "1 / -1", display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ flex: 1, height: "1px", backgroundColor: "#E0E0E0" }} />
            <span style={{ fontSize: "13px", color: "#999" }}>o</span>
            <div style={{ flex: 1, height: "1px", backgroundColor: "#E0E0E0" }} />
          </div>

          <button
            type="button"
            onClick={onVolverLogin}
            style={{
              gridColumn: "1 / -1", backgroundColor: "white", color: "#007B3E",
              border: "2px solid #007B3E", padding: "14px", borderRadius: "12px",
              fontSize: "15px", fontWeight: "600", cursor: "pointer",
              fontFamily: "Montserrat, sans-serif"
            }}
          >
            ¿Ya tienes cuenta? Inicia sesión
          </button>
        </form>
      </div>

      <style>{`
        @keyframes slideInLeft  { from{opacity:0;transform:translateX(-30px)} to{opacity:1;transform:translateX(0)} }
        @keyframes slideInRight { from{opacity:0;transform:translateX(30px)}  to{opacity:1;transform:translateX(0)} }

        @keyframes saltar {
          0%,100% { transform: translateY(0); }
          40%,60% { transform: translateY(-22px); }
        }
        @keyframes sombra {
          0%,100% { rx: 22px; opacity: .2; }
          40%,60% { rx: 10px; opacity: .08; }
        }
        @keyframes brazoIzqSalto {
          0%,100% { transform: rotate(0deg); }
          40%,60% { transform: rotate(-55deg); }
        }
        @keyframes brazoDerSalto {
          0%,100% { transform: rotate(0deg); }
          40%,60% { transform: rotate(55deg); }
        }
        @keyframes piernaIzqSalto {
          0%,100% { transform: rotate(0deg); }
          40%,60% { transform: rotate(-20deg); }
        }
        @keyframes piernaDerSalto {
          0%,100% { transform: rotate(0deg); }
          40%,60% { transform: rotate(20deg); }
        }
        @keyframes estrella1 {
          0%,100% { transform: translate(0,0) scale(1); opacity:.7; }
          50% { transform: translate(-8px,-14px) scale(1.3); opacity:1; }
        }
        @keyframes estrella2 {
          0%,100% { transform: translate(0,0) scale(1); opacity:.7; }
          50% { transform: translate(8px,-14px) scale(1.3); opacity:1; }
        }
        @keyframes estrella3 {
          0%,100% { transform: translateY(0) scale(1); opacity:.5; }
          50% { transform: translateY(-10px) scale(1.2); opacity:1; }
        }
        @keyframes pulsoTexto {
          0%,100% { transform: scale(1); }
          50% { transform: scale(1.04); }
        }
        @keyframes pulsoBoton {
          0%,100% { box-shadow: 0 0 0 0 rgba(0,123,62,0.3); }
          50% { box-shadow: 0 0 0 8px rgba(0,123,62,0); }
        }

        input, select {
          padding: 13px 16px; border-radius: 10px; border: 2px solid #E0E0E0;
          font-size: 14px; font-family: Montserrat, sans-serif; outline: none;
          transition: border .3s; width: 100%; background: #fff;
        }
        input:focus, select:focus { border-color: #007B3E; }
      `}</style>
    </div>
  );
}

function Field({ label, children, full }) {
  return (
    <div style={{ gridColumn: full ? "1 / -1" : "auto", display: "flex", flexDirection: "column", gap: "7px" }}>
      <label style={{ fontSize: "12px", fontWeight: "600", color: "#555" }}>{label}</label>
      {children}
    </div>
  );
}