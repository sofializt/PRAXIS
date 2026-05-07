import { useState, useEffect } from "react";
import logo from "../assets/praxis.svg";
import LogoUdec from "../assets/udecblanco.png";

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isMobile;
};

const MUNICIPIOS = [
  { id: 1,  nombre: "Chía" },
  { id: 2,  nombre: "Cajicá" },
  { id: 3,  nombre: "Zipaquirá" },
  { id: 4,  nombre: "Sopó" },
  { id: 5,  nombre: "Cota" },
  { id: 6,  nombre: "Tenjo" },
  { id: 7,  nombre: "Tabio" },
  { id: 8,  nombre: "Tocancipá" },
  { id: 9,  nombre: "Gachancipá" },
  { id: 10, nombre: "Cogua" },
];

// Si usaste Opción B (sin tabla), cambia esto por un array estático
// y en handleSubmit envía nivel_educativo como string en vez de id
const NIVELES_EDUCATIVOS = [
  { id: 1, nombre: "Jardín infantil o guardería" },
  { id: 2, nombre: "Colegio o escuela" },
  { id: 3, nombre: "Universidad" },
];

export default function RegisterDocente({ onRegistroExitoso, onVolverLogin }) {
  const [form, setForm] = useState({
    nombre: "", apellido: "", correo: "", contraseña: "", confirmar: "",
    anos_experiencia: "", nombre_institucion: "", tipo_institucion: "",
    nivel_educativo: "", municipio: ""
  });
  const [otroMunicipio, setOtroMunicipio] = useState("");
  const [cargando, setCargando] = useState(false);
  const [completo, setCompleto] = useState(false);
  const isMobile = useIsMobile();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const municipioEsOtro = form.municipio === "otro";

  useEffect(() => {
    const camposBase = { ...form };
    const todosLlenos = Object.values(camposBase).every((v) => v.trim() !== "");
    const otroOk = municipioEsOtro ? otroMunicipio.trim() !== "" : true;
    setCompleto(todosLlenos && otroOk);
  }, [form, otroMunicipio, municipioEsOtro]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.contraseña !== form.confirmar) { alert("Las contraseñas no coinciden"); return; }
    if (!form.tipo_institucion || !form.nivel_educativo || !form.municipio || !form.nombre_institucion) {
      alert("Complete los campos de institución"); return;
    }
    if (municipioEsOtro && !otroMunicipio.trim()) {
      alert("Escribe el nombre del municipio"); return;
    }

    setCargando(true);
    try {
      // Si es "otro municipio", crearlo primero en la BD
      let id_municipio_final;

      if (municipioEsOtro) {
        const munRes = await fetch("https://backend-isu.onrender.com/api/municipios", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre: otroMunicipio.trim() })
        });
        const munData = await munRes.json();
        if (!munRes.ok || !munData.id_municipio) {
          alert("Error al registrar el municipio"); return;
        }
        id_municipio_final = munData.id_municipio;
      } else {
        id_municipio_final = Number(form.municipio);
      }

      // Crear institución (ahora incluye id_nivel_educativo)
      const institucionRes = await fetch("https://backend-isu.onrender.com/api/instituciones", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre_institucion: form.nombre_institucion,
          id_municipio: id_municipio_final,
          id_tipo_institucion: Number(form.tipo_institucion),
          id_nivel_educativo: Number(form.nivel_educativo)   // ← nuevo campo
        })
      });
      const institucionData = await institucionRes.json();
      if (!institucionRes.ok || !institucionData.id_institucion) { alert("Error al crear la institución"); return; }

      // Crear usuario
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
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      fontFamily: "Montserrat, sans-serif"
    }}>

      {/* PANEL IZQUIERDO — verde */}
      <div style={{
        width: isMobile ? "100%" : "45%",
        backgroundColor: "#00482B",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: isMobile ? "30px 24px" : "60px 50px",
        animation: "slideInLeft 0.6s ease forwards"
      }}>
        <img
          src={logo}
          alt="Praxis"
          style={{ width: isMobile ? "140px" : "200px", marginBottom: "20px", cursor: "pointer" }}
          onClick={() => window.location.href = "/"}
        />

        {!isMobile && (
          <div style={{ position: "relative", marginBottom: "20px" }}>
            <svg width="130" height="180" viewBox="0 0 130 180" style={{ overflow: "visible" }}>
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
              <ellipse cx="65" cy="173" rx="22" ry="5" fill="rgba(0,0,0,0.2)"
                style={completo ? { animation: "sombra 1.4s ease-in-out infinite" } : {}} />
              <g style={completo ? { animation: "saltar 1.4s ease-in-out infinite" } : {}}>
                <line x1="58" y1="120" x2="48" y2="155" stroke="#005E2B" strokeWidth="8" strokeLinecap="round"
                  style={completo ? { animation: "piernaIzqSalto 1.4s ease-in-out infinite", transformOrigin: "58px 120px" } : { transformOrigin: "58px 120px", transform: "rotate(0deg)" }} />
                <line x1="74" y1="120" x2="84" y2="155" stroke="#005E2B" strokeWidth="8" strokeLinecap="round"
                  style={completo ? { animation: "piernaDerSalto 1.4s ease-in-out infinite", transformOrigin: "74px 120px" } : { transformOrigin: "74px 120px", transform: "rotate(0deg)" }} />
                <rect x="48" y="85" width="36" height="38" rx="6" fill="#007B3E" />
                <polygon points="66,90 62,107 66,104 70,107" fill="#FFD700" />
                <line x1="48" y1="92" x2="28" y2={completo ? "68" : "110"} stroke="#F5CBA7" strokeWidth="7" strokeLinecap="round"
                  style={completo ? { animation: "brazoIzqSalto 1.4s ease-in-out infinite", transformOrigin: "48px 92px" } : { transition: "all 0.4s ease" }} />
                <line x1="84" y1="92" x2="104" y2={completo ? "68" : "110"} stroke="#F5CBA7" strokeWidth="7" strokeLinecap="round"
                  style={completo ? { animation: "brazoDerSalto 1.4s ease-in-out infinite", transformOrigin: "84px 92px" } : { transition: "all 0.4s ease" }} />
                {!completo && (
                  <g>
                    <rect x="106" y="108" width="18" height="14" rx="3" fill="#8B6914" stroke="#5C4A1E" strokeWidth="1.5" />
                    <path d="M 109 108 Q 109 104 115 104 Q 121 104 121 108" stroke="#5C4A1E" strokeWidth="1.5" fill="none" />
                  </g>
                )}
                <rect x="61" y="72" width="10" height="15" rx="3" fill="#F5CBA7" />
                <circle cx="66" cy="57" r="22" fill="#F5CBA7" />
                <rect x="44" y="35" width="44" height="14" rx="7" fill="#4A2C0A" />
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
                <path
                  d={completo ? "M 55 66 Q 66 78 77 66" : "M 58 66 Q 66 72 74 66"}
                  stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round"
                  style={{ transition: "d 0.4s ease" }} />
              </g>
            </svg>
          </div>
        )}

        <h2 style={{
          color: "white",
          fontSize: isMobile ? "18px" : (completo ? "22px" : "20px"),
          fontWeight: "700", textAlign: "center", marginBottom: "8px",
          transition: "font-size 0.3s ease",
          animation: completo ? "pulsoTexto 1.4s ease-in-out infinite" : "none"
        }}>
          {completo ? "¡Todo listo, profe! 🎉" : "¡Crea tu cuenta!"}
        </h2>

        {!isMobile && (
          <p style={{
            color: "rgba(255,255,255,0.75)", fontSize: "14px", textAlign: "center",
            lineHeight: "1.7", maxWidth: "260px"
          }}>
            {completo
              ? "Ya puedes crear tu cuenta y empezar a explorar."
              : "Regístrate para explorar escenarios educativos y tomar decisiones que impactan el aula."}
          </p>
        )}

        <img src={LogoUdec} alt="UDEC" style={{ width: isMobile ? "120px" : "160px", marginTop: isMobile ? "16px" : "40px", opacity: 0.7 }} />
      </div>

      {/* PANEL DERECHO — blanco */}
      <div style={{
        width: isMobile ? "100%" : "55%",
        backgroundColor: "#FFFFFF",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: isMobile ? "30px 20px" : "40px 70px",
        animation: "slideInRight 0.6s ease forwards",
        overflowY: "auto"
      }}>

        {/* Botón volver al login */}
        <div style={{ width: "100%", maxWidth: isMobile ? "100%" : "480px", marginBottom: "8px" }}>
          <button
            type="button"
            onClick={onVolverLogin}
            style={{
              background: "none", border: "none", color: "#999", cursor: "pointer",
              fontSize: "13px", fontFamily: "Montserrat, sans-serif", padding: "0",
              display: "flex", alignItems: "center", gap: "4px", transition: "color 0.2s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = "#007B3E"}
            onMouseLeave={(e) => e.currentTarget.style.color = "#999"}
          >
            ← Volver al login
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="10" r="6" fill="#00482B" />
            <path d="M4 28c0-6.627 5.373-12 12-12s12 5.373 12 12"
              stroke="#00482B" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </svg>
          <h2 style={{ color: "#00482B", fontWeight: "700", margin: 0, fontSize: isMobile ? "18px" : "22px" }}>
            Registrarme
          </h2>
        </div>

        <form onSubmit={handleSubmit} style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: "16px",
          width: "100%",
          maxWidth: isMobile ? "100%" : "480px"
        }}>
          <Field label="Nombre" isMobile={isMobile}>
            <input name="nombre" type="text" placeholder="Tu nombre" onChange={handleChange} />
          </Field>
          <Field label="Apellido" isMobile={isMobile}>
            <input name="apellido" type="text" placeholder="Tu apellido" onChange={handleChange} />
          </Field>
          <Field label="Correo electrónico" full isMobile={isMobile}>
            <input name="correo" type="email" placeholder="tu@correo.com" onChange={handleChange} />
          </Field>
          <Field label="Contraseña" isMobile={isMobile}>
            <input name="contraseña" type="password" placeholder="••••••••" onChange={handleChange} />
          </Field>
          <Field label="Confirmar contraseña" isMobile={isMobile}>
            <input name="confirmar" type="password" placeholder="••••••••" onChange={handleChange} />
          </Field>
          <Field label="Años de experiencia" isMobile={isMobile}>
            <input name="anos_experiencia" type="number" placeholder="0" min="0" onChange={handleChange} />
          </Field>
          <Field label="Nombre institución" isMobile={isMobile}>
            <input name="nombre_institucion" type="text" placeholder="Ej. Colegio San Juan" onChange={handleChange} />
          </Field>

          {/* TIPO DE INSTITUCIÓN */}
          <Field label="Tipo de institución" isMobile={isMobile}>
            <select name="tipo_institucion" onChange={handleChange} value={form.tipo_institucion}>
              <option value="">Seleccionar...</option>
              <option value="1">Oficial</option>
              <option value="2">Privada</option>
            </select>
          </Field>

          {/* NIVEL EDUCATIVO — nuevo campo, al lado de tipo institución */}
          <Field label="Nivel educativo" isMobile={isMobile}>
            <select name="nivel_educativo" onChange={handleChange} value={form.nivel_educativo}>
              <option value="">Seleccionar...</option>
              {NIVELES_EDUCATIVOS.map((n) => (
                <option key={n.id} value={n.id}>{n.nombre}</option>
              ))}
            </select>
          </Field>

          {/* MUNICIPIO */}
          <Field label="Municipio" full isMobile={isMobile}>
            <select name="municipio" onChange={handleChange} value={form.municipio}>
              <option value="">Seleccionar...</option>
              {MUNICIPIOS.map((m) => (
                <option key={m.id} value={m.id}>{m.nombre}</option>
              ))}
              <option value="otro">Otro municipio...</option>
            </select>
          </Field>

          {/* INPUT extra si elige "Otro" municipio */}
          {municipioEsOtro && (
            <Field label="Nombre del municipio" full isMobile={isMobile}>
              <input
                type="text"
                placeholder="Escribe el municipio"
                value={otroMunicipio}
                onChange={(e) => setOtroMunicipio(e.target.value)}
              />
            </Field>
          )}

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
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#007B3E";
              e.currentTarget.style.color = "white";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "white";
              e.currentTarget.style.color = "#007B3E";
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
          box-sizing: border-box;
        }
        input:focus, select:focus { border-color: #007B3E; }
      `}</style>
    </div>
  );
}

function Field({ label, children, full, isMobile }) {
  return (
    <div style={{
      gridColumn: (full || isMobile) ? "1 / -1" : "auto",
      display: "flex", flexDirection: "column", gap: "7px"
    }}>
      <label style={{ fontSize: "12px", fontWeight: "600", color: "#555" }}>{label}</label>
      {children}
    </div>
  );
}