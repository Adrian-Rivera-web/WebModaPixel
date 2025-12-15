import { useEffect, useState } from "react";
import {
  type Categoria,
  cargarCategorias,
  guardarCategorias,
} from "../../data/categorias";

export default function CategoriasEditar() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [mensaje, setMensaje] = useState("");

  // 🔹 Cargar categorías desde el módulo centralizado
  useEffect(() => {
    const lista = cargarCategorias();
    setCategorias(lista);
  }, []);

  const eliminarCategoria = (id: number) => {
    if (!confirm("¿Seguro que deseas eliminar esta categoría?")) return;

    const actualizadas = categorias.filter((c) => c.id !== id);
    setCategorias(actualizadas);
    guardarCategorias(actualizadas);

    setMensaje("✅ Categoría eliminada correctamente.");
    setTimeout(() => setMensaje(""), 2500);
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
