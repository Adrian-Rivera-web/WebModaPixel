import { useState } from "react";
import "../assets/css/styles.css";

export default function Contacto() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [comentario, setComentario] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 🔹 Validaciones
    if (nombre.trim().length === 0 || nombre.length > 100) {
      setMensaje("El nombre no puede estar vacío ni superar los 100 caracteres.");
      return;
    }

    const regexCorreo = /^[a-zA-Z0-9._%+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/;
    if (!regexCorreo.test(correo)) {
      setMensaje("El correo debe terminar en @duoc.cl, @profesor.duoc.cl o @gmail.com.");
      return;
    }

    if (comentario.trim().length === 0 || comentario.length > 500) {
      setMensaje("El comentario no puede estar vacío ni superar los 500 caracteres.");
      return;
    }

    // Guardar en localStorage (opcional)
    const mensajeContacto = { nombre, correo, comentario };
    localStorage.setItem("contacto", JSON.stringify(mensajeContacto));

    setMensaje("Mensaje enviado correctamente ");
    setNombre("");
    setCorreo("");
    setComentario("");
  };

  return (
    <main className="contacto-container">
      <h2>Contáctanos</h2>
      <form onSubmit={handleSubmit} className="formulario">
        <label>Nombre:</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />

        <label>Correo electrónico:</label>
        <input
          type="email"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          required
        />

        <label>Comentario:</label>
        <textarea
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          rows={5}
          required
        />

        <button type="submit">Enviar</button>
      </form>

      {mensaje && (
        <p style={{ color: mensaje.includes("✅") ? "green" : "red" }}>{mensaje}</p>
      )}
    </main>
  );
}
