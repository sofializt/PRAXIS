import React, { useEffect, useState } from "react";

// ── Minimal style constants ──────────────────────────────────────────────────
const C = {
  green:      "#007B3E",
  greenLight: "#e8f5ee",
  greenMid:   "#91C256",
  teal:       "#2490A3",
  text:       "#1a2e23",
  muted:      "#6b7c74",
  border:     "#d4e8dc",
  white:      "#ffffff",
  rowAlt:     "#f4faf7",
  danger:     "#c0392b",
};

const font = "'DM Sans', sans-serif";

// ── Helpers ──────────────────────────────────────────────────────────────────
const isAnon = (correo = "") =>
  correo.startsWith("anonimo_") || correo === "anonimo@anonimo.com";

// Replace raw anon correo with "Anónimo #N" using a stable counter per render
function labelAnonimos(usuarios) {
  let n = 0;
  return usuarios.map((u) => ({
    ...u,
    _display: isAnon(u.correo) ? `Anónimo #${++n}` : `${u.nombre} ${u.apellido}`,
    _isAnon: isAnon(u.correo),
  }));
}

// ── Pill component ───────────────────────────────────────────────────────────
function Pill({ children, color = C.green }) {
  return (
    <span style={{
      display: "inline-block",
      padding: "2px 10px",
      borderRadius: 20,
      fontSize: 12,
      fontWeight: 600,
      background: color + "18",
      color,
      border: `1px solid ${color}30`,
    }}>
      {children}
    </span>
  );
}

// ── Empty state ──────────────────────────────────────────────────────────────
function Empty({ text }) {
  return (
    <tr>
      <td colSpan={10} style={{ textAlign: "center", padding: "48px 0", color: C.muted, fontSize: 15 }}>
        {text}
      </td>
    </tr>
  );
}

// ── Modal ────────────────────────────────────────────────────────────────────
function Modal({ title, onClose, onSave, children }) {
  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "rgba(0,0,0,.45)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 1000,
    }}>
      <div style={{
        width: 540, maxHeight: "90vh", overflowY: "auto",
        background: C.white,
        borderRadius: 16,
        boxShadow: "0 24px 64px rgba(0,0,0,.18)",
        padding: "32px 36px",
        fontFamily: font,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ margin: 0, color: C.text, fontSize: 22, fontWeight: 700 }}>{title}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: C.muted }}>✕</button>
        </div>
        {children}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 28 }}>
          <button onClick={onClose} style={btnOutline}>Cancelar</button>
          <button onClick={onSave} style={btnPrimary}>Guardar</button>
        </div>
      </div>
    </div>
  );
}

// ── Button styles ────────────────────────────────────────────────────────────
const btnPrimary = {
  background: C.green, color: C.white,
  border: "none", borderRadius: 8,
  padding: "10px 22px", fontWeight: 600,
  fontSize: 14, cursor: "pointer", fontFamily: font,
};
const btnOutline = {
  background: "none", color: C.green,
  border: `1.5px solid ${C.green}`, borderRadius: 8,
  padding: "10px 22px", fontWeight: 600,
  fontSize: 14, cursor: "pointer", fontFamily: font,
};
const inputStyle = {
  width: "100%", marginBottom: 14,
  padding: "11px 14px",
  borderRadius: 8, border: `1.5px solid ${C.border}`,
  fontSize: 14, fontFamily: font,
  outline: "none", boxSizing: "border-box",
  color: C.text,
};

