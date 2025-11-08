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
      setMensaje("⚠️ El nombre de la categoría es obligatorio.");
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
    setMensaje("✅ Categoría agregada correctamente.");
  };

  return (
    <section>
      <h4 className="text-secondary mb-3">➕ Agregar nueva categoría</h4>

      {mensaje && (
        <div
          className={`alert ${
            mensaje.includes("⚠️") ? "alert-warning" : "alert-success"
          } text-center`}
        >
          {mensaje}
        </div>
      )}

      <form onSubmit={agregarCategoria}>
        <div className="row g-3">
          <div className="col-md-5">
            <label className="form-label fw-semibold">Nombre</label>
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

          <div className="col-md-2 d-flex align-items-end">
            <button type="submit" className="btn btn-primary w-100">
              Agregar
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}
