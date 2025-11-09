import { useEffect, useState } from "react";
import "../../assets/css/styles.css";

interface Compra {
  id: number;
  total: number;
  productos: { nombre: string; categoria: string; cantidad: number }[];
  usuario?: string;
  fecha: string;
}

interface Producto {
  id: number;
  nombre: string;
  stock: number;
  precio: number;
  categoria: string;
  oferta?: boolean;
  fechaAgregado?: string;
}

interface Usuario {
  nombre: string;
  correo: string;
  tipo?: string;
}

export default function AdminReportes() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [compras, setCompras] = useState<Compra[]>([]);
  const [productosCriticos, setProductosCriticos] = useState<Producto[]>([]);

  useEffect(() => {
    const prod = JSON.parse(localStorage.getItem("productosCliente") || "[]");
    const user = JSON.parse(localStorage.getItem("usuarios") || "[]");
    const buy = JSON.parse(localStorage.getItem("compras") || "[]");

    setProductos(prod);
    setUsuarios(user);
    setCompras(buy);
    setProductosCriticos(prod.filter((p: Producto) => (p.stock ?? 0) <= 5));
  }, []);

  // === Totales ===
  const totalProductos = productos.length;
  const totalUsuarios = usuarios.length;
  const totalCompras = compras.length;
  const totalIngresos = compras.reduce((sum, c) => sum + (c.total ?? 0), 0);

  // === Productos en oferta ===
  const productosEnOferta = productos.filter((p) => p.oferta).length;

  // === Usuarios que más compran ===
  const conteoUsuarios: Record<string, number> = {};
  compras.forEach((c) => {
    const nombre = c.usuario || "Desconocido";
    conteoUsuarios[nombre] = (conteoUsuarios[nombre] || 0) + 1;
  });
  const topUsuarios = Object.entries(conteoUsuarios)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  // === Categoría más vendida ===
  const ventasPorCategoria: Record<string, number> = {};
  compras.forEach((c) => {
    c.productos.forEach((p) => {
      const categoria = p.categoria || "Sin categoría";
      ventasPorCategoria[categoria] =
        (ventasPorCategoria[categoria] || 0) + p.cantidad;
    });
  });
  const topCategoria = Object.entries(ventasPorCategoria)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 1)[0];

  // === Productos agregados recientemente (últimos 7 días) ===
  const hoy = new Date();
  const recientes = productos.filter((p) => {
    if (!p.fechaAgregado) return false;
    const fecha = new Date(p.fechaAgregado);
    const diferencia = (hoy.getTime() - fecha.getTime()) / (1000 * 60 * 60 * 24);
    return diferencia <= 7;
  });

  // === Productos más vendidos ===
  const contadorVentas: Record<string, number> = {};
  compras.forEach((c) => {
    c.productos.forEach((p) => {
      contadorVentas[p.nombre] = (contadorVentas[p.nombre] || 0) + p.cantidad;
    });
  });
  const topVendidos = Object.entries(contadorVentas)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <main className="container mt-4">
      <h2 className="text-center mb-4 fw-bold text-primary">📊 Reportes Generales</h2>

      {/* === Indicadores principales === */}
<section className="row g-3 mb-4 text-center justify-content-center">
  <div className="col-lg-2 col-md-3 col-sm-6">
    <div className="card border-0 shadow-sm p-3 h-100">
      <i className="bi bi-box-seam display-6 text-primary mb-2"></i>
      <h6 className="fw-semibold text-secondary mb-1">Productos</h6>
      <h4 className="fw-bold text-dark mb-0">{totalProductos}</h4>
    </div>
  </div>

  <div className="col-lg-2 col-md-3 col-sm-6">
    <div className="card border-0 shadow-sm p-3 h-100">
      <i className="bi bi-tags-fill display-6 text-danger mb-2"></i>
      <h6 className="fw-semibold text-secondary mb-1">Ofertas</h6>
      <h4 className="fw-bold text-danger mb-0">{productosEnOferta}</h4>
    </div>
  </div>

  <div className="col-lg-2 col-md-3 col-sm-6">
    <div className="card border-0 shadow-sm p-3 h-100">
      <i className="bi bi-people-fill display-6 text-success mb-2"></i>
      <h6 className="fw-semibold text-secondary mb-1">Usuarios</h6>
      <h4 className="fw-bold text-dark mb-0">{totalUsuarios}</h4>
    </div>
  </div>

  <div className="col-lg-2 col-md-3 col-sm-6">
    <div className="card border-0 shadow-sm p-3 h-100">
      <i className="bi bi-bag-check-fill display-6 text-warning mb-2"></i>
      <h6 className="fw-semibold text-secondary mb-1">Compras</h6>
      <h4 className="fw-bold text-dark mb-0">{totalCompras}</h4>
    </div>
  </div>

  <div className="col-lg-2 col-md-3 col-sm-6">
    <div className="card border-0 shadow-sm p-3 h-100">
      <i className="bi bi-cash-coin display-6 text-success mb-2"></i>
      <h6 className="fw-semibold text-secondary mb-1">Ingresos Totales</h6>
      <h4 className="fw-bold text-success mb-0">
        ${totalIngresos.toLocaleString()}
      </h4>
    </div>
  </div>
