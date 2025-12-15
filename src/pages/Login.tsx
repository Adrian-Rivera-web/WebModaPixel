// src/pages/Login.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/styles.css";
import { getUsuarios, setSesion, type Usuario } from "../utils/auth";

const API = "http://localhost:8080/api/v1";

type LoginResponse = { token: string };
type UserTypeApi = "ADMIN" | "CLIENTE";
type MeResponse = {
  id: number;
  run: string;
  nombre: string;
  correo: string;
  tipo: UserTypeApi;
};

export default function Login() {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState("");
  const [password, setpassword] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje("");

    if (!correo || !password) {
      setMensaje("Debes completar todos los campos");
      return;
    }

    // ✅ Admin local de respaldo (para entrar sí o sí)
    const adminUser: Usuario = {
      run: "00.000.000-0",
      nombre: "Administrador",
      correo: "admin@modapixel.cl",
      password: "admin123",
      tipo: "admin",
    };

    try {
      // 1) Intentar login por BACKEND
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: correo, password }),
      });

      if (res.ok) {
        const data: LoginResponse = await res.json();
        localStorage.setItem("token", data.token);

        // 2) Obtener perfil para saber si es ADMIN/CLIENTE
        const meRes = await fetch(`${API}/users/me`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.token}`,
          },
        });

        if (meRes.ok) {
          const me: MeResponse = await meRes.json();

          // (opcional) guardar sesión estilo antiguo para que no se rompa tu app
          const sesionCompat: Usuario = {
            run: me.run,
            nombre: me.nombre,
            correo: me.correo,
            password: "", // no se guarda
            tipo: me.tipo === "ADMIN" ? "admin" : "cliente",
          };
          setSesion(sesionCompat);

          if (me.tipo === "ADMIN") {
            setMensaje(`Bienvenido Administrador ${me.nombre}`);
            setTimeout(() => navigate("/admin"), 800);
          } else {
            setMensaje(`Bienvenido ${me.nombre}`);
            setTimeout(() => navigate("/"), 800);
          }
          return;
        }

        // Si no existe /users/me todavía, al menos deja logueado con token
        setMensaje("Sesión iniciada");
        setTimeout(() => navigate("/"), 800);
        return;
      }

      // Si backend responde 401/400, seguimos con fallback local abajo
    } catch (error) {
      // Si backend está caído, seguimos con fallback local
    }

    // 2) Fallback: Admin local
    if (correo === adminUser.correo && password === adminUser.password) {
      localStorage.removeItem("token"); // para que no quede token malo
      setSesion(adminUser);
      setMensaje("Bienvenido Administrador");
      setTimeout(() => navigate("/admin"), 800);
      return;
    }

    // 3) Fallback: usuarios de localStorage (si aún los usas)
    const usuarios = getUsuarios();
    const usuarioEncontrado = usuarios.find(
      (u) => u.correo === correo && u.password === password
    );

    if (usuarioEncontrado) {
      localStorage.removeItem("token");
      setSesion(usuarioEncontrado);

      if (usuarioEncontrado.tipo === "admin") {
        setMensaje(`Bienvenido Administrador ${usuarioEncontrado.nombre}`);
        setTimeout(() => navigate("/admin"), 800);
      } else {
        setMensaje(`Bienvenido ${usuarioEncontrado.nombre}`);
        setTimeout(() => navigate("/"), 800);
      }
      return;
    }

    setMensaje("Usuario o contraseña incorrectos");
  };

  return (
    <main className="container mt-4">
      <h2 className="text-center mb-4">Iniciar Sesión</h2>
      <form
        onSubmit={handleLogin}
        className="mx-auto shadow p-4 rounded bg-white"
        style={{ maxWidth: "400px" }}
      >
        {mensaje && (
          <p
            className={`text-center fw-bold ${
              mensaje.toLowerCase().includes("incorrect")
                ? "text-danger"
                : mensaje.toLowerCase().includes("debes")
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
            value={password}
            onChange={(e) => setpassword(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Iniciar sesión
        </button>
      </form>
    </main>
  );
}
