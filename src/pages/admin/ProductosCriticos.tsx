import { useEffect, useState } from "react";
import type { Producto } from "../../data/productos";
import "../../assets/css/styles.css";

export default function ProductosCriticos() {
  const [productosCriticos, setProductosCriticos] = useState<Producto[]>([]);

  useEffect(() => {
    const guardados: Producto[] = JSON.parse(localStorage.getItem("productosCliente") || "[]");
    const criticos = guardados.filter((p) => (p.stock ?? 0) <= 5);
    setProductosCriticos(criticos);
  }, []);

  return (
    <main className="container mt-4">
      <h2 className="text-center mb-4 fw-bold text-primary">
        Productos con Stock Bajo
      </h2>

      <section className="card shadow-sm border-0 p-4">
        {productosCriticos.length === 0 ? (
          <p className="text-center text-success mb-0">
            No hay productos con stock crítico.
          </p>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-warning text-center">
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Categoría</th>
                  <th>Stock</th>
                  <th>Precio</th>
                </tr>
              </thead>
              <tbody>
                {productosCriticos.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.nombre}</td>
                    <td>{p.categoria}</td>
                    <td
                      className={
                        (p.stock ?? 0) <= 2
                          ? "fw-bold text-danger"
                          : "fw-semibold text-warning"
                      }
                    >
                      {p.stock ?? 0}
                    </td>
                    <td>${p.precio?.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
