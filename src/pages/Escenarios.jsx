import { useEffect, useState } from "react";
import logo from "../assets/praxis.svg";
import LogoUdec from "../assets/udecblanco.png";

const DIMENSIONES = [
  { id: 1, nombre: "Pedagógica" },
  { id: 5, nombre: "Autonomía Profesional" },
  { id: 3, nombre: "Ética" },
  { id: 4, nombre: "Equidad" },
];

export default function Escenarios({ onCerrarSesion, onVolverInicio, usuario }) {
  const [escenarios, setEscenarios] = useState([]);
  const [indiceActual, setIndiceActual] = useState(0);
  const [opciones, setOpciones] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [yaRespondio, setYaRespondio] = useState(false);
  const [respuestaTexto, setRespuestaTexto] = useState("");
  const [misRespuestas, setMisRespuestas] = useState([]);
  const [dimensionSeleccionada, setDimensionSeleccionada] = useState(null);
  const [cambiandoRespuesta, setCambiandoRespuesta] = useState(false);
  const [enviando, setEnviando] = useState(false); // 👈 NUEVO: evita doble petición

  const [cargandoEscenarios, setCargandoEscenarios] = useState(true);
  const [cargandoOpciones, setCargandoOpciones] = useState(false);
  const [errorCarga, setErrorCarga] = useState(false);

  useEffect(() => {
    cargarEscenarios();
    const id_usuario_raw = localStorage.getItem("id_usuario");
    const id_usuario = (id_usuario_raw && id_usuario_raw !== "null") ? Number(id_usuario_raw) : null;
    if (id_usuario) {
      cargarMisRespuestas(id_usuario);
    } else {
      setMisRespuestas([]);
    }
  }, []);

  useEffect(() => {
    const escenario = escenariosFiltrados[indiceActual];
    if (!escenario) return;
    cargarOpciones(escenario.id_escenario);
  }, [indiceActual, escenarios, dimensionSeleccionada]);

  useEffect(() => {
    validarSiYaRespondio();
  }, [misRespuestas, indiceActual, escenarios, dimensionSeleccionada]);

  const cargarEscenarios = async () => {
    try {
      setCargandoEscenarios(true);
      setErrorCarga(false);
      const res = await fetch("https://backend-isu.onrender.com/api/escenarios");
      if (!res.ok) throw new Error("Error del servidor");
      const data = await res.json();
      setEscenarios(data);
    } catch (error) {
      console.error(error);
      setErrorCarga(true);
    } finally {
      setCargandoEscenarios(false);
    }
  };

  const cargarOpciones = async (idEscenario) => {
    try {
      setCargandoOpciones(true);
      const res = await fetch(`https://backend-isu.onrender.com/api/opciones/${idEscenario}`);
      if (!res.ok) throw new Error("Error del servidor");
      const data = await res.json();
      setOpciones(data);
    } catch (error) {
      console.error(error);
    } finally {
      setCargandoOpciones(false);
    }
  };

  const cargarMisRespuestas = async (id) => {
    try {
      const res = await fetch(`https://backend-isu.onrender.com/api/respuestas/usuario/${id}`);
      const data = await res.json();
      setMisRespuestas(data);
    } catch (error) {
      console.error(error);
    }
  };

  const validarSiYaRespondio = () => {
    if (cambiandoRespuesta) return;
    const escenario = escenariosFiltrados[indiceActual];
    if (!escenario) return;
    const ya = misRespuestas.find((r) => r.id_escenario === escenario.id_escenario);
    if (ya) {
      setYaRespondio(true);
      setSelectedOption(ya.id_opcion);
      setRespuestaTexto(ya.respuesta);
    } else {
      setYaRespondio(false);
      setSelectedOption(null);
      setRespuestaTexto("");
    }
  };

  const seleccionar = async (idOpcion) => {
    if ((yaRespondio && !cambiandoRespuesta) || enviando) return; // 👈 bloquea doble click
    
    setEnviando(true); // 👈 bloquea inmediatamente

    const escenario = escenariosFiltrados[indiceActual];
    const id_usuario_raw = localStorage.getItem("id_usuario");
    const id_usuario = (id_usuario_raw && id_usuario_raw !== "null") ? Number(id_usuario_raw) : null;
    const id_rol_raw = localStorage.getItem("id_rol");
    const id_rol = (id_rol_raw && id_rol_raw !== "null") ? Number(id_rol_raw) : null;
    const opcionElegida = opciones.find((op) => op.id_opcion === idOpcion);

    if (!id_usuario) {
      setSelectedOption(idOpcion);
      setYaRespondio(true);
      setCambiandoRespuesta(false);
      setRespuestaTexto(opcionElegida?.descripcion || "Respuesta registrada");
      setEnviando(false);
      return;
    }

    try {
      const res = await fetch("https://backend-isu.onrender.com/api/respuestas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_usuario, id_rol, id_opcion: idOpcion, id_escenario: escenario.id_escenario })
      });
      const data = await res.json();
      if (!res.ok) { alert(data.message); return; }
      setCambiandoRespuesta(false);
      setSelectedOption(idOpcion);
      setYaRespondio(true);
      setRespuestaTexto(opcionElegida?.descripcion || "Respuesta guardada");
      cargarMisRespuestas(id_usuario);
    } catch (error) {
      console.error(error);
    } finally {
      setEnviando(false); // 👈 siempre desbloquea al terminar
    }
  };

  const cerrarSesion = () => {
    localStorage.removeItem("id_usuario");
    localStorage.removeItem("id_rol");
    localStorage.removeItem("usuario");
    onCerrarSesion();
  };

  const volverInicio = () => {
    if (onVolverInicio) {
      onVolverInicio();
    } else {
      cerrarSesion();
    }
  };

  const escenariosFiltrados = dimensionSeleccionada
    ? escenarios.filter((e) => e.id_dimension === dimensionSeleccionada)
    : escenarios;

  const escenario = escenariosFiltrados[indiceActual];
  const indiceDimension = DIMENSIONES.findIndex((d) => d.id === dimensionSeleccionada);
  const hayAnterior = indiceActual > 0 || indiceDimension > 0;
  const haySiguiente = indiceActual < escenariosFiltrados.length - 1 || indiceDimension < DIMENSIONES.length - 1;

  const siguienteEscenario = () => {
    setCambiandoRespuesta(false);
    setEnviando(false); // 👈
    if (indiceActual < escenariosFiltrados.length - 1) {
      setIndiceActual(indiceActual + 1);
    } else {
      const siguienteDimension = DIMENSIONES[indiceDimension + 1];
      if (siguienteDimension) {
        setDimensionSeleccionada(siguienteDimension.id);
        setIndiceActual(0);
      }
    }
  };

  const anteriorEscenario = () => {
    setCambiandoRespuesta(false);
    setEnviando(false); // 👈
    if (indiceActual > 0) {
      setIndiceActual(indiceActual - 1);
    } else {
      const dimensionAnterior = DIMENSIONES[indiceDimension - 1];
      if (dimensionAnterior) {
        const escenariosDimAnterior = escenarios.filter(
          (e) => e.id_dimension === dimensionAnterior.id
        );
        setDimensionSeleccionada(dimensionAnterior.id);
        setIndiceActual(escenariosDimAnterior.length - 1);
      }
    }
  };

  const esDocente = usuario?.id_rol !== 4;

  const Spinner = ({ mensaje = "Cargando..." }) => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "100px 0", gap: "20px" }}>
      <div style={{ width: "52px", height: "52px", border: "5px solid #DFF5EA", borderTop: "5px solid #007B3E", borderRadius: "50%", animation: "girar 0.8s linear infinite" }} />
      <p style={{ color: "#007B3E", fontWeight: "600", fontSize: "16px", margin: 0 }}>{mensaje}</p>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FFFFFF", fontFamily: "Montserrat, sans-serif", display: "flex", flexDirection: "column" }}>

      {/* HEADER */}
      <nav style={{
        backgroundColor: "#007B3E",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 60px",
        height: "100px",
      }}>
        <img
          src={logo}
          alt="ISU"
          style={{ height: "70px", cursor: "pointer" }}
          onClick={volverInicio}
        />

        <div style={{ display: "flex", alignItems: "center", gap: "50px" }}>
          {[
            { label: "Inicio", key: "inicio" },
            { label: "¿Qué hacemos?", key: "que" },
            { label: "Juzga", key: "juzga" },
          ].map(({ label, key }) => (
            <span
              key={key}
              onClick={() => {
                if (key === "juzga") return;
                if (key === "inicio" || key === "que") { volverInicio(); return; }
              }}
              style={{
                color: "white",
                fontWeight: "600",
                fontSize: "16px",
                cursor: "pointer",
                borderBottom: key === "juzga" ? "2px solid white" : "2px solid transparent",
              }}
            >
              {label}
            </span>
          ))}

          <span
            onClick={() => window.open("https://forms.cloud.microsoft/r/iBJ4fHqZdq", "_blank")}
            style={{ color: "white", fontWeight: "600", fontSize: "16px", cursor: "pointer" }}
          >
            Proponer escenario
          </span>
        </div>

        <button
          onClick={cerrarSesion}
          style={{
            backgroundColor: "white",
            color: "#00482B",
            border: "none",
            borderRadius: "30px",
            padding: "12px 28px",
            fontWeight: "700",
            fontSize: "15px",
            cursor: "pointer",
            transition: "all 0.3s",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            visibility: esDocente ? "visible" : "hidden"
          }}
          onMouseEnter={(e) => e.target.style.transform = "scale(1.05)"}
          onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
        >
          CERRAR SESIÓN
        </button>
      </nav>

      {/* BARRA VOLVER A CATEGORÍAS */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px 130px" }}>
        <span
          onClick={() => { setDimensionSeleccionada(null); setIndiceActual(0); setCambiandoRespuesta(false); setEnviando(false); }}
          style={{
            cursor: "pointer",
            color: "#007B3E",
            fontWeight: "600",
            fontSize: "15px",
            visibility: dimensionSeleccionada ? "visible" : "hidden"
          }}
        >
          ← Volver a categorías
        </span>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div style={{ flex: 1 }}>

        {cargandoEscenarios && (
          <Spinner mensaje="Cargando escenarios... esto puede tardar unos segundos" />
        )}

        {!cargandoEscenarios && errorCarga && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "100px 0", gap: "16px" }}>
            <p style={{ color: "#cc0000", fontWeight: "600", fontSize: "16px" }}>
              ⚠ No se pudo conectar al servidor. Intenta de nuevo.
            </p>
            <button
              onClick={cargarEscenarios}
              style={{ backgroundColor: "#007B3E", color: "white", border: "none", borderRadius: "25px", padding: "12px 28px", fontWeight: "700", cursor: "pointer", fontSize: "15px" }}
            >
              Reintentar
            </button>
          </div>
        )}

        {!cargandoEscenarios && !errorCarga && (
          <>
            {!dimensionSeleccionada && (
              <div style={{ padding: "40px 80px", textAlign: "center" }}>
                <h2 style={{ color: "#00482B", marginBottom: "50px" }}>Selecciona una categoría</h2>
                <div style={{ display: "flex", gap: "40px", justifyContent: "center", flexWrap: "wrap" }}>
                  {DIMENSIONES.map((dim) => (
                    <div
                      key={dim.id}
                      onClick={() => { setDimensionSeleccionada(dim.id); setIndiceActual(0); }}
                      style={{
                        backgroundColor: "#007B3E", color: "white",
                        padding: "60px 70px", borderRadius: "18px",
                        cursor: "pointer", fontWeight: "600", fontSize: "20px",
                        minWidth: "220px", transition: "all 0.3s",
                        boxShadow: "0 6px 15px rgba(0,0,0,0.15)"
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-8px) scale(1.05)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0) scale(1)"; }}
                    >
                      {dim.nombre}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {dimensionSeleccionada && escenario && (
              <div style={{ animation: "fadeIn 0.5s ease" }}>

                <div style={{
                  backgroundColor: "#FBE122", textAlign: "center",
                  padding: "18px", fontWeight: "700", fontSize: "20px",
                  color: "#00482B", boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
                }}>
                  {DIMENSIONES.find((d) => d.id === dimensionSeleccionada)?.nombre}
                </div>

                <div style={{ padding: "30px 130px", maxWidth: "1000px", margin: "0 auto" }}>
                  <h2 style={{ color: "#00482B", textAlign: "center" }}>{escenario.titulo}</h2>
                  <div style={{ backgroundColor: "#F5F5F5", borderRadius: "14px", padding: "20px", marginTop: "20px" }}>
                    <p style={{ lineHeight: "1.7" }}>
                      <strong style={{ color: "#007B3E" }}>Situación: </strong>
                      {escenario.descripcion}
                    </p>
                  </div>
                  <p style={{ textAlign: "center", fontWeight: "600", marginTop: "20px", color: "#00482B" }}>
                    {escenario.pregunta}
                  </p>
                </div>

                {cargandoOpciones ? (
                  <Spinner mensaje="Cargando opciones..." />
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px", padding: "0 130px", maxWidth: "1000px", margin: "0 auto" }}>
                    {opciones.map((opcion) => {
                      const esElegida = selectedOption === opcion.id_opcion;
                      const esNoElegida = yaRespondio && !esElegida;

                      return (
                        <div
                          key={opcion.id_opcion}
                          onClick={() => seleccionar(opcion.id_opcion)}
                          style={{
                            backgroundColor: "white",
                            borderRadius: "16px",
                            overflow: "hidden",
                            border: esElegida ? "4px solid #007B3E" : "4px solid transparent",
                            cursor: (yaRespondio && !cambiandoRespuesta) ? "default" : "pointer", // 👈
                            transition: "all 0.4s",
                            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                            opacity: esNoElegida ? 0.35 : 1,
                            filter: esNoElegida ? "grayscale(60%)" : "none",
                            position: "relative",
                          }}
                          onMouseEnter={(e) => { if (!yaRespondio || cambiandoRespuesta) e.currentTarget.style.transform = "translateY(-6px) scale(1.02)"; }} // 👈
                          onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0) scale(1)"; }}
                        >
                          <img
                            src={`https://backend-isu.onrender.com/uploads/${opcion.imagen}`}
                            alt=""
                            style={{ width: "100%", height: "230px", objectFit: "cover" }}
                          />

                          {esElegida && (
                            <div style={{
                              position: "absolute",
                              top: "16px",
                              right: "16px",
                              backgroundColor: "#007B3E",
                              color: "white",
                              fontWeight: "800",
                              fontSize: "13px",
                              padding: "6px 14px",
                              borderRadius: "6px",
                              letterSpacing: "2px",
                              textTransform: "uppercase",
                              border: "2px solid white",
                              boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                              animation: "sellazo 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97) forwards",
                              transformOrigin: "center",
                            }}>
                              ✔ Elegido
                            </div>
                          )}

                          <div style={{ padding: "18px" }}>
                            <p style={{ margin: 0 }}>{opcion.descripcion}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {yaRespondio && (
                  <div style={{ marginTop: "25px", textAlign: "center", animation: "pop 0.4s ease" }}>
                    <button
                      onClick={() => {
                        setCambiandoRespuesta(true);
                        setYaRespondio(false);
                        setSelectedOption(null);
                        setRespuestaTexto("");
                        setEnviando(false); // 👈
                      }}
                      style={{
                        backgroundColor: "white",
                        color: "#007B3E",
                        border: "2px solid #007B3E",
                        borderRadius: "30px",
                        padding: "10px 28px",
                        fontWeight: "700",
                        fontSize: "14px",
                        cursor: "pointer",
                        transition: "all 0.3s",
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#DFF5EA"}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "white"}
                    >
                      ↩ Cambiar respuesta
                    </button>
                  </div>
                )}

                <div style={{ position: "fixed", top: "50%", left: "0", right: "0", display: "flex", justifyContent: "space-between", padding: "0 40px", transform: "translateY(-50%)", pointerEvents: "none" }}>
                  <span
                    onClick={anteriorEscenario}
                    style={{
                      fontSize: "70px",
                      cursor: hayAnterior ? "pointer" : "default",
                      color: hayAnterior ? "#007B3E" : "#ccc",
                      pointerEvents: "auto",
                      transition: "0.3s",
                      userSelect: "none"
                    }}
                    onMouseEnter={(e) => { if (hayAnterior) e.target.style.transform = "scale(1.2)"; }}
                    onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
                  >←</span>
                  <span
                    onClick={siguienteEscenario}
                    style={{
                      fontSize: "70px",
                      cursor: haySiguiente ? "pointer" : "default",
                      color: haySiguiente ? "#007B3E" : "#ccc",
                      pointerEvents: "auto",
                      transition: "0.3s",
                      userSelect: "none"
                    }}
                    onMouseEnter={(e) => { if (haySiguiente) e.target.style.transform = "scale(1.2)"; }}
                    onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
                  >→</span>
                </div>
              </div>
            )}

            {dimensionSeleccionada && !escenario && (
              <div style={{ textAlign: "center", padding: "80px", color: "#007B3E" }}>
                <p style={{ fontWeight: "600", fontSize: "18px" }}>No hay escenarios disponibles en esta categoría por ahora.</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* FOOTER */}
      <footer style={{ backgroundColor: "#00482B", color: "white", padding: "30px 130px", marginTop: "80px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h3>Praxis</h3>
            <p style={{ fontSize: "14px" }}>Plataforma educativa con IA</p>
          </div>
          <img src={LogoUdec} alt="UDEC" style={{ width: "250px" }} />
          <div style={{ textAlign: "right", fontSize: "12px", lineHeight: "1.8" }}>
            <p>
              <a href="https://praxis-eight-kappa.vercel.app/" style={{ color: "white", fontWeight: "700" }} target="_blank" rel="noreferrer">Praxis</a>{" "}© 2026 by{" "}
              <a href="https://www.researchgate.net/profile/Hugo-Rozo-Garcia" style={{ color: "white", fontWeight: "700" }} target="_blank" rel="noreferrer">Hugo Rozo</a>
            </p>
            <p>Universidad de Cundinamarca</p>
            <p style={{ marginTop: "4px" }}>
              <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" rel="noreferrer" style={{ color: "white", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                CC BY-NC-SA 4.0
                <img src="https://mirrors.creativecommons.org/presskit/icons/cc.svg" alt="CC" style={{ width: "16px", filter: "invert(1)" }} />
                <img src="https://mirrors.creativecommons.org/presskit/icons/by.svg" alt="BY" style={{ width: "16px", filter: "invert(1)" }} />
                <img src="https://mirrors.creativecommons.org/presskit/icons/nc.svg" alt="NC" style={{ width: "16px", filter: "invert(1)" }} />
                <img src="https://mirrors.creativecommons.org/presskit/icons/sa.svg" alt="SA" style={{ width: "16px", filter: "invert(1)" }} />
              </a>
            </p>
          </div>
        </div>
      </footer>

      <style>
        {`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pop {
          0%   { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1);   opacity: 1; }
        }
        @keyframes girar {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes sellazo {
          0%   { transform: scale(2) rotate(-8deg); opacity: 0; }
          60%  { transform: scale(0.9) rotate(2deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        `}
      </style>
    </div>
  );
}