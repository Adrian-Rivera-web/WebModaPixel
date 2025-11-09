import { useEffect, useState } from "react";
import type { Producto } from "../../data/productos";
import "../../assets/css/styles.css";

export default function ProductosReportes() {
  const [productos, setProductos] = useState<Producto[]>([]);

  useEffect(() => {
    const guardados = JSON.parse(localStorage.getItem("productosCliente") || "[]");
    setProductos(guardados);
  }, []);

  // 📊 Cálculos generales
  const totalProductos = productos.length;
  const totalStock = productos.reduce((sum, p) => sum + (p.stock ?? 0), 0);
  const valorTotal = productos.reduce(
    (sum, p) => sum + p.precio * (p.stock ?? 0),
    0
  );
  const productosCriticos = productos.filter((p) => (p.stock ?? 0) <= 5);
  const productosOferta = productos.filter((p) => p.oferta);

  // 📈 Top 5 productos más valiosos
  const topValiosos = [...productos]
    .sort((a, b) => (b.precio * (b.stock ?? 0)) - (a.precio * (a.stock ?? 0)))
    .slice(0, 5);

  return (
    <section>
      <h3 className="text-primary fw-bold mb-4 text-center">
        Reporte general de productos
      </h3>

      {/* === Indicadores principales === */}
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm text-center p-3 h-100">
            <i className="bi bi-box-seam display-6 text-primary mb-2"></i>
            <h6>Total de productos</h6>
            <h4 className="fw-bold text-dark">{totalProductos}</h4>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm text-center p-3 h-100">
            <i className="bi bi-archive-fill display-6 text-success mb-2"></i>
            <h6>Stock acumulado</h6>
            <h4 className="fw-bold text-dark">{totalStock}</h4>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm text-center p-3 h-100">
            <i className="bi bi-cash-coin display-6 text-warning mb-2"></i>
            <h6>Valor total inventario</h6>
            <h4 className="fw-bold text-dark">
              ${valorTotal.toLocaleString()}
            </h4>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm text-center p-3 h-100">
            <i className="bi bi-tags-fill display-6 text-danger mb-2"></i>
            <h6>Productos en oferta</h6>
            <h4 className="fw-bold text-dark">{productosOferta.length}</h4>
          </div>
        </div>
      </div>

      {/* === Productos críticos === */}
      <div className="card shadow-sm border-0 mb-4 p-3">
        <h5 className="text-danger mb-3">
          Productos con stock crítico ({productosCriticos.length})
        </h5>
        {productosCriticos.length === 0 ? (
          <p className="text-muted">No hay productos con stock bajo.</p>
        ) : (
          <table className="table table-striped align-middle text-center">
            <thead className="table-danger">
              <tr>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Stock</th>
                <th>Precio</th>
              </tr>
            </thead>
            <tbody>
              {productosCriticos.map((p) => (
                <tr key={p.id}>
                  <td>{p.nombre}</td>
                  <td>{p.categoria}</td>
                  <td>
                    <span className="badge bg-danger">{p.stock}</span>
                  </td>
                  <td>${p.precio.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* === Top productos por valor === */}
      <div className="card shadow-sm border-0 p-3">
        <h5 className="text-secondary mb-3">
          Top 5 productos más valiosos
        </h5>
        {topValiosos.length === 0 ? (
          <p className="text-muted">Aún no hay productos registrados.</p>
        ) : (
          <table className="table table-hover align-middle text-center">
            <thead className="table-light">
              <tr>
                <th>Nombre</th>
                <th>Stock</th>
                <th>Precio Unitario</th>
                <th>Valor Total</th>
              </tr>
            </thead>
            <tbody>
              {topValiosos.map((p) => (
                <tr key={p.id}>
                  <td>{p.nombre}</td>
                  <td>{p.stock}</td>
                  <td>${p.precio.toLocaleString()}</td>
                  <td>
                    <strong>
                      ${(p.precio * (p.stock ?? 0)).toLocaleString()}
                    </strong>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
