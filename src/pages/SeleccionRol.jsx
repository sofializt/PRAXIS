import logo from "../assets/praxis.svg";
import adminIcon from "../assets/Lock.svg";
import docenteIcon from "../assets/User.svg";

export default function SeleccionRol({ elegirRol }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#C7EDE8",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "40px",
        fontFamily: "Instrument Sans, sans-serif",
        color: "#1693A5"
      }}
    >
      {/* ✅ Logo centrado */}
      <img
        src={logo}
        alt="Logo"
        style={{
          width: "120px",
          marginBottom: "20px"
        }}
      />

      {/* ✅ Texto debajo */}
      <h1
        style={{
          fontSize: "32px",
          marginBottom: "60px",
          color: "#1693A5"
        }}
      >
        Ingresar como:
      </h1>

      {/* ✅ Tarjetas */}
      <div
        style={{
          display: "flex",
          gap: "300px"
        }}
      >
        {/* ADMIN */}
        <div
          onClick={() => elegirRol(2)}
          style={{
            width: "350px",
            height: "250px",
            backgroundColor: "#C7EDE8",
            border: "5px solid #1693A5",
            borderRadius: "12px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
          }}
        >
          <div style={{ textAlign: "center" }}>
            <img
              src={adminIcon}
              alt="Administrador"
              style={{
                width: "80px",
                marginBottom: "20px"
              }}
            />
            <p
              style={{
                fontSize: "28px",
                fontWeight: "bold",
                margin: 0,
                color: "#1693A5"
              }}
            >
              Administrador
            </p>
          </div>
        </div>

        {/* DOCENTE */}
        <div
          onClick={() => elegirRol(3)}
          style={{
            width: "350px",
            height: "250px",
            backgroundColor: "#1693A5",
            border: "2px solid #1693A5",
            borderRadius: "12px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
          }}
        >
          <div style={{ textAlign: "center" }}>
            <img
              src={docenteIcon}
              alt="Docente"
              style={{
                width: "80px",
                marginBottom: "20px"
              }}
            />
            <p
              style={{
                fontSize: "28px",
                fontWeight: "bold",
                margin: 0,
                color: "#C7EDE8"
              }}
            >
              Docente
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}