</section>

      {/* === Usuarios que más compran === */}
      <section className="card shadow-sm border-0 p-4 mb-4">
        <h5 className="text-secondary mb-3">Usuarios que más compran</h5>
        {topUsuarios.length === 0 ? (
          <p className="text-center text-muted">No hay compras registradas aún.</p>
        ) : (
          <table className="table table-hover text-center align-middle">
            <thead className="table-light">
              <tr>
                <th>Usuario</th>
                <th>Compras realizadas</th>
              </tr>
            </thead>
            <tbody>
              {topUsuarios.map(([nombre, cantidad]) => (
                <tr key={nombre}>
                  <td>{nombre}</td>
                  <td>{cantidad}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* === Categoría más vendida === */}
      <section className="card shadow-sm border-0 p-4 mb-4">
        <h5 className="text-secondary mb-3">Categoría más vendida</h5>
        {topCategoria ? (
          <p className="fs-5 text-center">
            <strong>{topCategoria[0]}</strong> — {topCategoria[1]} unidades vendidas
          </p>
        ) : (
          <p className="text-center text-muted">No hay datos de ventas aún.</p>
        )}
      </section>

      {/* === Productos con stock bajo === */}
      <section className="card shadow-sm border-0 p-4 mb-4">
        <h5 className="text-danger mb-3">Productos con stock bajo (≤ 5)</h5>
        {productosCriticos.length === 0 ? (
          <p className="text-center text-success mb-0"> No hay productos críticos.</p>
        ) : (
          <table className="table table-striped align-middle text-center">
            <thead className="table-danger">
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
                  <td>
                    <span
                      className={`badge ${
                        (p.stock ?? 0) <= 2 ? "bg-danger" : "bg-warning text-dark"
                      }`}
                    >
                      {p.stock}
                    </span>
                  </td>
                  <td>${p.precio.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* === Top productos más vendidos === */}
      <section className="card shadow-sm border-0 p-4 mb-4">
        <h5 className="text-secondary mb-3">Top 5 productos más vendidos</h5>
        {topVendidos.length === 0 ? (
          <p className="text-muted text-center">Aún no hay ventas registradas.</p>
        ) : (
          <table className="table table-hover text-center align-middle">
            <thead className="table-light">
              <tr>
                <th>Producto</th>
                <th>Unidades vendidas</th>
              </tr>
            </thead>
            <tbody>
              {topVendidos.map(([nombre, cantidad]) => (
                <tr key={nombre}>
                  <td>{nombre}</td>
                  <td className="fw-bold">{cantidad}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* === Productos agregados recientemente === */}
      <section className="card shadow-sm border-0 p-4">
        <h5 className="text-secondary mb-3">Productos agregados recientemente</h5>
        {recientes.length === 0 ? (
          <p className="text-muted text-center">
            No se han agregado productos en los últimos 7 días.
          </p>
        ) : (
          <ul className="list-group">
            {recientes.map((p) => (
              <li
                key={p.id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <span>{p.nombre}</span>
                <small className="text-muted">
                  {new Date(p.fechaAgregado!).toLocaleDateString()}
                </small>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* === Gráfico de categorías === */}
      <section className="card shadow-sm border-0 p-4 mt-4 mb-5">
        <h5 className="text-secondary mb-3">Distribución de productos por categoría</h5>
        <CategoriaChart />
      </section>
    </main>
  );
}

/* === Pequeño gráfico de barras === */
function CategoriaChart() {
  const productos: Producto[] = JSON.parse(localStorage.getItem("productosCliente") || "[]");
  const categorias: Record<string, number> = {};

  productos.forEach((p) => {
    categorias[p.categoria] = (categorias[p.categoria] || 0) + 1;
  });

  const total = Object.values(categorias).reduce((a, b) => a + b, 0);

  if (total === 0)
    return <p className="text-center text-muted">No hay productos registrados aún.</p>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {Object.entries(categorias).map(([categoria, cantidad]) => {
        const porcentaje = ((cantidad / total) * 100).toFixed(1);
        return (
          <div key={categoria}>
            <strong>{categoria}</strong>
            <div
              style={{
                background: "#e9ecef",
                borderRadius: "5px",
                overflow: "hidden",
                height: "20px",
                marginTop: "5px",
              }}
            >
              <div
                style={{
                  width: `${porcentaje}%`,
                  height: "100%",
                  background: "#0d6efd",
                  textAlign: "right",
                  color: "white",
                  fontSize: "12px",
                  paddingRight: "5px",
                }}
              >
                {porcentaje}%
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
