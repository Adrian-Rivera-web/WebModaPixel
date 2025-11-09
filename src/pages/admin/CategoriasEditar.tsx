import { useEffect, useState } from "react";

interface Categoria {
  id: number;
  nombre: string;
  descripcion: string;
}

export default function CategoriasEditar() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const guardadas = JSON.parse(localStorage.getItem("categorias") || "[]");
    setCategorias(guardadas);
  }, []);

  const guardarCategorias = (nuevas: Categoria[]) => {
    setCategorias(nuevas);
    localStorage.setItem("categorias", JSON.stringify(nuevas));
  };

  const eliminarCategoria = (id: number) => {
    if (!confirm("¿Seguro que deseas eliminar esta categoría?")) return;
    const actualizadas = categorias.filter((c) => c.id !== id);
    guardarCategorias(actualizadas);
    setMensaje("Categoría eliminada correctamente.");
  };

  return (
    <section>
      <h4 className="text-secondary mb-3">Editar o eliminar categorías</h4>

      {mensaje && (
        <div
          className={`alert ${
            mensaje.includes("⚠️") ? "alert-warning" : "alert-success"
          } text-center`}
        >
          {mensaje}
        </div>
      )}

      {categorias.length === 0 ? (
        <p className="text-center text-muted">No hay categorías registradas.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-primary">
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categorias.map((c) => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.nombre}</td>
                  <td>{c.descripcion}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => eliminarCategoria(c.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
