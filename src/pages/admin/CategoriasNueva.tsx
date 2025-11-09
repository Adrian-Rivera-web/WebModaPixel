import { useState, useEffect } from "react";

interface Categoria {
  id: number;
  nombre: string;
  descripcion: string;
}

export default function CategoriasNueva() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const guardadas = JSON.parse(localStorage.getItem("categorias") || "[]");
    setCategorias(guardadas);
  }, []);

  const guardarCategorias = (nuevas: Categoria[]) => {
    setCategorias(nuevas);
    localStorage.setItem("categorias", JSON.stringify(nuevas));
  };

  const agregarCategoria = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre.trim()) {
      setMensaje("El nombre de la categoría es obligatorio.");
      return;
    }

    const nueva: Categoria = {
      id: categorias.length + 1,
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
    };

    guardarCategorias([...categorias, nueva]);
    setNombre("");
    setDescripcion("");
    setMensaje("Categoría agregada correctamente.");
  };

  return (
    <section className="container-fluid">
      <h4 className="text-secondary fw-bold mb-4 text-center">
        Agregar nueva categoría
      </h4>

      {/* Mensaje */}
      {mensaje && (
        <div
          className={`alert ${
            mensaje.includes("⚠️") ? "alert-warning" : "alert-success"
          } text-center shadow-sm`}
        >
          {mensaje}
        </div>
      )}

      {/* Formulario centrado y ordenado */}
      <form
        onSubmit={agregarCategoria}
        className="card shadow-sm border-0 p-4 mx-auto"
        style={{ maxWidth: "700px", borderRadius: "12px" }}
      >
        <div className="row g-4 align-items-end">
          <div className="col-md-5">
            <label className="form-label fw-semibold">Nombre de la categoría</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Calzado"
              className="form-control"
            />
          </div>

          <div className="col-md-5">
            <label className="form-label fw-semibold">Descripción</label>
            <input
              type="text"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Breve descripción..."
              className="form-control"
            />
          </div>

          <div className="col-md-2 d-flex justify-content-center">
            <button
              type="submit"
              className="btn btn-primary w-100 fw-semibold"
              style={{ height: "42px", fontSize: "0.95rem" }}
            >
              Agregar
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}
