import { useEffect, useState } from "react";
import logo from "../assets/praxis.svg";
import LogoUdec from "../assets/udecblanco.png";

const DIMENSIONES = [
  { id: 1, nombre: "Pedagógica" },
  { id: 5, nombre: "Autonomía Profesional" },
  { id: 3, nombre: "Ética" },
  { id: 4, nombre: "Equidad" },
];

export default function Escenarios({ onCerrarSesion }) {
  const [escenarios, setEscenarios] = useState([]);
  const [indiceActual, setIndiceActual] = useState(0);
  const [opciones, setOpciones] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [yaRespondio, setYaRespondio] = useState(false);
  const [respuestaTexto, setRespuestaTexto] = useState("");
  const [misRespuestas, setMisRespuestas] = useState([]);
  const [dimensionSeleccionada, setDimensionSeleccionada] = useState(null);

  useEffect(() => {
    cargarEscenarios();
    const id_usuario_raw = localStorage.getItem("id_usuario");
    const id_usuario = id_usuario_raw ? Number(id_usuario_raw) : null;
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
      const res = await fetch("https://backend-isu.onrender.com/api/escenarios");
      const data = await res.json();
      setEscenarios(data);
    } catch (error) {
      console.error(error);
    }
  };

  const cargarOpciones = async (idEscenario) => {
    try {
      const res = await fetch(`https://backend-isu.onrender.com/api/opciones/${idEscenario}`);
      const data = await res.json();
      setOpciones(data);
    } catch (error) {
      console.error(error);
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
    const escenario = escenariosFiltrados[indiceActual];
    if (!escenario) return;

    const ya = misRespuestas.find(
      (r) => r.id_escenario === escenario.id_escenario
    );

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
    if (yaRespondio) return;

    const escenario = escenariosFiltrados[indiceActual];
    const id_usuario_raw = localStorage.getItem("id_usuario");
    const id_usuario = id_usuario_raw ? Number(id_usuario_raw) : null;
    const id_rol = localStorage.getItem("id_rol") ? Number(localStorage.getItem("id_rol")) : null;

    const opcionElegida = opciones.find((op) => op.id_opcion === idOpcion);

    // Usuario anónimo: mostrar respuesta visualmente sin guardar en BD
    if (!id_usuario) {
      setSelectedOption(idOpcion);
      setYaRespondio(true);
      setRespuestaTexto(opcionElegida?.descripcion || "Respuesta guardada");
      return;
    }

    try {
      const res = await fetch("https://backend-isu.onrender.com/api/respuestas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_usuario,
          id_rol,
          id_opcion: idOpcion,
          id_escenario: escenario.id_escenario
        })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      setSelectedOption(idOpcion);
      setYaRespondio(true);
      setRespuestaTexto(opcionElegida?.descripcion || "Respuesta guardada");
      cargarMisRespuestas(id_usuario);

    } catch (error) {
      console.error(error);
    }
  };

  const siguienteEscenario = () => {
    if (indiceActual < escenariosFiltrados.length - 1) setIndiceActual(indiceActual + 1);
  };

  const anteriorEscenario = () => {
    if (indiceActual > 0) setIndiceActual(indiceActual - 1);
  };

  const cerrarSesion = () => {
    localStorage.removeItem("id_usuario");
    localStorage.removeItem("id_rol");
    localStorage.removeItem("usuario");
    onCerrarSesion();
  };

  const escenariosFiltrados = dimensionSeleccionada
    ? escenarios.filter((e) => e.id_dimension === dimensionSeleccionada)
    : escenarios;

  const escenario = escenariosFiltrados[indiceActual];

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#FFFFFF",
      fontFamily: "Montserrat, sans-serif",
      display: "flex",
      flexDirection: "column"
    }}>

      {/* HEADER */}
      <div style={{
        backgroundColor: "#007B3E",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 130px",
        height: "140px"
      }}>
        <img src={logo} alt="ISU" style={{ height: "120px" }} />

        <button
          onClick={cerrarSesion}
          style={{
            backgroundColor: "white",
            color: "#00482B",
            border: "none",
            borderRadius: "25px",
            padding: "12px 26px",
            fontWeight: "700",
            fontSize: "15px",
            cursor: "pointer",
            transition: "0.3s"
          }}
          onMouseEnter={(e) => e.target.style.transform = "scale(1.08)"}
          onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
        >
          Cerrar sesión
        </button>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div style={{ flex: 1 }}>

        {/* MENÚ */}
        {!dimensionSeleccionada && (
          <div style={{ padding: "70px 80px", textAlign: "center" }}>
            <h2 style={{ color: "#00482B", marginBottom: "50px" }}>
              Selecciona una categoría
            </h2>

            <div style={{
              display: "flex",
              gap: "40px",
              justifyContent: "center",
              flexWrap: "wrap"
            }}>
              {DIMENSIONES.map((dim) => (
                <div
                  key={dim.id}
                  onClick={() => { setDimensionSeleccionada(dim.id); setIndiceActual(0); }}
                  style={{
                    backgroundColor: "#007B3E",
                    color: "white",
                    padding: "60px 70px",
                    borderRadius: "18px",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "20px",
                    minWidth: "220px",
                    transition: "all 0.3s",
                    boxShadow: "0 6px 15px rgba(0,0,0,0.15)"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-8px) scale(1.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0) scale(1)";
                  }}
                >
                  {dim.nombre}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ESCENARIO */}
        {dimensionSeleccionada && escenario && (
          <div style={{ animation: "fadeIn 0.5s ease" }}>

            {/* VOLVER */}
            <div style={{ padding: "20px 130px" }}>
              <span
                onClick={() => { setDimensionSeleccionada(null); setIndiceActual(0); }}
                style={{ cursor: "pointer", color: "#007B3E", fontWeight: "600" }}
              >
                ← Volver a categorías
              </span>
            </div>

            {/* BARRA CATEGORÍA */}
            <div style={{
              backgroundColor: "#FBE122",
              textAlign: "center",
              padding: "18px",
              fontWeight: "700",
              fontSize: "20px",
              color: "#00482B",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
            }}>
              {DIMENSIONES.find((d) => d.id === dimensionSeleccionada)?.nombre}
            </div>

            <div style={{ padding: "30px 130px", maxWidth: "1000px", margin: "0 auto" }}>
              <h2 style={{ color: "#00482B", textAlign: "center" }}>
                {escenario.titulo}
              </h2>

              <div style={{
                backgroundColor: "#F5F5F5",
                borderRadius: "14px",
                padding: "20px",
                marginTop: "20px"
              }}>
                <p style={{ lineHeight: "1.7" }}>
                  <strong style={{ color: "#007B3E" }}>Situación: </strong>
                  {escenario.descripcion}
                </p>
              </div>

              <p style={{
                textAlign: "center",
                fontWeight: "600",
                marginTop: "20px",
                color: "#00482B"
              }}>
                {escenario.pregunta}
              </p>
            </div>

            {/* OPCIONES */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "30px",
              padding: "0 130px",
              maxWidth: "1000px",
              margin: "0 auto"
            }}>
              {opciones.map((opcion) => (
                <div
                  key={opcion.id_opcion}
                  onClick={() => seleccionar(opcion.id_opcion)}
                  style={{
                    backgroundColor: "white",
                    borderRadius: "16px",
                    overflow: "hidden",
                    border: selectedOption === opcion.id_opcion
                      ? "4px solid #007B3E"
                      : "4px solid transparent",
                    cursor: yaRespondio ? "default" : "pointer",
                    transition: "all 0.3s",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
                  }}
                  onMouseEnter={(e) => {
                    if (!yaRespondio) e.currentTarget.style.transform = "translateY(-6px) scale(1.02)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0) scale(1)";
                  }}
                >
                  <img
                    src={`https://backend-isu.onrender.com/uploads/${opcion.imagen}`}
                    alt=""
                    style={{ width: "100%", height: "230px", objectFit: "cover" }}
                  />
                  <div style={{ padding: "18px" }}>
                    <p style={{ margin: 0 }}>{opcion.descripcion}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* RESPUESTA */}
            {yaRespondio && (
              <div style={{
                marginTop: "25px",
                textAlign: "center",
                color: "#00482B",
                fontWeight: "600",
                animation: "pop 0.4s ease"
              }}>
                ✔ Tu respuesta fue: {respuestaTexto}
              </div>
            )}

            {/* FLECHAS */}
            <div style={{
              position: "fixed",
              top: "50%",
              left: "0",
              right: "0",
              display: "flex",
              justifyContent: "space-between",
              padding: "0 40px",
              transform: "translateY(-50%)",
              pointerEvents: "none"
            }}>
              <span
                onClick={anteriorEscenario}
                style={{
                  fontSize: "70px",
                  cursor: "pointer",
                  color: "#007B3E",
                  pointerEvents: "auto",
                  transition: "0.3s"
                }}
                onMouseEnter={(e) => e.target.style.transform = "scale(1.2)"}
                onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
              >
                ←
              </span>

              <span
                onClick={siguienteEscenario}
                style={{
                  fontSize: "70px",
                  cursor: "pointer",
                  color: "#007B3E",
                  pointerEvents: "auto",
                  transition: "0.3s"
                }}
                onMouseEnter={(e) => e.target.style.transform = "scale(1.2)"}
                onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
              >
                →
              </span>
            </div>
          </div>
        )}

      </div>

      {/* FOOTER */}
      <footer style={{
        backgroundColor: "#00482B",
        color: "white",
        padding: "30px 130px",
        marginTop: "60px"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h3 style={{ margin: "0 0 8px 0" }}>Praxis</h3>
            <p style={{ fontSize: "14px", margin: 0 }}>Plataforma educativa con IA</p>
          </div>

          <img src={LogoUdec} alt="UDEC" style={{ width: "250px" }} />

          <div style={{ textAlign: "right", fontSize: "14px" }}>
            <p style={{ margin: "0 0 4px 0" }}>© 2026</p>
            <p style={{ margin: 0 }}>Universidad de Cundinamarca</p>
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
        `}
      </style>
    </div>
  );
}