// src/pages/Login.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/styles.css";
import { getUsuarios, setSesion, type Usuario } from "../utils/auth";

export default function Login() {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!correo || !clave) {
      setMensaje("⚠️ Debes completar todos los campos");
      return;
    }

    // 💼 Credenciales del administrador por defecto
    const adminUser: Usuario = {
      run: "00.000.000-0",
      nombre: "Administrador",
      correo: "admin@modapixel.cl",
      clave: "admin123",
      tipo: "admin",
    };

    if (correo === adminUser.correo && clave === adminUser.clave) {
      setSesion(adminUser);
      setMensaje("✅ Bienvenido Administrador");
      setTimeout(() => navigate("/admin"), 800);
      return;
    }

    // 👤 Verificar usuario registrado (modelo unificado)
    const usuarios = getUsuarios();
    const usuarioEncontrado = usuarios.find(
      (u) => u.correo === correo && u.clave === clave
    );

    if (usuarioEncontrado) {
      setSesion(usuarioEncontrado);
      if (usuarioEncontrado.tipo === "admin") {
        setMensaje(`✅ Bienvenido Administrador ${usuarioEncontrado.nombre}`);
        setTimeout(() => navigate("/admin"), 800);
      } else {
        setMensaje(`✅ Bienvenido ${usuarioEncontrado.nombre}`);
        setTimeout(() => navigate("/"), 800);
      }
    } else {
      setMensaje("❌ Usuario o contraseña incorrectos");
    }
  };

  return (
    <main className="container mt-4">
      <h2 className="text-center mb-4">🔐 Iniciar Sesión</h2>
      <form
        onSubmit={handleLogin}
        className="mx-auto shadow p-4 rounded bg-white"
        style={{ maxWidth: "400px" }}
      >
        {mensaje && (
          <p
            className={`text-center fw-bold ${
              mensaje.includes("❌")
                ? "text-danger"
                : mensaje.includes("⚠️")
                ? "text-warning"
                : "text-success"
            }`}
          >
            {mensaje}
          </p>
        )}

        <div className="mb-3">
          <label className="form-label">Correo electrónico</label>
          <input
            type="email"
            className="form-control"
            placeholder="ej: admin@modapixel.cl"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Contraseña</label>
          <input
            type="password"
            className="form-control"
            placeholder="********"
            value={clave}
            onChange={(e) => setClave(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Iniciar sesión
        </button>
      </form>
    </main>
  );
}
