// src/pages/Registro.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/styles.css";

const API = "http://localhost:8080/api/v1";

export default function Registro() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    run: "",
    nombre: "",
    correo: "",
    password: "",
  });
  const [mensaje, setMensaje] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje("");

    if (!form.run || !form.nombre || !form.correo || !form.password) {
      setMensaje("Todos los campos son obligatorios");
      return;
    }

    try {
      const res = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        // tu backend devuelve 400 si el correo ya existe (como lo hicimos)
        if (res.status === 400) {
          setMensaje("Este correo ya está registrado");
          return;
        }
        setMensaje("No se pudo registrar. Intenta nuevamente");
        return;
      }

      setMensaje("Registro exitoso, ahora puedes iniciar sesión");
      setTimeout(() => navigate("/login"), 1200);
    } catch (error) {
      setMensaje("Error de conexión con el servidor");
    }
  };

  return (
    <main className="container mt-4">
      <h2 className="text-center mb-4">Crear Cuenta</h2>
      <form
        onSubmit={handleSubmit}
        className="mx-auto shadow p-4 rounded bg-white"
        style={{ maxWidth: "420px" }}
      >
        {mensaje && (
          <p
            className={`text-center ${
              mensaje.toLowerCase().includes("error") ||
              mensaje.toLowerCase().includes("no se pudo") ||
              mensaje.toLowerCase().includes("obligatorios") ||
              mensaje.toLowerCase().includes("ya está")
                ? "text-danger"
                : "text-success"
            }`}
          >
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
            name="password"
            className="form-control"
            value={form.password}
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
