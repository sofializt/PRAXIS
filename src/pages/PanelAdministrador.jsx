import React, { useEffect, useState } from "react";
import logo from "../assets/praxis.svg";
import addIcon from "../assets/add_circle.svg";

export default function PanelAdministrador() {
  const [seccionActiva, setSeccionActiva] = useState("escenarios");
  const [escenarios, setEscenarios] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [respuestas, setRespuestas] = useState([]);

  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [idEscenarioEditando, setIdEscenarioEditando] = useState(null);

  const [nuevoEscenario, setNuevoEscenario] = useState({
    titulo: "",
    descripcion: "",
    pregunta: "",
    id_dimension: 1,
    opcion1: "",
    opcion2: ""
  });

  const [imagen1, setImagen1] = useState(null);
  const [imagen2, setImagen2] = useState(null);

  useEffect(() => {
    cargarEscenarios();
    cargarUsuarios();
    cargarRespuestas();
  }, []);

  const cargarEscenarios = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/escenarios");
      const data = await res.json();
      const formateados = data.map((item) => ({
        id: item.id_escenario,
        titulo: item.titulo,
        descripcion: item.descripcion,
        pregunta: item.pregunta,
        id_dimension: item.id_dimension,
        dimension:
          item.id_dimension === 1 ? "Pedagógica"
          : item.id_dimension === 5 ? "Autonomía Profesional"
          : item.id_dimension === 3 ? "Ética"
          : item.id_dimension === 4 ? "Equidad"
          : "Sin dimensión"
      }));
      setEscenarios(formateados);
    } catch (error) {
      console.error(error);
    }
  };

  const cargarUsuarios = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/usuarios");
      const data = await res.json();
      setUsuarios(data);
    } catch (error) {
      console.error(error);
    }
  };

  const cargarRespuestas = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/respuestas");
      const data = await res.json();
      setRespuestas(data);
    } catch (error) {
      console.error(error);
    }
  };

  const guardarEscenario = async () => {
    try {
      const usuarioAdmin = JSON.parse(localStorage.getItem("usuarioAdmin"));

      const formData = new FormData();
      formData.append("titulo", nuevoEscenario.titulo);
      formData.append("descripcion", nuevoEscenario.descripcion);
      formData.append("pregunta", nuevoEscenario.pregunta);
      formData.append("id_dimension", nuevoEscenario.id_dimension);
      formData.append("id_admin_creador", usuarioAdmin?.id_usuario);
      formData.append("opcion1", nuevoEscenario.opcion1);
      formData.append("opcion2", nuevoEscenario.opcion2);

      if (imagen1) formData.append("imagen1", imagen1);
      if (imagen2) formData.append("imagen2", imagen2);

      const url = modoEdicion
        ? `http://localhost:4000/api/escenarios/${idEscenarioEditando}`
        : "http://localhost:4000/api/escenarios";

      const method = modoEdicion ? "PUT" : "POST";

      const res = await fetch(url, { method, body: formData });
      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Error al guardar");
        return;
      }

      alert(modoEdicion ? "Escenario actualizado correctamente" : "Escenario creado correctamente");

      setMostrarModal(false);
      setModoEdicion(false);
      setIdEscenarioEditando(null);
      setNuevoEscenario({ titulo: "", descripcion: "", pregunta: "", id_dimension: 1, opcion1: "", opcion2: "" });
      setImagen1(null);
      setImagen2(null);
      cargarEscenarios();
    } catch (error) {
      console.error(error);
    }
  };

  const editarEscenario = async (item) => {
    setModoEdicion(true);
    setIdEscenarioEditando(item.id);

    try {
      const res = await fetch(`http://localhost:4000/api/opciones/${item.id}`);
      const opciones = await res.json();
      setNuevoEscenario({
        titulo: item.titulo,
        descripcion: item.descripcion,
        pregunta: item.pregunta,
        id_dimension: item.id_dimension,
        opcion1: opciones[0]?.descripcion || "",
        opcion2: opciones[1]?.descripcion || ""
      });
    } catch (error) {
      console.error(error);
      setNuevoEscenario({
        titulo: item.titulo,
        descripcion: item.descripcion,
        pregunta: item.pregunta,
        id_dimension: item.id_dimension,
        opcion1: "",
        opcion2: ""
      });
    }

    setImagen1(null);
    setImagen2(null);
    setMostrarModal(true);
  };

  const eliminarEscenario = async (id) => {
    const confirmar = window.confirm("¿Seguro que deseas eliminar este escenario?");
    if (!confirmar) return;

    try {
      const res = await fetch(`http://localhost:4000/api/escenarios/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Error al eliminar");
        return;
      }

      alert("Escenario eliminado correctamente");
      cargarEscenarios();
    } catch (error) {
      console.error(error);
    }
  };

  const cerrarSesion = () => {
    localStorage.removeItem("usuarioAdmin");
    localStorage.removeItem("usuario");
    window.location.reload();
  };

  const renderTabla = () => {
    // ── ESCENARIOS ──
    if (seccionActiva === "escenarios") {
      return (
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "center" }}>
          <thead>
            <tr style={{ backgroundColor: "#91C256", color: "#333" }}>
              <th style={{ padding: "12px" }}>ID</th>
              <th style={{ padding: "12px" }}>Título</th>
              <th style={{ padding: "12px" }}>Dimensión</th>
              <th style={{ padding: "12px" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {escenarios.map((item) => (
              <tr key={item.id} style={{ backgroundColor: "#FFFFFF", color: "#333" }}>
                <td style={{ padding: "12px" }}>{item.id}</td>
                <td style={{ padding: "12px" }}>{item.titulo}</td>
                <td style={{ padding: "12px" }}>{item.dimension}</td>
                <td style={{ padding: "12px" }}>
                  <button onClick={() => editarEscenario(item)} style={actionBtn}>Editar</button>
                  {" / "}
                  <button onClick={() => eliminarEscenario(item.id)} style={actionBtn}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    // ── USUARIOS ──
    if (seccionActiva === "usuarios") {
      return (
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "center" }}>
          <thead>
            <tr style={{ backgroundColor: "#91C256", color: "#333" }}>
              <th style={{ padding: "12px" }}>Nombre</th>
              <th style={{ padding: "12px" }}>Apellido</th>
              <th style={{ padding: "12px" }}>Correo</th>
              <th style={{ padding: "12px" }}>Municipio</th>
              <th style={{ padding: "12px" }}>Institución</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((item, index) => (
              <tr key={index} style={{ backgroundColor: "#FFFFFF", color: "#333" }}>
                <td style={{ padding: "12px" }}>{item.nombre}</td>
                <td style={{ padding: "12px" }}>{item.apellido}</td>
                <td style={{ padding: "12px" }}>{item.correo}</td>
                <td style={{ padding: "12px" }}>{item.municipio || "—"}</td>
                <td style={{ padding: "12px" }}>{item.nombre_institucion || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    // ── RESPUESTAS ──
    if (seccionActiva === "respuestas") {
      return (
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "center" }}>
          <thead>
            <tr style={{ backgroundColor: "#91C256", color: "#333" }}>
              <th style={{ padding: "12px" }}>Usuario</th>
              <th style={{ padding: "12px" }}>Escenario</th>
              <th style={{ padding: "12px" }}>Respuesta</th>
            </tr>
          </thead>
          <tbody>
            {respuestas.map((item, index) => (
              <tr key={index} style={{ backgroundColor: "#FFFFFF", color: "#333" }}>
                <td style={{ padding: "12px" }}>
                  {item.correo === "anonimo@anonimo.com" ? "Anónimo" : item.correo}
                </td>
                <td style={{ padding: "12px" }}>{item.escenario}</td>
                <td style={{ padding: "12px", textAlign: "left", maxWidth: "400px" }}>
                  {item.respuesta}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    return null;
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FFFFFF", fontFamily: "Instrument Sans, sans-serif" }}>
      <header style={{
        backgroundColor: "#007B3E",
        padding: "16px 32px",
        display: "flex",
        justifyContent: "space-between",
        color: "white",
        flexWrap: "wrap",
        alignItems: "center"
      }}>
        <img src={logo} alt="ISU Logo" style={{ height: "100px" }} />

        <nav style={{ display: "flex", gap: "50px" }}>
          <button onClick={() => setSeccionActiva("escenarios")} style={{ ...btnStyle(seccionActiva, "escenarios"), fontSize: "20px" }}>Escenarios</button>
          <button onClick={() => setSeccionActiva("usuarios")} style={{ ...btnStyle(seccionActiva, "usuarios"), fontSize: "20px" }}>Usuarios</button>
          <button onClick={() => setSeccionActiva("respuestas")} style={{ ...btnStyle(seccionActiva, "respuestas"), fontSize: "20px" }}>Respuestas</button>
        </nav>

        <button onClick={cerrarSesion} style={{ background: "none", border: "none", color: "white" }}>
          Cerrar sesión
        </button>
      </header>

      <main style={{ padding: "30px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "25px" }}>
          <h1 style={{ color: "#007B3E", fontSize: "40px", margin: 0 }}>
            {seccionActiva.toUpperCase()}
          </h1>

          {seccionActiva === "escenarios" && (
            <button
              onClick={() => {
                setModoEdicion(false);
                setMostrarModal(true);
                setNuevoEscenario({ titulo: "", descripcion: "", pregunta: "", id_dimension: 1, opcion1: "", opcion2: "" });
                setImagen1(null);
                setImagen2(null);
              }}
              style={{ background: "none", border: "none", color: "#2490A3", cursor: "pointer" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "32px" }}>Crear</span>
                <img src={addIcon} alt="Crear" style={{ width: "40px" }} />
              </div>
            </button>
          )}
        </div>

        {renderTabla()}
      </main>

      {mostrarModal && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <h2>{modoEdicion ? "Editar escenario" : "Crear escenario"}</h2>

            <input placeholder="Título" value={nuevoEscenario.titulo}
              onChange={(e) => setNuevoEscenario({ ...nuevoEscenario, titulo: e.target.value })}
              style={inputStyle}
            />

            <textarea placeholder="Descripción" value={nuevoEscenario.descripcion}
              onChange={(e) => setNuevoEscenario({ ...nuevoEscenario, descripcion: e.target.value })}
              style={inputStyle}
            />

            <textarea placeholder="Pregunta" value={nuevoEscenario.pregunta}
              onChange={(e) => setNuevoEscenario({ ...nuevoEscenario, pregunta: e.target.value })}
              style={inputStyle}
            />

            <select
              value={nuevoEscenario.id_dimension}
              onChange={(e) => setNuevoEscenario({ ...nuevoEscenario, id_dimension: Number(e.target.value) })}
              style={inputStyle}
            >
              <option value={1}>Pedagógica</option>
              <option value={5}>Autonomía Profesional</option>
              <option value={3}>Ética</option>
              <option value={4}>Equidad</option>
            </select>

            <input placeholder="Texto opción 1" value={nuevoEscenario.opcion1}
              onChange={(e) => setNuevoEscenario({ ...nuevoEscenario, opcion1: e.target.value })}
              style={inputStyle}
            />
            <input type="file" onChange={(e) => setImagen1(e.target.files[0])} />

            <input placeholder="Texto opción 2" value={nuevoEscenario.opcion2}
              onChange={(e) => setNuevoEscenario({ ...nuevoEscenario, opcion2: e.target.value })}
              style={inputStyle}
            />
            <input type="file" onChange={(e) => setImagen2(e.target.files[0])} />

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}>
              <button onClick={() => setMostrarModal(false)}>Cancelar</button>
              <button onClick={guardarEscenario}>Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function btnStyle(active, name) {
  return {
    background: "none",
    border: "none",
    color: "white",
    cursor: "pointer",
    textDecoration: active === name ? "underline" : "none"
  };
}

const actionBtn = {
  background: "none",
  border: "none",
  color: "#0E4B56",
  cursor: "pointer",
  fontWeight: "bold"
};

const inputStyle = {
  width: "100%",
  marginBottom: "12px",
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #ccc"
};

const modalOverlay = {
  position: "fixed",
  inset: 0,
  backgroundColor: "rgba(0,0,0,0.35)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
};

const modalBox = {
  width: "500px",
  backgroundColor: "white",
  padding: "30px",
  borderRadius: "12px"
};