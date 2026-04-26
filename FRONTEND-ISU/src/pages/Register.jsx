import { useState } from "react";

export default function Register({ rolInicial }) {
  const [rolSeleccionado] = useState(rolInicial);

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    contraseña: "",
    años_experiencia: "",
    estado: 1,
    id_institucion: 1
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    const body = {
      ...form,
      id_rol: rolSeleccionado
    };

    const res = await fetch("http://https://backend-isu.onrender.com/api/usuarios", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const data = await res.json();
    alert(data.message);
  };

  return (
    <div>
      <h1>
        Registro {rolSeleccionado === 2 ? "Administrador" : "Docente"}
      </h1>

      <input
        name="nombre"
        placeholder="Nombre"
        onChange={handleChange}
      />

      <input
        name="apellido"
        placeholder="Apellido"
        onChange={handleChange}
      />

      <input
        name="correo"
        placeholder="Correo"
        onChange={handleChange}
      />

      <input
        name="contraseña"
        placeholder="Contraseña"
        onChange={handleChange}
      />

      <input
        name="anos_experiencia"
        placeholder="Años experiencia"
        onChange={handleChange}
      />

      <button onClick={handleSubmit}>
        Registrarme
      </button>
    </div>
  );
}