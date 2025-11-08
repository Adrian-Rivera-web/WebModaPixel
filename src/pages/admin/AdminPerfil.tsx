import { useEffect, useState } from "react";
import "../../assets/css/styles.css";

interface Usuario {
  nombre: string;
  correo: string;
  tipo: string;
}

export default function AdminPerfil() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("usuarioActual") || "null");
    setUsuario(data);
  }, []);

  if (!usuario) {
    return (
      <main className="container mt-4 text-center">
        <h2>⚙️ Perfil de Usuario</h2>
        <p>No hay información disponible. Inicia sesión nuevamente.</p>
      </main>
    );
  }

  return (
    <main className="container mt-4">
      <div
        className="card shadow-lg border-0 p-4 mx-auto"
        style={{ maxWidth: "600px" }}
      >
        <div className="text-center mb-4">
          <img
            src="/src/assets/img/avatar-admin.png"
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
          <h3 className="fw-bold mt-3">{usuario.nombre}</h3>
          <span className="badge bg-primary fs-6">
            {usuario.tipo.toUpperCase()}
          </span>
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Correo electrónico</label>
          <input
            type="email"
            className="form-control"
            value={usuario.correo}
            readOnly
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Tipo de cuenta</label>
          <input
            type="text"
            className="form-control"
            value={usuario.tipo}
            readOnly
          />
        </div>

        <hr />

        <div className="text-center">
          <button
            className="btn btn-outline-secondary px-4"
            onClick={() =>
              alert("🛠️ La función 'Editar perfil' se encuentra en proceso de desarrollo.")
            }
          >
            🕓 En proceso
          </button>
        </div>
      </div>
    </main>
  );
}
