import { useState, useEffect } from "react";
import logo from "../assets/praxis.svg";
import LogoUdec from "../assets/udecblanco.png";
import qr from "../assets/qr.png";
import fotoHugo from "../assets/hugo.jpg";
import fotoBlanca from "../assets/blanca.jpg";
import fotoSofia from "../assets/sofia.jpg";

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isMobile;
};

export default function Inicio({ onSoyProfesor, onJuzga, usuario, cargandoAnonimo, onCerrarSesion }) {
  const [menuActivo, setMenuActivo] = useState("inicio");
  const [animar, setAnimar] = useState(true);
  const [animandoProfesor, setAnimandoProfesor] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const isMobile = useIsMobile();

  const esDocente = usuario?.id_rol === 3;

  useEffect(() => {
    fetch("https://backend-isu.onrender.com/api/escenarios").catch(() => {});
  }, []);

  const manejarClickMenu = (key) => {
    setMenuAbierto(false);
    if (key === "proponer") {
      window.open("https://forms.cloud.microsoft/r/iBJ4fHqZdq", "_blank");
      return;
    }
    if (key === "juzga") { handleAnonimo(); return; }
    setAnimar(false);
    setTimeout(() => {
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
    if (cargandoAnonimo) return;
    onJuzga();
  };

  const cerrarSesion = () => {
    localStorage.removeItem("id_usuario");
    localStorage.removeItem("id_rol");
    localStorage.removeItem("usuario");
    if (onCerrarSesion) onCerrarSesion();
  };

  return (
    <div style={{ fontFamily: "Montserrat, sans-serif" }}>

      {/* OVERLAY CARGA ANÓNIMO */}
      {cargandoAnonimo && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "#F0FBF5", zIndex: 9999,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: "28px",
          pointerEvents: "all"
        }}>
          <svg width="500" height="200" viewBox="0 0 500 200">
            <line x1="0" y1="170" x2="500" y2="170" stroke="#007B3E" strokeWidth="3"/>
            <g>
              <rect x="370" y="80" width="90" height="65" rx="6" fill="#DFF5EA" stroke="#007B3E" strokeWidth="2.5"/>
              <line x1="380" y1="97" x2="450" y2="97" stroke="#007B3E" strokeWidth="2" strokeLinecap="round"/>
              <line x1="380" y1="108" x2="445" y2="108" stroke="#007B3E" strokeWidth="2" strokeLinecap="round"/>
              <line x1="380" y1="119" x2="440" y2="119" stroke="#007B3E" strokeWidth="2" strokeLinecap="round"/>
              <rect x="408" y="145" width="6" height="12" rx="2" fill="#007B3E"/>
              <rect x="398" y="157" width="26" height="4" rx="2" fill="#007B3E"/>
              <text x="460" y="122" fontFamily="Montserrat,sans-serif" fontSize="28" fontWeight="700" fill="#FFD700">?</text>
            </g>
            <g style={{ animation: "caminar 1.8s ease-in-out infinite" }}>
              <ellipse cx="0" cy="172" rx="18" ry="5" fill="rgba(0,0,0,0.12)"/>
              <line x1="-5" y1="148" x2="-10" y2="170" stroke="#00482B" strokeWidth="6" strokeLinecap="round"
                style={{ animation: "piernaIzq 0.4s ease-in-out infinite alternate", transformOrigin: "-5px 148px" }}/>
              <line x1="5" y1="148" x2="10" y2="170" stroke="#00482B" strokeWidth="6" strokeLinecap="round"
                style={{ animation: "piernaDer 0.4s ease-in-out infinite alternate", transformOrigin: "5px 148px" }}/>
              <rect x="-10" y="120" width="20" height="28" rx="4" fill="#007B3E"/>
              <polygon points="0,124 -3,138 0,135 3,138" fill="#FFD700"/>
              <line x1="-10" y1="128" x2="-22" y2="145" stroke="#F5CBA7" strokeWidth="5" strokeLinecap="round"
                style={{ animation: "brazoIzq 0.4s ease-in-out infinite alternate", transformOrigin: "-10px 128px" }}/>
              <line x1="10" y1="128" x2="22" y2="145" stroke="#F5CBA7" strokeWidth="5" strokeLinecap="round"
                style={{ animation: "brazoDer 0.4s ease-in-out infinite alternate", transformOrigin: "10px 128px" }}/>
              <rect x="-4" y="108" width="8" height="13" rx="3" fill="#F5CBA7"/>
              <circle cx="0" cy="96" r="14" fill="#F5CBA7"/>
              <rect x="-12" y="90" width="24" height="9" rx="4" fill="#00482B" opacity="0.85"/>
              <circle cx="-5" cy="94" r="2.5" fill="white"/>
              <circle cx="5" cy="94" r="2.5" fill="white"/>
              <path d="M -4 103 Q 0 107 4 103" stroke="#333" strokeWidth="1.5" fill="none"/>
              <rect x="-13" y="82" width="26" height="8" rx="4" fill="#4A2C0A"/>
              <text x="0" y="76" textAnchor="middle" fontFamily="Montserrat,sans-serif"
                fontSize="16" fontWeight="700" fill="#FFD700"
                style={{ animation: "flotarInterrogacion 0.6s ease-in-out infinite alternate" }}>
                ?
              </text>
            </g>
            <text x="250" y="40" textAnchor="middle" fontFamily="Montserrat, sans-serif"
              fontSize="18" fontWeight="700" fill="#00482B">
              ¡Comienza el juicio!
            </text>
          </svg>
          <div style={{ textAlign: "center" }}>
            <p style={{ color: "#00482B", fontWeight: "700", fontSize: "17px", margin: "0 0 8px 0" }}>
              Conectando con el servidor...
            </p>
            <p style={{ color: "#555", fontWeight: "400", fontSize: "14px", margin: 0, maxWidth: "280px", lineHeight: "1.6" }}>
              La primera conexión puede tardar unos segundos. ¡Ya casi!
            </p>
          </div>
          <div style={{
            width: "44px", height: "44px",
            border: "5px solid #DFF5EA", borderTop: "5px solid #007B3E",
            borderRadius: "50%", animation: "girar 0.8s linear infinite"
          }} />
        </div>
      )}

      {/* OVERLAY PROFESOR */}
      {animandoProfesor && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "#F0FBF5", zIndex: 9999,
          display: "flex", alignItems: "center", justifyContent: "center",
          pointerEvents: "none"
        }}>
          <svg width="500" height="200" viewBox="0 0 500 200">
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
              <line x1="-10" y1="128" x2="-22" y2="145" stroke="#F5CBA7" strokeWidth="5" strokeLinecap="round"
                style={{ animation: "brazoIzq 0.4s ease-in-out infinite alternate", transformOrigin: "-10px 128px" }}/>
              <line x1="10" y1="128" x2="22" y2="145" stroke="#F5CBA7" strokeWidth="5" strokeLinecap="round"
                style={{ animation: "brazoDer 0.4s ease-in-out infinite alternate", transformOrigin: "10px 128px" }}/>
              <line x1="-5" y1="148" x2="-10" y2="170" stroke="#00482B" strokeWidth="6" strokeLinecap="round"
                style={{ animation: "piernaIzq 0.4s ease-in-out infinite alternate", transformOrigin: "-5px 148px" }}/>
              <line x1="5" y1="148" x2="10" y2="170" stroke="#00482B" strokeWidth="6" strokeLinecap="round"
                style={{ animation: "piernaDer 0.4s ease-in-out infinite alternate", transformOrigin: "5px 148px" }}/>
              <rect x="18" y="132" width="16" height="12" rx="3" fill="#8B6914" stroke="#5C4A1E" strokeWidth="1.5"/>
              <path d="M 22 132 Q 22 128 26 128 Q 30 128 30 132" stroke="#5C4A1E" strokeWidth="1.5" fill="none"/>
            </g>
            <text x="250" y="40" textAnchor="middle" fontFamily="Montserrat, sans-serif"
              fontSize="18" fontWeight="700" fill="#00482B"
              style={{ animation: "fadeInText 0.5s ease forwards" }}>
              ¡Bienvenido, Profesor!
            </text>
          </svg>
        </div>
      )}

      {/* NAVBAR */}
      <nav style={{
        backgroundColor: "#007B3E",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: isMobile ? "0 20px" : "0 60px",
        height: "90px", position: "relative",
      }}>
        <img
          src={logo} alt="ISU"
          style={{ height: isMobile ? "50px" : "70px", cursor: "pointer" }}
          onClick={() => manejarClickMenu("inicio")}
        />

        {isMobile ? (
          <button
            onClick={() => setMenuAbierto(!menuAbierto)}
            style={{ background: "none", border: "none", cursor: "pointer", color: "white", fontSize: "28px", lineHeight: 1 }}
          >
            {menuAbierto ? "✕" : "☰"}
          </button>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: "50px" }}>
            {[
              { label: "Inicio", key: "inicio" },
              { label: "¿Qué hacemos?", key: "que" },
              { label: "Juzga", key: "juzga" },
            ].map(({ label, key }) => (
              <span key={key} onClick={() => manejarClickMenu(key)}
                style={{
                  color: "white", fontWeight: "600", fontSize: "16px", cursor: "pointer",
                  borderBottom: menuActivo === key ? "2px solid white" : "2px solid transparent",
                }}>
                {label}
              </span>
            ))}
            <span onClick={() => manejarClickMenu("proponer")}
              style={{ color: "white", fontWeight: "600", fontSize: "16px", cursor: "pointer" }}>
              Proponer escenario
            </span>
          </div>
        )}

        {/* Derecha navbar desktop */}
        {!isMobile && (
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {esDocente ? (
              <>
                <span style={{
                  color: "white", fontWeight: "600", fontSize: "14px",
                  backgroundColor: "rgba(255,255,255,0.15)",
                  padding: "10px 20px", borderRadius: "30px",
                }}>
                  👋 Hola, {usuario.nombre}
                </span>
                <button
                  onClick={cerrarSesion}
                  style={{
                    backgroundColor: "white", color: "#00482B", border: "none",
                    borderRadius: "30px", padding: "12px 28px", fontWeight: "700",
                    fontSize: "15px", cursor: "pointer", transition: "all 0.3s",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                  }}
                  onMouseEnter={(e) => e.target.style.transform = "scale(1.05)"}
                  onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
                >
                  CERRAR SESIÓN
                </button>
              </>
            ) : (
              <button onClick={handleSoyProfesor} disabled={animandoProfesor}
                style={{
                  backgroundColor: "white", color: "#00482B", border: "none",
                  borderRadius: "30px", padding: "12px 28px", fontWeight: "700",
                  fontSize: "15px", cursor: animandoProfesor ? "default" : "pointer",
                  transition: "all 0.3s",
                  boxShadow: animandoProfesor ? "none" : "0 4px 12px rgba(0,0,0,0.2)"
                }}>
                SOY PROFESOR
              </button>
            )}
          </div>
        )}
      </nav>

      {/* MENÚ DESPLEGABLE MÓVIL */}
      {isMobile && menuAbierto && (
        <div style={{
          backgroundColor: "#00612F", display: "flex", flexDirection: "column",
          padding: "16px 24px", gap: "16px", zIndex: 100,
        }}>
          {esDocente && (
            <span style={{
              color: "white", fontWeight: "600", fontSize: "14px",
              backgroundColor: "rgba(255,255,255,0.15)",
              padding: "10px 16px", borderRadius: "10px", textAlign: "center",
            }}>
              👋 Hola, {usuario.nombre}
            </span>
          )}
          {[
            { label: "Inicio", key: "inicio" },
            { label: "¿Qué hacemos?", key: "que" },
            { label: "Juzga", key: "juzga" },
            { label: "Proponer escenario", key: "proponer" },
          ].map(({ label, key }) => (
            <span key={key} onClick={() => manejarClickMenu(key)}
              style={{
                color: "white", fontWeight: "600", fontSize: "16px",
                cursor: "pointer", paddingBottom: "8px",
                borderBottom: "1px solid rgba(255,255,255,0.2)",
              }}>
              {label}
            </span>
          ))}
          {esDocente ? (
            <button onClick={() => { setMenuAbierto(false); cerrarSesion(); }}
              style={{
                backgroundColor: "white", color: "#00482B", border: "none",
                borderRadius: "30px", padding: "12px", fontWeight: "700",
                fontSize: "15px", cursor: "pointer",
              }}>
              CERRAR SESIÓN
            </button>
          ) : (
            <button onClick={() => { setMenuAbierto(false); handleSoyProfesor(); }}
              style={{
                backgroundColor: "white", color: "#00482B", border: "none",
                borderRadius: "30px", padding: "12px", fontWeight: "700",
                fontSize: "15px", cursor: "pointer",
              }}>
              SOY PROFESOR
            </button>
          )}
        </div>
      )}

      {/* CONTENIDO */}
      <div style={{
        paddingTop: "50px",
        opacity: animar ? 1 : 0,
        transform: animar ? "translateY(0)" : "translateY(20px)",
        transition: "all 0.4s ease",
      }}>

        {/* INICIO */}
        {menuActivo === "inicio" && (
          <div style={{ width: isMobile ? "95%" : "600px", margin: "0 auto", padding: isMobile ? "0 10px" : "0" }}>
            <iframe
              width="100%"
              height={isMobile ? "220px" : "350px"}
              src="https://www.youtube.com/embed/A69N6L35nVQ"
              title="Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ borderRadius: "10px" }}
            />
            <div style={{ display: "flex", justifyContent: "center", marginTop: "30px" }}>
              <button
                onClick={handleAnonimo}
                disabled={cargandoAnonimo}
                style={{
                  backgroundColor: cargandoAnonimo ? "#aaa" : "#007B3E",
                  color: "white", border: "none", borderRadius: "40px",
                  padding: isMobile ? "12px 30px" : "15px 40px",
                  fontSize: isMobile ? "16px" : "18px", fontWeight: "700",
                  cursor: cargandoAnonimo ? "default" : "pointer",
                  transition: "all 0.3s ease", boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                }}
                onMouseEnter={(e) => { if (!cargandoAnonimo) e.target.style.transform = "scale(1.07)"; }}
                onMouseLeave={(e) => { e.target.style.transform = "scale(1)"; }}
              >
                {cargandoAnonimo ? "Cargando..." : "COMIENZA EL JUICIO"}
              </button>
            </div>
          </div>
        )}

        {/* QUÉ HACEMOS */}
        {menuActivo === "que" && (
          <div style={{ maxWidth: "960px", margin: "0 auto", padding: isMobile ? "0 20px 40px" : "0 40px 60px" }}>

            <div style={{
              background: "linear-gradient(135deg, #007B3E 0%, #00482B 100%)",
              borderRadius: "20px", padding: isMobile ? "36px 28px" : "52px 60px",
              marginBottom: "52px", position: "relative", overflow: "hidden",
            }}>
              <div style={{ position: "absolute", top: "-50px", right: "-50px", width: "220px", height: "220px", borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
              <div style={{ position: "absolute", bottom: "-70px", left: "38%", width: "160px", height: "160px", borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
              <p style={{ color: "rgba(255,255,255,0.65)", fontWeight: "700", fontSize: "12px", letterSpacing: "2.5px", textTransform: "uppercase", margin: "0 0 14px 0" }}>Plataforma Praxis · UDEC</p>
              <h1 style={{ color: "white", fontWeight: "800", fontSize: isMobile ? "30px" : "42px", margin: "0 0 22px 0", lineHeight: 1.15 }}>¿Qué hacemos?</h1>
              <p style={{ color: "rgba(255,255,255,0.88)", lineHeight: "1.85", fontSize: isMobile ? "15px" : "16px", maxWidth: "680px", margin: 0 }}>
                El proyecto busca concienciar a los docentes sobre los usos, implicaciones y riesgos
                de la inteligencia artificial en la educación y facilitarles una reflexión a través de
                diversas situaciones y escenarios que ofrece la plataforma Praxis, ante la adopción
                acelerada y poco planificada que a veces se produce sin la formación adecuada.
              </p>
            </div>

            <h2 style={{ color: "#007B3E", fontWeight: "700", fontSize: "22px", margin: "0 0 6px 0" }}>¿Qué ofrece la plataforma?</h2>
            <p style={{ color: "#666", fontSize: "15px", margin: "0 0 28px 0", lineHeight: "1.6" }}>Praxis integra tres pilares para acompañar al docente en su proceso de reflexión.</p>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: "20px", marginBottom: "56px" }}>
              {[
                { icon: "📚", titulo: "Escenarios educativos", texto: "Casos reales sobre el uso de la IA en el aula, diseñados para provocar la reflexión docente.", accentColor: "#007B3E", bgColor: "#E8F5EE" },
                { icon: "⚖️", titulo: "Toma de decisiones", texto: "El docente analiza cada situación y elige su postura frente a dilemas pedagógicos concretos.", accentColor: "#F7931E", bgColor: "#FEF3C7" },
                { icon: "🔍", titulo: "Reflexión crítica", texto: "Evaluación ética y pedagógica de cada decisión, promoviendo una mirada informada y responsable.", accentColor: "#00A99D", bgColor: "#EFF6FF" },
              ].map((card, i) => (
                <div key={i}
                  style={{ backgroundColor: card.bgColor, borderRadius: "16px", padding: "30px 24px", borderTop: `4px solid ${card.accentColor}`, transition: "transform 0.25s ease, box-shadow 0.25s ease", cursor: "default" }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 14px 32px rgba(0,0,0,0.13)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
                  <div style={{ fontSize: "34px", marginBottom: "16px" }}>{card.icon}</div>
                  <h3 style={{ color: card.accentColor, fontWeight: "700", fontSize: "17px", margin: "0 0 10px 0" }}>{card.titulo}</h3>
                  <p style={{ color: "#444", fontSize: "14px", lineHeight: "1.75", margin: 0 }}>{card.texto}</p>
                </div>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "24px", marginBottom: "56px" }}>
              <div style={{ background: "#FFF9F9", borderRadius: "16px", padding: "32px 28px", borderLeft: "5px solid #F7931E" }}>
                <h2 style={{ color: "#F7931E", fontWeight: "700", fontSize: "19px", margin: "0 0 14px 0" }}>Problemática</h2>
                <p style={{ color: "#444", lineHeight: "1.85", fontSize: "15px", margin: 0 }}>
                  La inteligencia artificial ha irrumpido en todos los ámbitos de la sociedad. Vivimos una época de grandes transformaciones en la que parece no haber tiempo para la reflexión. La rapidez de los avances y la fuerte expansión de la IA ha superado la capacidad de adaptación pedagógica de los profesores, generando una brecha entre su uso y la formación docente.
                </p>
              </div>
              <div style={{ background: "#F0FBF5", borderRadius: "16px", padding: "32px 28px", borderLeft: "5px solid #007B3E" }}>
                <h2 style={{ color: "#007B3E", fontWeight: "700", fontSize: "19px", margin: "0 0 14px 0" }}>¿Qué pretendemos?</h2>
                <p style={{ color: "#444", lineHeight: "1.85", fontSize: "15px", margin: 0 }}>
                  Concienciar a los profesores sobre los usos y repercusiones de la IA en los procesos de enseñanza y aprendizaje mediante el uso de la plataforma experimental Praxis, promoviendo decisiones informadas y una reflexión pedagógica profunda.
                </p>
              </div>
            </div>

            <h2 style={{ color: "#007B3E", fontWeight: "700", fontSize: "22px", margin: "0 0 8px 0" }}>¿Quiénes lo hacemos?</h2>
            <p style={{ color: "#666", fontSize: "15px", lineHeight: "1.7", marginBottom: "32px" }}>
              Esta iniciativa nace como un proyecto social de desarrollo y transformación translocal del Instituto de Posgrados de la Universidad de Cundinamarca.
            </p>

            <div style={{
              background: "white", borderRadius: "18px",
              padding: isMobile ? "28px 24px" : "36px 40px",
              border: "1px solid #E5E7EB", marginBottom: "24px",
              display: "flex", flexDirection: isMobile ? "column" : "row",
              gap: "32px", alignItems: isMobile ? "center" : "flex-start",
              boxShadow: "0 4px 20px rgba(0,75,62,0.08)",
            }}>
              <div style={{ flexShrink: 0, textAlign: "center" }}>
                <img src={fotoHugo} alt="Hugo Alexander Rozo García"
                  style={{ width: isMobile ? "100px" : "130px", height: isMobile ? "100px" : "130px", borderRadius: "50%", objectFit: "cover", objectPosition: "center 20%", border: "4px solid #007B3E", display: "block" }}
                />
                <span style={{ display: "inline-block", marginTop: "10px", backgroundColor: "#007B3E", color: "white", fontSize: "11px", fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase", padding: "4px 12px", borderRadius: "20px" }}>Líder</span>
              </div>
              <div style={{ textAlign: isMobile ? "center" : "left" }}>
                <p style={{ color: "#00482B", fontWeight: "800", fontSize: isMobile ? "18px" : "20px", margin: "0 0 4px 0" }}>Hugo Alexander Rozo García</p>
                <p style={{ color: "#007B3E", fontSize: "13px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 14px 0" }}>Profesor e investigador en EdTech</p>
                <p style={{ color: "#555", fontSize: "15px", lineHeight: "1.8", margin: "0 0 20px 0" }}>
                  Investigador asociado según la clasificación de MinCiencias. Ha publicado más de 15 artículos (12 indexados en Scopus en todos los cuartiles), 6 capítulos de libros y cuenta con una patente de invención concedida. Advierte sobre los cambios y transformaciones que puede traer la IA desde una perspectiva distópica.
                </p>
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: isMobile ? "center" : "flex-start" }}>
                  <a href="https://www.researchgate.net/profile/Hugo-Rozo-Garcia" target="_blank" rel="noreferrer"
                    style={{ display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: "#007B3E", color: "white", padding: "9px 20px", borderRadius: "22px", fontSize: "13px", fontWeight: "700", textDecoration: "none", transition: "opacity 0.2s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.85"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}>
                    ResearchGate
                  </a>
                  <a href="https://www.linkedin.com/in/hugorozo/" target="_blank" rel="noreferrer"
                    style={{ display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: "#0077B5", color: "white", padding: "9px 20px", borderRadius: "22px", fontSize: "13px", fontWeight: "700", textDecoration: "none", transition: "opacity 0.2s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.85"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}>
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: "18px", marginBottom: "56px" }}>
              {[
                { initials: "BB", nombre: "Blanca Luz Buitrago Sánchez", rol: "Colaboradora", desc: "Integrante del equipo de investigación y desarrollo del proyecto Praxis en la Universidad de Cundinamarca.", avatarColor: "#00A99D", avatarBg: "#c1eae7", foto: fotoBlanca, researchgate: "https://www.researchgate.net/profile/Blanca-Buitrago-3" },
                { initials: "JD", nombre: "John Jairo Durán", rol: "Colaborador", desc: "Integrante del equipo de investigación y desarrollo del proyecto Praxis en la Universidad de Cundinamarca.", avatarColor: "#B45309", avatarBg: "#FEF3C7" },
                { initials: "PL", nombre: "Paula Sofía Lizcano Triana", rol: "Practicante · Ingeniería de Sistemas", desc: "Desarrollo frontend y backend, gestión de bases de datos y diseño de la plataforma. Trabaja con React, Node.js y SQL, enfocada en interfaces funcionales y claras.", avatarColor: "#007B3E", avatarBg: "#DCFCE7", foto: fotoSofia },
              ].map((p, i) => (
                <div key={i}
                  style={{ background: "white", borderRadius: "16px", padding: "28px 22px", border: "1px solid #E5E7EB", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", transition: "transform 0.25s ease, box-shadow 0.25s ease", cursor: "default" }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = "0 12px 28px rgba(0,0,0,0.11)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.05)"; }}>
                  {p.foto
                    ? <img src={p.foto} alt={p.nombre} style={{ width: "58px", height: "58px", borderRadius: "50%", objectFit: "cover", border: `2px solid ${p.avatarColor}`, marginBottom: "16px", display: "block" }} />
                    : <div style={{ width: "58px", height: "58px", borderRadius: "50%", backgroundColor: p.avatarBg, border: `2px solid ${p.avatarColor}`, display: "flex", alignItems: "center", justifyContent: "center", color: p.avatarColor, fontWeight: "800", fontSize: "18px", marginBottom: "16px", letterSpacing: "0.5px" }}>{p.initials}</div>
                  }
                  <p style={{ fontWeight: "700", fontSize: "15px", color: "#1A1A1A", margin: "0 0 5px 0", lineHeight: 1.3 }}>{p.nombre}</p>
                  <p style={{ fontSize: "11px", fontWeight: "700", color: p.avatarColor, textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 12px 0" }}>{p.rol}</p>
                  <p style={{ color: "#555", fontSize: "13px", lineHeight: "1.75", margin: 0 }}>{p.desc}</p>
                  {p.researchgate && (
                    <a href={p.researchgate} target="_blank" rel="noreferrer"
                      style={{ display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: "#00A99D", color: "white", padding: "7px 16px", borderRadius: "22px", fontSize: "12px", fontWeight: "700", textDecoration: "none", marginTop: "12px", transition: "opacity 0.2s" }}
                      onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.85"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}>
                      ResearchGate
                    </a>
                  )}
                </div>
              ))}
            </div>

            <div style={{ textAlign: "center", background: "#F0FBF5", borderRadius: "18px", padding: "40px 24px", marginBottom: "16px" }}>
              <h3 style={{ color: "#00482B", fontWeight: "700", fontSize: "18px", margin: "0 0 18px 0" }}>Conoce los programas académicos</h3>
              <img src={qr} alt="QR UDC" style={{ width: "130px", borderRadius: "12px", border: "3px solid #007B3E" }} />
              <p style={{ color: "#555", fontSize: "14px", marginTop: "14px", margin: "14px 0 0 0" }}>Escanea el código para más información.</p>
            </div>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "center", marginTop: "5px" }}>
          <img src={LogoUdec} alt="UDEC" style={{ width: isMobile ? "160px" : "250px" }} />
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ backgroundColor: "#00482B", color: "white", padding: isMobile ? "20px" : "30px 130px" }}>
        <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", alignItems: "center", gap: isMobile ? "16px" : "0", textAlign: isMobile ? "center" : "right" }}>
          <img src={LogoUdec} alt="UDEC" style={{ width: isMobile ? "160px" : "250px" }} />
          <div style={{ fontSize: "12px", lineHeight: "1.8" }}>
            <p>
              <a href="https://praxis-eight-kappa.vercel.app/" style={{ color: "white", fontWeight: "700" }} target="_blank" rel="noreferrer">Praxis</a>{" "}© 2026 by{" "}
              <a href="https://www.researchgate.net/profile/Hugo-Rozo-Garcia" style={{ color: "white", fontWeight: "700" }} target="_blank" rel="noreferrer">Hugo Rozo</a>
            </p>
            <p>Universidad de Cundinamarca</p>
            <p style={{ marginTop: "4px" }}>
              <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" rel="noreferrer"
                style={{ color: "white", display: "inline-flex", alignItems: "center", gap: "4px" }}>
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

      <style>{`
        @keyframes caminar {
          0%   { transform: translateX(60px); }
          100% { transform: translateX(60px); }
        }
        @keyframes brazoIzq { from { transform: rotate(-25deg); } to { transform: rotate(25deg); } }
        @keyframes brazoDer { from { transform: rotate(25deg); } to { transform: rotate(-25deg); } }
        @keyframes piernaIzq { from { transform: rotate(-20deg); } to { transform: rotate(20deg); } }
        @keyframes piernaDer { from { transform: rotate(20deg); } to { transform: rotate(-20deg); } }
        @keyframes fadeInText { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes flotarInterrogacion { from { transform: translateY(0px); } to { transform: translateY(-5px); } }
        @keyframes girar { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}