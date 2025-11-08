import { useEffect, useState } from "react";
import type { Producto } from "../../data/productos";

export default function ProductosCriticos() {
  const [productos, setProductos] = useState<Producto[]>([]);

  useEffect(() => {
    const guardados = JSON.parse(localStorage.getItem("productosCliente") || "[]");
    const criticos = guardados.filter((p: Producto) => (p.stock ?? 0) <= 5);
    setProductos(criticos);
  }, []);

  return (
    <section>
      <h4 className="text-secondary mb-3">⚠️ Productos con stock bajo</h4>

      {productos.length === 0 ? (
        <p>No hay productos críticos.</p>
      ) : (
        <table className="table table-hover align-middle">
          <thead className="table-warning">
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Stock</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.nombre}</td>
                <td>{p.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
