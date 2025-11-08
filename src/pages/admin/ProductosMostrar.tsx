import { useEffect, useState } from "react";
import { Link, Routes, Route } from "react-router-dom";
import type { Producto } from "../../data/productos";
import ProductosEditar from "./ProductosEditar";

export default function ProductosMostrar() {
  const [productos, setProductos] = useState<Producto[]>([]);

  useEffect(() => {
    const guardados = JSON.parse(localStorage.getItem("productosCliente") || "[]");
    setProductos(guardados);
  }, []);

  return (
    <section>
      <h4 className="text-secondary mb-3">📋 Lista de productos</h4>
      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-primary">
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.nombre}</td>
                <td>{p.categoria}</td>
                <td>${p.precio}</td>
                <td>{p.stock}</td>
                <td>
                  <Link
                    to={`editar/${p.id}`}
                    className="btn btn-sm btn-outline-warning"
                  >
                    ✏️ Editar
                  </Link>
                </td>
              </tr>
            ))}
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
