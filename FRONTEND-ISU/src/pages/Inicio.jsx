import { useState } from "react";
import logo from "../assets/praxis.svg";
import LogoUdec from "../assets/udecblanco.png";
import qr from "../assets/qr.png";

export default function Inicio({ onSoyProfesor, onJuzga }) {
  const [menuActivo, setMenuActivo] = useState("inicio");
  const [animar, setAnimar] = useState(true);
  const [animandoProfesor, setAnimandoProfesor] = useState(false);
  const [animandoAnonimo, setAnimandoAnonimo] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);

  const manejarClickMenu = (key) => {
    setAnimar(false);
    setMenuAbierto(false);
    setTimeout(() => {
      if (key === "juzga") { handleAnonimo(); return; }
      if (key === "proponer") {
        window.open("https://forms.cloud.microsoft/r/iBJ4fHqZdq", "_blank");
        return;
      }
      setMenuActivo(key);
      setAnimar(true);
    }, 150);
  };

  const handleSoyProfesor = () => {
    setAnimandoProfesor(true);
    setTimeout(() => {
      onSoyProfesor();
      setAnimandoProfesor(false);
    }, 1800);
  };

  const handleAnonimo = () => {
    setAnimandoAnonimo(true);
    setTimeout(() => {
      onJuzga();
      setAnimandoAnonimo(false);
    }, 1800);
  };

  return (
    <div className="app">

      {/* OVERLAY PROFESOR */}
      {animandoProfesor && (
        <div className="overlay">
          <svg width="300" height="200" viewBox="0 0 500 200">
            <line x1="0" y1="170" x2="500" y2="170" stroke="#007B3E" strokeWidth="3"/>
            <text x="250" y="40" textAnchor="middle" fontSize="18" fontWeight="700" fill="#00482B">
              ¡Bienvenido, Profesor!
            </text>
          </svg>
        </div>
      )}

      {/* OVERLAY ANÓNIMO */}
      {animandoAnonimo && (
        <div className="overlay">
          <svg width="300" height="200" viewBox="0 0 500 200">
            <line x1="0" y1="170" x2="500" y2="170" stroke="#007B3E" strokeWidth="3"/>
            <text x="250" y="40" textAnchor="middle" fontSize="18" fontWeight="700" fill="#00482B">
              ¡Comienza el juicio!
            </text>
          </svg>
        </div>
      )}

      {/* NAVBAR */}
      <nav className="navbar">
        <img src={logo} alt="ISU" className="logo" />

        <button
          onClick={() => setMenuAbierto(!menuAbierto)}
          className="hamburger"
        >
          ☰
        </button>

        <div className={`nav-links ${menuAbierto ? "open" : ""}`}>
          {[
            { label: "Inicio", key: "inicio" },
            { label: "¿Qué hacemos?", key: "que" },
            { label: "Juzga", key: "juzga" },
            { label: "Proponer escenario", key: "proponer" },
          ].map(({ label, key }) => (
            <span
              key={key}
              onClick={() => manejarClickMenu(key)}
              className={menuActivo === key ? "active" : ""}
            >
              {label}
            </span>
          ))}

          <button onClick={handleSoyProfesor} className="btn-profesor">
            SOY PROFESOR
          </button>
        </div>
      </nav>

      {/* CONTENIDO */}
      <div className={`contenido ${animar ? "show" : "hide"}`}>

        {menuActivo === "inicio" && (
          <div className="inicio-box">
            <div className="placeholder" />

            <button onClick={handleAnonimo} className="btn-juicio">
              COMIENZA EL JUICIO
            </button>
          </div>
        )}

        {menuActivo === "que" && (
          <div className="seccion">
            <h1>¿Qué hacemos?</h1>

            <p>
              Este proyecto busca concientizar a los docentes sobre la inteligencia artificial en la educación.
            </p>

            <div className="grid">
              {[
                { titulo: "Escenarios educativos", texto: "Casos reales sobre IA en el aula." },
                { titulo: "Toma de decisiones", texto: "El docente analiza y decide." },
                { titulo: "Reflexión crítica", texto: "Evaluación ética y pedagógica." },
              ].map((c, i) => (
                <div key={i} className="card">
                  <h3>{c.titulo}</h3>
                  <p>{c.texto}</p>
                </div>
              ))}
            </div>

            <h2>Problemática</h2>
            <p>La IA avanza más rápido que la formación docente.</p>

            <h2>Objetivo</h2>
            <p>Promover decisiones informadas en escenarios educativos.</p>

            <img src={qr} className="qr" />
          </div>
        )}

        <img src={LogoUdec} className="udec" />
      </div>

      {/* FOOTER */}
      <footer className="footer">
        <h3>Praxis</h3>
        <p>Plataforma educativa con IA</p>
      </footer>

      {/* ESTILOS RESPONSIVE */}
      <style>{`
        .app { font-family: Montserrat, sans-serif; }

        /* NAVBAR */
        .navbar {
          background: #007B3E;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 20px;
          height: 80px;
        }

        .logo { height: 60px; }

        .nav-links {
          display: flex;
          gap: 40px;
          align-items: center;
        }

        .nav-links span {
          color: white;
          cursor: pointer;
          font-weight: 600;
        }

        .active {
          border-bottom: 2px solid white;
        }

        .btn-profesor {
          background: white;
          color: #00482B;
          border: none;
          padding: 10px 20px;
          border-radius: 30px;
          font-weight: bold;
          cursor: pointer;
        }

        .hamburger {
          display: none;
          font-size: 28px;
          background: none;
          border: none;
          color: white;
        }

        /* CONTENIDO */
        .contenido {
          text-align: center;
          transition: 0.3s;
        }

        .inicio-box {
          width: 90%;
          max-width: 600px;
          margin: auto;
        }

        .placeholder {
          height: 250px;
          background: #ddd;
          border-radius: 10px;
        }

        .btn-juicio {
          margin-top: 20px;
          background: #007B3E;
          color: white;
          border: none;
          padding: 15px 40px;
          border-radius: 40px;
          font-size: 18px;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 20px;
          margin-top: 30px;
        }

        .card {
          background: #f5f5f5;
          padding: 20px;
          border-radius: 15px;
        }

        .qr { width: 140px; margin-top: 20px; }

        .udec { width: 160px; margin: 30px auto; display: block; }

        .footer {
          background: #00482B;
          color: white;
          text-align: center;
          padding: 30px;
        }

        .overlay {
          position: fixed;
          inset: 0;
          background: #F0FBF5;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
        }

        /* RESPONSIVE */
        @media (max-width: 768px) {

          .nav-links {
            display: none;
            flex-direction: column;
            position: absolute;
            top: 80px;
            left: 0;
            right: 0;
            background: #007B3E;
            padding: 20px;
          }

          .nav-links.open {
            display: flex;
          }

          .hamburger {
            display: block;
          }

          .navbar {
            height: 65px;
          }

          .btn-juicio {
            font-size: 14px;
            padding: 12px 25px;
          }
        }
      `}</style>
    </div>
  );
}