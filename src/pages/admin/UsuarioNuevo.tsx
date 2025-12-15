import React, { useState } from "react";

const API = "http://localhost:8080/api/v1";

interface FormUsuario {
  run: string;
  nombre: string;
  correo: string;
  tipo: "cliente" | "admin"; // UI
  password: string;
}

export default function UsuarioNuevo() {
  const [form, setForm] = useState<FormUsuario>({
    run: "",
    nombre: "",
    correo: "",
    tipo: "cliente",
    password: "",
  });

  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value } as FormUsuario);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje("");

    if (!form.run || !form.nombre || !form.correo || !form.password) {
      setMensaje("⚠️ Todos los campos son obligatorios");
      return;
    }

    const token = localStorage.getItem("token") || "";
    if (!token) {
      setMensaje("⚠️ No hay sesión activa (token). Inicia sesión como ADMIN.");
      return;
    }

    // ✅ Backend espera "ADMIN" | "CLIENTE"
    const payload = {
      run: form.run,
      nombre: form.nombre,
      correo: form.correo,
      password: form.password,
      tipo: form.tipo === "admin" ? "ADMIN" : "CLIENTE",
    };

    try {
      setCargando(true);

      const res = await fetch(`${API}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        if (res.status === 400) {
          setMensaje("⚠️ No se pudo crear: correo ya existe o datos inválidos.");
          return;
        }
        if (res.status === 401) {
          setMensaje("⚠️ Token inválido o vencido. Vuelve a iniciar sesión.");
          return;
        }
        if (res.status === 403) {
          setMensaje("⚠️ No autorizado. Debes iniciar sesión como ADMIN.");
          return;
        }
        setMensaje("⚠️ Error inesperado al crear el usuario.");
        return;
      }

      setMensaje("✅ Usuario agregado correctamente (guardado en BD)");

      setForm({
        run: "",
        nombre: "",
        correo: "",
        tipo: "cliente",
        password: "",
      });
    } catch (error) {
      setMensaje("⚠️ Error de conexión con el servidor");
    } finally {
      setCargando(false);
    }
  };

  return (
    <section className="container-fluid">
      <h4 className="text-secondary mb-4 fw-bold text-center">
        Registrar nuevo usuario
      </h4>

      {mensaje && (
        <div
          className={`alert ${
            mensaje.includes("⚠️") ? "alert-warning" : "alert-success"
          } text-center shadow-sm`}
          style={{ maxWidth: "700px", margin: "0 auto" }}
        >
          {mensaje}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="card shadow-sm border-0 p-4 mx-auto"
        style={{ maxWidth: "700px", borderRadius: "12px" }}
      >
        <div className="row g-4">
          <div className="col-md-6">
            <label className="form-label fw-semibold">RUN</label>
            <input
              name="run"
              value={form.run}
              onChange={handleChange}
              placeholder="Ej: 12.345.678-9"
              className="form-control"
            />
          </div>

          <div className="col-md-6">
            <label className="form-label fw-semibold">Nombre completo</label>
            <input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Ej: Juan Pérez"
              className="form-control"
            />
          </div>

          <div className="col-md-6">
            <label className="form-label fw-semibold">Correo electrónico</label>
            <input
              name="correo"
              type="email"
              value={form.correo}
              onChange={handleChange}
              placeholder="Ej: juan@gmail.com"
              className="form-control"
            />
          </div>

          <div className="col-md-6">
            <label className="form-label fw-semibold">Contraseña</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="********"
              className="form-control"
            />
          </div>

          <div className="col-md-6">
            <label className="form-label fw-semibold">Tipo de usuario</label>
            <select
              name="tipo"
              value={form.tipo}
              onChange={handleChange}
              className="form-select"
            >
              <option value="cliente">Cliente</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
        </div>

        <div className="text-center mt-4">
          <button className="btn btn-primary px-4 fw-semibold" disabled={cargando}>
            {cargando ? "Creando..." : "Agregar usuario"}
          </button>
        </div>
      </form>
    </section>
  );
}
