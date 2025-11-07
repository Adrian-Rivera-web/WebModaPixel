// src/pages/Registro.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/styles.css";
import { getUsuarios, saveUsuarios, type Usuario } from "../utils/auth";

export default function Registro() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    run: "",
    nombre: "",
    correo: "",
    clave: "",
  });
  const [mensaje, setMensaje] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.run || !form.nombre || !form.correo || !form.clave) {
      setMensaje("⚠️ Todos los campos son obligatorios");
      return;
    }

    const usuarios = getUsuarios();
    const existe = usuarios.some((u) => u.correo === form.correo);
    if (existe) {
      setMensaje("⚠️ Este correo ya está registrado");
      return;
    }

    const nuevoUsuario: Usuario = {
      run: form.run,
      nombre: form.nombre,
      correo: form.correo,
      clave: form.clave,
      tipo: "cliente", // 👈 por defecto
    };

    saveUsuarios([...usuarios, nuevoUsuario]);
    setMensaje("✅ Registro exitoso, ahora puedes iniciar sesión");
    setTimeout(() => navigate("/login"), 1200);
  };

  return (
    <main className="container mt-4">
      <h2 className="text-center mb-4">📝 Crear Cuenta</h2>
      <form
        onSubmit={handleSubmit}
        className="mx-auto shadow p-4 rounded bg-white"
        style={{ maxWidth: "420px" }}
      >
        {mensaje && (
          <p className={`text-center ${mensaje.includes("⚠️") ? "text-danger" : "text-success"}`}>
            {mensaje}
          </p>
        )}

        <div className="mb-3">
          <label>RUN</label>
          <input
            type="text"
            name="run"
            className="form-control"
            placeholder="12.345.678-9"
            value={form.run}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label>Nombre completo</label>
          <input
            type="text"
            name="nombre"
            className="form-control"
            value={form.nombre}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label>Correo electrónico</label>
          <input
            type="email"
            name="correo"
            className="form-control"
            value={form.correo}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label>Contraseña</label>
          <input
            type="password"
            name="clave"
            className="form-control"
            value={form.clave}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn btn-success w-100">
          Registrarse
        </button>
      </form>
    </main>
  );
}
