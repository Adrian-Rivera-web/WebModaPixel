import { useEffect, useState } from "react";
import { Link, Routes, Route } from "react-router-dom";
import type { Producto } from "../../data/productos";
import ProductosEditar from "./ProductosEditar";

export default function ProductosMostrar() {
  const [productos, setProductos] = useState<Producto[]>([]);

  // 🔹 Cargar productos al inicio
  useEffect(() => {
    const guardados = JSON.parse(localStorage.getItem("productosCliente") || "[]");
    setProductos(guardados);
  }, []);

  // 🔁 Escucha los cambios cuando se actualizan productos
  useEffect(() => {
    const sync = () => {
      const guardados = JSON.parse(localStorage.getItem("productosCliente") || "[]");
      setProductos(guardados);
    };
    window.addEventListener("productos-actualizados", sync);
    return () => window.removeEventListener("productos-actualizados", sync);
  }, []);

  // 🗑️ Eliminar producto con confirmación
  const eliminarProducto = (id: number, nombre: string) => {
    const confirmar = window.confirm(`¿Estás seguro de eliminar el producto "${nombre}"?`);
    if (!confirmar) return;

    const actualizados = productos.filter((p) => p.id !== id);
    localStorage.setItem("productosCliente", JSON.stringify(actualizados));
    setProductos(actualizados);
    alert(`El producto "${nombre}" fue eliminado correctamente.`);
  };

  return (
    <section>
      <h4 className="text-secondary mb-3">Lista de productos</h4>

      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-primary text-center">
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Oferta</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center text-muted py-4">
                  No hay productos registrados.
                </td>
              </tr>
            ) : (
              productos.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.nombre}</td>
                  <td>{p.categoria}</td>
                  <td>${p.precio.toLocaleString()}</td>
                  <td
                    className={
                      (p.stock ?? 0) <= 5
                        ? "fw-bold text-danger"
                        : "fw-semibold text-success"
                    }
                  >
                    {p.stock ?? 0}
                  </td>
                  <td className="text-center">
                    {p.oferta ? (
                      <span className="badge bg-success">Sí</span>
                    ) : (
                      <span className="badge bg-secondary">No</span>
                    )}
                  </td>
                  <td className="text-center">
                    <Link
                      to={`editar/${p.id}`}
                      className="btn btn-sm btn-outline-warning me-2"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => eliminarProducto(p.id, p.nombre)}
                      className="btn btn-sm btn-outline-danger"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Subruta para edición dentro de “Mostrar productos” */}
      <Routes>
        <Route path="editar/:id" element={<ProductosEditar />} />
      </Routes>
    </section>
  );
}
