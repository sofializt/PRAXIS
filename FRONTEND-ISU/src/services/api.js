const API = "https://backend-isu.onrender.com/api";

export const loginUsuario = async (datos) => {
  const res = await fetch(`${API}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos)
  });
  return res.json();
};

export const accesoAnonimo = async () => {
  const res = await fetch(`${API}/anonimo`, {
    method: "POST"
  });
  return res.json();
};

export const getEscenarios = async () => {
  const res = await fetch(`${API}/escenarios`);
  return res.json();
};