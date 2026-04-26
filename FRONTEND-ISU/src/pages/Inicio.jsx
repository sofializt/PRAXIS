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
    <div style={{ fontFamily: "Montserrat, sans-serif" }}>

      {/* OVERLAY PROFESOR */}
      {animandoProfesor && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "#F0FBF5", zIndex: 9999,
          display: "flex", alignItems: "center", justifyContent: "center",
          pointerEvents: "none"
        }}>
          <svg width="300" height="200" viewBox="0 0 500 200">
            <line x1="0" y1="170" x2="500" y2="170" stroke="#007B3E" strokeWidth="3"/>
            <g>
              <rect x="390" y="90" width="60" height="80" rx="4" fill="#DFF5EA" stroke="#007B3E" strokeWidth="2.5"/>
              <rect x="385" y="86" width="70" height="84" rx="5" fill="none" stroke="#00482B" strokeWidth="3"/>
              <circle cx="398" cy="132" r="4" fill="#007B3E"/>
              <line x1="420" y1="90" x2="420" y2="170" stroke="#007B3E" strokeWidth="1.5" strokeDasharray="4 3"/>
            </g>
            <g style={{ animation: "caminar 1.8s ease-in-out forwards" }}>
              <ellipse cx="0" cy="172" rx="18" ry="5" fill="rgba(0,0,0,0.12)"/>
              <rect x="-10" y="120" width="20" height="28" rx="4" fill="#007B3E"/>
              <circle cx="0" cy="108" r="14" fill="#F5CBA7"/>
              <circle cx="-4" cy="106" r="2" fill="#333"/>
              <circle cx="4" cy="106" r="2" fill="#333"/>
              <path d="M -4 113 Q 0 117 4 113" stroke="#333" strokeWidth="1.5" fill="none"/>
              <rect x="-13" y="94" width="26" height="8" rx="4" fill="#4A2C0A"/>
              <polygon points="0,134 -4,148 0,145 4,148" fill="#FFD700"/>
              <line x1="-10" y1="128" x2="-22" y2="145" stroke="#F5CBA7" strokeWidth="5" strokeLinecap="round" style={{ animation: "brazoIzq 0.4s ease-in-out infinite alternate", transformOrigin: "-10px 128px" }}/>
              <line x1="10" y1="128" x2="22" y2="145" stroke="#F5CBA7" strokeWidth="5" strokeLinecap="round" style={{ animation: "brazoDer 0.4s ease-in-out infinite alternate", transformOrigin: "10px 128px" }}/>
              <line x1="-5" y1="148" x2="-10" y2="170" stroke="#00482B" strokeWidth="6" strokeLinecap="round" style={{ animation: "piernaIzq 0.4s ease-in-out infinite alternate", transformOrigin: "-5px 148px" }}/>
              <line x1="5" y1="148" x2="10" y2="170" stroke="#00482B" strokeWidth="6" strokeLinecap="round" style={{ animation: "piernaDer 0.4s ease-in-out infinite alternate", transformOrigin: "5px 148px" }}/>
            </g>
            <text x="250" y="40" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontSize="18" fontWeight="700" fill="#00482B">¡Bienvenido, Profesor!</text>
          </svg>
        </div>
      )}

      {/* OVERLAY ANÓNIMO */}
      {animandoAnonimo && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "#F0FBF5", zIndex: 9999,
          display: "flex", alignItems: "center", justifyContent: "center",
          pointerEvents: "none"
        }}>
          <svg width="300" height="200" viewBox="0 0 500 200">
            <line x1="0" y1="170" x2="500" y2="170" stroke="#007B3E" strokeWidth="3"/>
            <g style={{ animation: "caminar 1.8s ease-in-out forwards" }}>
              <ellipse cx="0" cy="172" rx="18" ry="5" fill="rgba(0,0,0,0.12)"/>
              <line x1="-5" y1="148" x2="-10" y2="170" stroke="#00482B" strokeWidth="6" strokeLinecap="round" style={{ animation: "piernaIzq 0.4s ease-in-out infinite alternate", transformOrigin: "-5px 148px" }}/>
              <line x1="5" y1="148" x2="10" y2="170" stroke="#00482B" strokeWidth="6" strokeLinecap="round" style={{ animation: "piernaDer 0.4s ease-in-out infinite alternate", transformOrigin: "5px 148px" }}/>
              <rect x="-10" y="120" width="20" height="28" rx="4" fill="#007B3E"/>
              <polygon points="0,124 -3,138 0,135 3,138" fill="#FFD700"/>
              <line x1="-10" y1="128" x2="-22" y2="145" stroke="#F5CBA7" strokeWidth="5" strokeLinecap="round" style={{ animation: "brazoIzq 0.4s ease-in-out infinite alternate", transformOrigin: "-10px 128px" }}/>
              <line x1="10" y1="128" x2="22" y2="145" stroke="#F5CBA7" strokeWidth="5" strokeLinecap="round" style={{ animation: "brazoDer 0.4s ease-in-out infinite alternate", transformOrigin: "10px 128px" }}/>
              <rect x="-4" y="108" width="8" height="13" rx="3" fill="#F5CBA7"/>
              <circle cx="0" cy="96" r="14" fill="#F5CBA7"/>
              <rect x="-12" y="90" width="24" height="9" rx="4" fill="#00482B" opacity="0.85"/>
              <circle cx="-5" cy="94" r="2.5" fill="white"/>
              <circle cx="5" cy="94" r="2.5" fill="white"/>
              <path d="M -4 103 Q 0 107 4 103" stroke="#333" strokeWidth="1.5" fill="none"/>
              <rect x="-13" y="82" width="26" height="8" rx="4" fill="#4A2C0A"/>
              <text x="0" y="76" textAnchor="middle" fontFamily="Montserrat,sans-serif" fontSize="16" fontWeight="700" fill="#FFD700" style={{ animation: "flotarInterrogacion 0.6s ease-in-out infinite alternate" }}>?</text>
            </g>
            <text x="250" y="40" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontSize="18" fontWeight="700" fill="#00482B">¡Comienza el juicio!</text>
          </svg>
        </div>
      )}

      {/* NAVBAR */}
      <nav style={{
        backgroundColor: "#007B3E",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        height: "80px",
        position: "relative"
        
      }}>
        <img src={logo} alt="ISU" style={{ height: "60px", maxWidth: "150px", objectFit: "contain" }} />

        {/* MENÚ HAMBURGUESA (móvil) */}
        <button
          onClick={() => setMenuAbierto(!menuAbierto)}
          className="hamburger"
          style={{
            background: "none", border: "none",
            color: "white", fontSize: "28px",
            cursor: "pointer", display: "none"
          }}
        >
          ☰
        </button>

        {/* LINKS DESKTOP */}
        <div className="nav-links" style={{
          display: "flex", alignItems: "center", gap: "40px"
        }}>
          {[
            { label: "Inicio", key: "inicio" },
            { label: "¿Qué hacemos?", key: "que" },
            { label: "Juzga", key: "juzga" },
            { label: "Proponer escenario", key: "proponer" },
          ].map(({ label, key }) => (
            <span
              key={key}
              onClick={() => manejarClickMenu(key)}
              style={{
                color: "white", fontWeight: "600", fontSize: "16px",
                cursor: "pointer",
                borderBottom: menuActivo === key ? "2px solid white" : "2px solid transparent",
              }}
            >
              {label}
            </span>
          ))}

          <button
            onClick={handleSoyProfesor}
            disabled={animandoProfesor}
            style={{
              backgroundColor: "white", color: "#00482B",
              border: "none", borderRadius: "30px",
              padding: "10px 22px", fontWeight: "700",
              fontSize: "14px", cursor: "pointer",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
            }}
          >
            SOY PROFESOR
          </button>
        </div>

        {/* MENÚ MÓVIL DESPLEGABLE */}
        {menuAbierto && (
          <div style={{
            position: "absolute", top: "80px", left: 0, right: 0,
            backgroundColor: "#007B3E", zIndex: 1000,
            display: "flex", flexDirection: "column",
            padding: "20px", gap: "16px"
          }}>
            {[
              { label: "Inicio", key: "inicio" },
              { label: "¿Qué hacemos?", key: "que" },
              { label: "Juzga", key: "juzga" },
              { label: "Proponer escenario", key: "proponer" },
            ].map(({ label, key }) => (
              <span
                key={key}
                onClick={() => manejarClickMenu(key)}
                style={{
                  color: "white", fontWeight: "600", fontSize: "18px",
                  cursor: "pointer", padding: "8px 0",
                  borderBottom: "1px solid rgba(255,255,255,0.2)"
                }}
              >
                {label}
              </span>
            ))}
            <button
              onClick={handleSoyProfesor}
              style={{
                backgroundColor: "white", color: "#00482B",
                border: "none", borderRadius: "30px",
                padding: "12px", fontWeight: "700",
                fontSize: "16px", cursor: "pointer", marginTop: "8px"
              }}
            >
              SOY PROFESOR
            </button>
          </div>
        )}
      </nav>

      {/* CONTENIDO */}
      <div style={{
        paddingTop: "40px",
        opacity: animar ? 1 : 0,
        transform: animar ? "translateY(0)" : "translateY(20px)",
        transition: "all 0.4s ease",
      }}>
        {menuActivo === "inicio" && (
          <div style={{ width: "90%", maxWidth: "600px", margin: "0 auto" }}>
            <div style={{
              width: "100%", height: "250px",
              backgroundColor: "#D9D9D9", borderRadius: "10px",
            }}/>
            <div style={{ display: "flex", justifyContent: "center", marginTop: "30px" }}>
              <button
                onClick={handleAnonimo}
                style={{
                  backgroundColor: "#007B3E", color: "white",
                  border: "none", borderRadius: "40px",
                  padding: "15px 40px", fontSize: "18px",
                  fontWeight: "700", cursor: "pointer",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                }}
              >
                COMIENZA EL JUICIO
              </button>
            </div>
          </div>
        )}

        {menuActivo === "que" && (
          <div style={{ maxWidth: "900px", margin: "0 auto", padding: "20px" }}>
            <h1 style={{ color: "#007B3E" }}>¿Qué hacemos?</h1>
            <p style={{ lineHeight: "1.8", marginTop: "20px" }}>
              Este proyecto busca concientizar a los docentes sobre los usos,
              implicaciones y riesgos de la inteligencia artificial en la educación,
              frente a una adopción acelerada que muchas veces ocurre sin formación adecuada.
            </p>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "20px", marginTop: "40px",
            }}>
              {[
                { titulo: "Escenarios educativos", texto: "Casos reales sobre IA en el aula." },
                { titulo: "Toma de decisiones", texto: "El docente analiza y decide." },
                { titulo: "Reflexión crítica", texto: "Evaluación ética y pedagógica." },
              ].map((card, i) => (
                <div key={i} style={{
                  backgroundColor: "#F5F5F5", padding: "20px",
                  borderRadius: "15px", textAlign: "center",
                }}>
                  <h3 style={{ color: "#00482B" }}>{card.titulo}</h3>
                  <p style={{ fontSize: "14px" }}>{card.texto}</p>
                </div>
              ))}
            </div>

            <h2 style={{ color: "#00482B", marginTop: "40px" }}>Problemática</h2>
            <p style={{ lineHeight: "1.8" }}>
              La rápida expansión de la inteligencia artificial ha superado la capacidad
              de adaptación pedagógica, generando una brecha entre su uso y la formación docente.
            </p>

            <h2 style={{ color: "#00482B", marginTop: "40px" }}>Objetivo</h2>
            <p style={{ lineHeight: "1.8" }}>
              Promover la toma de decisiones informadas mediante una plataforma experimental
              basada en escenarios educativos.
            </p>

            <div style={{ textAlign: "center", marginTop: "40px" }}>
              <h3 style={{ color: "#00482B" }}>Conoce los programas académicos</h3>
              <img src={qr} alt="QR" style={{ width: "150px" }} />
              <p style={{ fontSize: "14px" }}>Escanea el código para más información.</p>
            </div>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
          <img src={LogoUdec} alt="UDEC" style={{ width: "180px" }} />
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ backgroundColor: "#00482B", color: "white", padding: "30px 20px", marginTop: "40px" }}>
        <div style={{
          display: "flex", flexWrap: "wrap",
          justifyContent: "space-between", alignItems: "center", gap: "20px"
        }}>
          <div>
            <h3 style={{ margin: "0 0 6px 0" }}>Praxis</h3>
            <p style={{ fontSize: "14px", margin: 0 }}>Plataforma educativa con IA</p>
          </div>
          <img src={LogoUdec} alt="UDEC" style={{ width: "150px" }} />
          <div style={{ textAlign: "right", fontSize: "14px" }}>
            <p style={{ margin: "0 0 4px 0" }}>© 2026</p>
            <p style={{ margin: 0 }}>Universidad de Cundinamarca</p>
          </div>
        </div>
      </footer>

      <style>{`
        @media (max-width: 768px) {
          .nav-links { display: none !important; }
          .hamburger { display: block !important; }
        }
        @keyframes caminar {
          0%   { transform: translateX(60px); }
          85%  { transform: translateX(370px); opacity: 1; }
          100% { transform: translateX(380px); opacity: 0; }
        }
        @keyframes brazoIzq { from { transform: rotate(-25deg); } to { transform: rotate(25deg); } }
        @keyframes brazoDer { from { transform: rotate(25deg); } to { transform: rotate(-25deg); } }
        @keyframes piernaIzq { from { transform: rotate(-20deg); } to { transform: rotate(20deg); } }
        @keyframes piernaDer { from { transform: rotate(20deg); } to { transform: rotate(-20deg); } }
        @keyframes fadeInText { from { opacity: 0; } to { opacity: 1; } }
        @keyframes flotarInterrogacion { from { transform: translateY(0px); } to { transform: translateY(-5px); } }
      `}</style>
    </div>
  );
}
