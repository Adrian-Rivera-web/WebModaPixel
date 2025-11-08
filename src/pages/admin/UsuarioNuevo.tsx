import { useState } from "react";

interface Usuario {
  run: string;
  nombre: string;
  correo: string;
  tipo: string;
}

export default function UsuarioNuevo() {
  const [usuarios, setUsuarios] = useState<Usuario[]>(
    JSON.parse(localStorage.getItem("usuarios") || "[]")
  );
  const [form, setForm] = useState<Usuario>({
    run: "",
    nombre: "",
    correo: "",
    tipo: "cliente",
  });
  const [mensaje, setMensaje] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.run || !form.nombre || !form.correo) {
      setMensaje("⚠️ Todos los campos son obligatorios");
      return;
    }

    const nuevos = [...usuarios, form];
    setUsuarios(nuevos);
    localStorage.setItem("usuarios", JSON.stringify(nuevos));
    setMensaje("✅ Usuario agregado correctamente");
    setForm({ run: "", nombre: "", correo: "", tipo: "cliente" });
  };

  return (
    <section>
      <h4 className="text-secondary mb-3">➕ Registrar nuevo usuario</h4>

      {mensaje && (
        <div
          className={`alert ${
            mensaje.includes("⚠️") ? "alert-warning" : "alert-success"
          } text-center`}
        >
          {mensaje}
        </div>
      )}

      <form onSubmit={handleSubmit} className="shadow-sm p-4 bg-white rounded" style={{ maxWidth: "700px", margin: "0 auto" }}>
        <div className="row g-3">
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
            <label className="form-label fw-semibold">Tipo de usuario</label>
            <select name="tipo" value={form.tipo} onChange={handleChange} className="form-select">
              <option value="cliente">Cliente</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
        </div>

        <div className="text-center mt-4">
          <button className="btn btn-primary px-4">Agregar usuario</button>
        </div>
      </form>
    </section>
  );
}
