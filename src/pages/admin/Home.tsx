import { useEffect, useState } from "react";

export default function AdminHome() {
  const [totalProductos, setTotalProductos] = useState(0);
  const [totalCompras, setTotalCompras] = useState(0);
  const [totalUsuarios, setTotalUsuarios] = useState(0);
  const [ultimasCompras, setUltimasCompras] = useState<any[]>([]);

  useEffect(() => {
    const productos = JSON.parse(localStorage.getItem("productosCliente") || "[]");
    const compras = JSON.parse(localStorage.getItem("compras") || "[]");
    const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");

    setTotalProductos(productos.length);
    setTotalCompras(compras.length);
    setTotalUsuarios(usuarios.length);

    // Mostrar solo las últimas 3 compras
    setUltimasCompras(compras.slice(-3).reverse());
  }, []);

  return (
    <main className="container mt-4">
      <h2 className="text-center mb-4 fw-bold text-primary">
        📊 Panel de Administración
      </h2>

      {/* 🔸 Resumen general */}
      <div className="row text-center g-4">
        <div className="col-md-4">
          <div className="card p-3 shadow-sm border-0">
            <h5>Productos</h5>
            <h2 className="text-success">{totalProductos}</h2>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card p-3 shadow-sm border-0">
            <h5>Usuarios</h5>
            <h2 className="text-info">{totalUsuarios}</h2>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card p-3 shadow-sm border-0">
            <h5>Compras</h5>
            <h2 className="text-warning">{totalCompras}</h2>
          </div>
        </div>
      </div>

      {/* 🔸 Últimas compras */}
      <section className="card shadow-sm border-0 p-4 mt-4">
        <h5 className="text-secondary mb-3">🧾 Últimas Compras</h5>
        {ultimasCompras.length === 0 ? (
          <p className="text-muted text-center">Aún no hay compras registradas.</p>
        ) : (
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Comprador</th>
                <th>Fecha</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {ultimasCompras.map((compra) => (
                <tr key={compra.id}>
                  <td>{compra.id}</td>
                  <td>{compra.comprador}</td>
                  <td>{compra.fecha}</td>
                  <td>${compra.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <p className="text-center mt-4 text-muted">
        👋 Bienvenido al panel administrativo — aquí puedes gestionar tu tienda.
      </p>
    </main>
  );
}