// ── Table wrapper ────────────────────────────────────────────────────────────
function Table({ headers, children }) {
  return (
    <div style={{ overflowX: "auto", borderRadius: 12, border: `1px solid ${C.border}` }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: font }}>
        <thead>
          <tr style={{ background: C.green }}>
            {headers.map((h) => (
              <th key={h} style={{
                padding: "14px 16px", textAlign: "left",
                color: C.white, fontWeight: 600, fontSize: 13,
                letterSpacing: ".4px", whiteSpace: "nowrap",
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

function TR({ children, alt }) {
  return (
    <tr style={{ background: alt ? C.rowAlt : C.white, borderBottom: `1px solid ${C.border}` }}>
      {children}
    </tr>
  );
}

function TD({ children, muted, left }) {
  return (
    <td style={{
      padding: "13px 16px", fontSize: 14,
      color: muted ? C.muted : C.text,
      textAlign: left ? "left" : "left",
      verticalAlign: "top",
    }}>{children ?? "—"}</td>
  );
}

// ── Main component ───────────────────────────────────────────────────────────
export default function PanelAdministrador() {
  const [seccion, setSeccion]       = useState("escenarios");
  const [escenarios, setEscenarios] = useState([]);
  const [usuarios, setUsuarios]     = useState([]);
  const [respuestas, setRespuestas] = useState([]);

  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

  const [modal, setModal]           = useState(false);
  const [editMode, setEditMode]     = useState(false);
  const [editId, setEditId]         = useState(null);
  const [form, setForm]             = useState({ titulo:"", descripcion:"", pregunta:"", id_dimension:1, opcion1:"", opcion2:"" });
  const [img1, setImg1]             = useState(null);
  const [img2, setImg2]             = useState(null);

  useEffect(() => {
    cargarEscenarios();
    cargarUsuarios();
    cargarRespuestas();
  }, []);

  const API = "https://backend-isu.onrender.com/api";

  const cargarEscenarios = async () => {
    try {
      const data = await (await fetch(`${API}/escenarios`)).json();
      setEscenarios(data.map((i) => ({
        id: i.id_escenario, titulo: i.titulo,
        descripcion: i.descripcion, pregunta: i.pregunta,
        id_dimension: i.id_dimension,
        dimension: { 1:"Pedagógica", 5:"Autonomía Profesional", 3:"Ética", 4:"Equidad" }[i.id_dimension] ?? "—",
      })));
    } catch (e) { console.error(e); }
  };

  const cargarUsuarios = async () => {
    try { setUsuarios(await (await fetch(`${API}/usuarios`)).json()); }
    catch (e) { console.error(e); }
  };

  const cargarRespuestas = async () => {
    try { setRespuestas(await (await fetch(`${API}/respuestas`)).json()); }
    catch (e) { console.error(e); }
  };

  const guardar = async () => {
    try {
      const admin = JSON.parse(localStorage.getItem("usuarioAdmin"));
      const fd = new FormData();
      Object.entries({ ...form, id_admin_creador: admin?.id_usuario }).forEach(([k,v]) => fd.append(k, v));
      if (img1) fd.append("imagen1", img1);
      if (img2) fd.append("imagen2", img2);

      const url    = editMode ? `${API}/escenarios/${editId}` : `${API}/escenarios`;
      const method = editMode ? "PUT" : "POST";
      const res    = await fetch(url, { method, body: fd });
      const data   = await res.json();

      if (!res.ok) { alert(data.message || "Error"); return; }
      alert(editMode ? "Actualizado ✓" : "Creado ✓");
      cerrarModal();
      cargarEscenarios();
    } catch (e) { console.error(e); }
  };

  const editar = async (item) => {
    setEditMode(true); setEditId(item.id);
    try {
      const ops = await (await fetch(`${API}/opciones/${item.id}`)).json();
      setForm({ ...item, opcion1: ops[0]?.descripcion||"", opcion2: ops[1]?.descripcion||"" });
    } catch { setForm({ ...item, opcion1:"", opcion2:"" }); }
    setImg1(null); setImg2(null); setModal(true);
  };

  const eliminar = async (id) => {
    if (!window.confirm("¿Eliminar este escenario?")) return;
    try {
      const res  = await fetch(`${API}/escenarios/${id}`, { method:"DELETE" });
      const data = await res.json();
      if (!res.ok) { alert(data.message || "Error"); return; }
      alert("Eliminado ✓");
      cargarEscenarios();
    } catch (e) { console.error(e); }
  };

  const cerrarModal = () => {
    setModal(false); setEditMode(false); setEditId(null);
    setForm({ titulo:"", descripcion:"", pregunta:"", id_dimension:1, opcion1:"", opcion2:"" });
    setImg1(null); setImg2(null);
  };

  const cerrarSesion = () => {
    localStorage.removeItem("usuarioAdmin");
    localStorage.removeItem("usuario");
    window.location.reload();
  };

  // Labeled usuarios
  const usuariosLabeled = labelAnonimos(usuarios);

  // ── Nav tabs ──
  const tabs = ["escenarios", "usuarios", "respuestas"];

  return (
    <>
      {/* Google Font */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');`}</style>

      <div style={{ minHeight:"100vh", background:"#f0f7f3", fontFamily: font }}>

        {/* ── Header ── */}
        <header style={{
          background: C.green,
          padding: "0 36px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          height: 68,
          boxShadow: "0 2px 12px rgba(0,80,40,.18)",
        }}>
          {/* Logo text */}
          <div style={{ color: C.white, fontWeight: 700, fontSize: 22, letterSpacing: 1 }}>
            PRAXIS <span style={{ fontWeight: 400, opacity: .7, fontSize: 14 }}>Admin</span>
          </div>

          {/* Tabs */}
          <nav style={{ display:"flex", gap: 4 }}>
            {tabs.map((t) => (
              <button key={t} onClick={() => setSeccion(t)} style={{
                background: seccion===t ? "rgba(255,255,255,.15)" : "none",
                border: "none",
                borderBottom: seccion===t ? `3px solid ${C.greenMid}` : "3px solid transparent",
                color: C.white,
                padding: "0 20px", height: 68,
                fontFamily: font, fontWeight: 600, fontSize: 15,
                cursor: "pointer", textTransform: "capitalize",
                transition: "all .2s",
              }}>{t}</button>
            ))}
          </nav>

          <button onClick={cerrarSesion} style={{
            background: "rgba(255,255,255,.1)",
            border: "1px solid rgba(255,255,255,.25)",
            color: C.white, borderRadius: 8,
            padding: "8px 16px", cursor: "pointer",
            fontFamily: font, fontSize: 13, fontWeight: 500,
          }}>Cerrar sesión</button>
        </header>

        {/* ── Main ── */}
        <main style={{ padding: "32px 36px" }}>

          {/* Section header */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom: 24 }}>
            <h1 style={{ margin:0, color: C.text, fontSize: 28, fontWeight: 700, textTransform:"capitalize" }}>
              {seccion}
            </h1>
            {seccion==="escenarios" && (
              <button onClick={() => { setEditMode(false); setModal(true); }} style={btnPrimary}>
                + Nuevo escenario
              </button>
            )}
          </div>

          {/* ── ESCENARIOS ── */}
          {seccion==="escenarios" && (
            <Table headers={["ID","Título","Dimensión","Acciones"]}>
              {escenarios.length===0 ? <Empty text="Sin escenarios"/> :
                escenarios.map((item, i) => (
                  <TR key={item.id} alt={i%2===1}>
                    <TD><Pill>{item.id}</Pill></TD>
                    <TD>{item.titulo}</TD>
                    <TD><Pill color={C.teal}>{item.dimension}</Pill></TD>
                    <TD>
                      <button onClick={() => editar(item)} style={{ ...btnOutline, padding:"5px 14px", fontSize:13, marginRight:8 }}>Editar</button>
                      <button onClick={() => eliminar(item.id)} style={{ ...btnOutline, padding:"5px 14px", fontSize:13, color: C.danger, borderColor: C.danger }}>Eliminar</button>
                    </TD>
                  </TR>
                ))
              }
            </Table>
          )}

          {/* ── USUARIOS ── */}
          {seccion==="usuarios" && (
            <Table headers={["Usuario","Correo","Municipio","Institución","Rol"]}>
              {usuariosLabeled.length===0 ? <Empty text="Sin usuarios"/> :
                usuariosLabeled.map((u, i) => (
                  <TR key={i} alt={i%2===1}>
                    <TD>
                      <span style={{ fontWeight: u._isAnon ? 400 : 600 }}>
                        {u._display}
                      </span>
                    </TD>
                    <TD muted={u._isAnon}>{u._isAnon ? null : u.correo}</TD>
                    <TD muted={u._isAnon}>{u._isAnon ? null : u.municipio}</TD>
                    <TD muted={u._isAnon}>{u._isAnon ? null : u.nombre_institucion}</TD>
                    <TD>
                      <Pill color={u._isAnon ? C.muted : C.green}>
                        {u._isAnon ? "Anónimo" : (u.nombre_rol || "Docente")}
                      </Pill>
                    </TD>
                  </TR>
                ))
              }
            </Table>
          )}

          {/* ── RESPUESTAS ── */}
          {seccion==="respuestas" && (() => {
            // Build unique users from respuestas
            let anonCount = 0;
            const seen = {};
            const usuariosRespuestas = [];
            respuestas.forEach((r) => {
              const key = r.correo;
              if (!seen[key]) {
                seen[key] = true;
                const anon = isAnon(r.correo);
                usuariosRespuestas.push({
                  correo: r.correo,
                  _display: anon ? `Anónimo #${++anonCount}` : r.correo,
                  _isAnon: anon,
                  municipio: r.municipio,
                  institucion: r.nombre_institucion,
                });
              }
            });

            const respuestasFiltradas = usuarioSeleccionado
              ? respuestas.filter((r) => r.correo === usuarioSeleccionado.correo)
              : [];

            return (
              <div style={{ display:"flex", gap:24, alignItems:"flex-start" }}>

                {/* Left: user list */}
                <div style={{
                  width: 260, flexShrink: 0,
                  background: C.white, borderRadius:12,
                  border:`1px solid ${C.border}`,
                  overflow:"hidden",
                }}>
                  <div style={{
                    background: C.green, color: C.white,
                    padding:"12px 16px", fontWeight:700, fontSize:13,
                    letterSpacing:".4px",
                  }}>USUARIOS ({usuariosRespuestas.length})</div>

                  <div style={{ maxHeight:520, overflowY:"auto" }}>
                    {usuariosRespuestas.length===0
                      ? <p style={{ padding:16, color:C.muted, fontSize:13 }}>Sin datos</p>
                      : usuariosRespuestas.map((u, i) => {
                          const active = usuarioSeleccionado?.correo === u.correo;
                          const count  = respuestas.filter(r=>r.correo===u.correo).length;
                          return (
                            <div key={i} onClick={() => setUsuarioSeleccionado(active ? null : u)}
                              style={{
                                padding:"12px 16px",
                                borderBottom:`1px solid ${C.border}`,
                                cursor:"pointer",
                                background: active ? C.greenLight : "none",
                                borderLeft: active ? `4px solid ${C.green}` : "4px solid transparent",
                                transition:"all .15s",
                              }}>
                              <div style={{ fontWeight:600, fontSize:13, color: active ? C.green : C.text }}>
                                {u._display}
                              </div>
                              <div style={{ fontSize:12, color:C.muted, marginTop:2 }}>
                                {count} respuesta{count!==1?"s":""}
                              </div>
                            </div>
                          );
                        })
                    }
                  </div>
                </div>

                {/* Right: respuestas del usuario seleccionado */}
                <div style={{ flex:1 }}>
                  {!usuarioSeleccionado ? (
                    <div style={{
                      background: C.white, borderRadius:12,
                      border:`1px solid ${C.border}`,
                      padding:"48px 32px", textAlign:"center",
                      color:C.muted, fontSize:15,
                    }}>
                      ← Selecciona un usuario para ver sus respuestas
                    </div>
                  ) : (
                    <>
                      {/* User info card */}
                      <div style={{
                        background: C.white, borderRadius:12,
                        border:`1px solid ${C.border}`,
                        padding:"16px 20px", marginBottom:16,
                        display:"flex", alignItems:"center", gap:16,
                      }}>
                        <div style={{
                          width:42, height:42, borderRadius:"50%",
                          background: usuarioSeleccionado._isAnon ? C.muted+"22" : C.green+"22",
                          display:"flex", alignItems:"center", justifyContent:"center",
                          fontSize:18,
                        }}>
                          {usuarioSeleccionado._isAnon ? "👤" : "🧑‍🏫"}
                        </div>
                        <div>
                          <div style={{ fontWeight:700, fontSize:15, color:C.text }}>
                            {usuarioSeleccionado._display}
                          </div>
                          {!usuarioSeleccionado._isAnon && (
                            <div style={{ fontSize:12, color:C.muted, marginTop:2 }}>
                              {usuarioSeleccionado.municipio || "—"} · {usuarioSeleccionado.institucion || "—"}
                            </div>
                          )}
                        </div>
                        <Pill color={usuarioSeleccionado._isAnon ? C.muted : C.green}>
                          {respuestasFiltradas.length} respuesta{respuestasFiltradas.length!==1?"s":""}
                        </Pill>
                      </div>

                      {/* Respuestas cards */}
                      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                        {respuestasFiltradas.map((r, i) => (
                          <div key={i} style={{
                            background: C.white, borderRadius:12,
                            border:`1px solid ${C.border}`,
                            padding:"16px 20px",
                          }}>
                            <div style={{
                              fontSize:12, fontWeight:700, color:C.teal,
                              textTransform:"uppercase", letterSpacing:".5px", marginBottom:8,
                            }}>{r.escenario}</div>
                            <div style={{ fontSize:14, color:C.text, lineHeight:1.6 }}>
                              {r.respuesta}
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>

              </div>
            );
          })()}

        </main>
      </div>

      {/* ── Modal ── */}
      {modal && (
        <Modal
          title={editMode ? "Editar escenario" : "Crear escenario"}
          onClose={cerrarModal}
          onSave={guardar}
        >
          {[
            ["titulo","Título","input"],
            ["descripcion","Descripción","textarea"],
            ["pregunta","Pregunta","textarea"],
          ].map(([key, placeholder, tag]) => (
            tag==="textarea"
              ? <textarea key={key} placeholder={placeholder} value={form[key]}
                  onChange={(e)=>setForm({...form,[key]:e.target.value})}
                  style={{...inputStyle, minHeight:80, resize:"vertical"}}/>
              : <input key={key} placeholder={placeholder} value={form[key]}
                  onChange={(e)=>setForm({...form,[key]:e.target.value})}
                  style={inputStyle}/>
          ))}

          <select value={form.id_dimension}
            onChange={(e)=>setForm({...form,id_dimension:Number(e.target.value)})}
            style={inputStyle}>
            <option value={1}>Pedagógica</option>
            <option value={5}>Autonomía Profesional</option>
            <option value={3}>Ética</option>
            <option value={4}>Equidad</option>
          </select>

          {[["opcion1","Opción 1",setImg1],["opcion2","Opción 2",setImg2]].map(([key,label,setImg])=>(
            <div key={key} style={{ marginBottom:14 }}>
              <input placeholder={label} value={form[key]}
                onChange={(e)=>setForm({...form,[key]:e.target.value})}
                style={{...inputStyle, marginBottom:6}}/>
              <input type="file" onChange={(e)=>setImg(e.target.files[0])}
                style={{ fontSize:13, color: C.muted }}/>
            </div>
          ))}
        </Modal>
      )}
    </>
  );
}
