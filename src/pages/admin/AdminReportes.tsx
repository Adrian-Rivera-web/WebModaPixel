import { useEffect, useState } from "react";
import "../../assets/css/styles.css";

interface Compra {
  id: number;
  total: number;
  productos: any[];
  fecha: string;
}

interface Producto {
  id: number;
  nombre: string;
  stock: number;
  precio: number;
  categoria: string;
}

interface Usuario {
  nombre: string;
  correo: string;
  tipo?: string;
}

export default function AdminReportes() {
  const [totalProductos, setTotalProductos] = useState(0);
  const [totalUsuarios, setTotalUsuarios] = useState(0);
  const [totalCompras, setTotalCompras] = useState(0);
  const [productosCriticos, setProductosCriticos] = useState<Producto[]>([]);

  useEffect(() => {
    // 🧮 Productos
    const productosCliente: Producto[] = JSON.parse(localStorage.getItem("productosCliente") || "[]");
    setTotalProductos(productosCliente.length);
    setProductosCriticos(productosCliente.filter((p) => (p.stock ?? 0) <= 5));

    // 👤 Usuarios
    const usuarios: Usuario[] = JSON.parse(localStorage.getItem("usuarios") || "[]");
    setTotalUsuarios(usuarios.length);

    // 💰 Compras
    const compras: Compra[] = JSON.parse(localStorage.getItem("compras") || "[]");
    setTotalCompras(compras.length);
  }, []);

  // 💰 Total de ingresos acumulado
  const totalIngresos = JSON.parse(localStorage.getItem("compras") || "[]")
    .reduce((sum: number, c: any) => sum + (c.total ?? 0), 0);

  return (
    <main className="container mt-4">
      <h2 className="text-center mb-4 fw-bold text-primary">📊 Reportes Generales</h2>

      {/* Indicadores principales */}
      <section className="row text-center mb-4">
        <div className="col-md-3 mb-3">
          <div className="card shadow-sm border-0 p-3 bg-light">
            <h5>📦 Productos</h5>
            <h3 className="text-primary fw-bold">{totalProductos}</h3>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card shadow-sm border-0 p-3 bg-light">
            <h5>👥 Usuarios</h5>
            <h3 className="text-success fw-bold">{totalUsuarios}</h3>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card shadow-sm border-0 p-3 bg-light">
            <h5>🧾 Compras</h5>
            <h3 className="text-warning fw-bold">{totalCompras}</h3>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card shadow-sm border-0 p-3 bg-light">
            <h5>💰 Ingresos Totales</h5>
            {/* 🔹 Cambiado de text-danger a text-success */}
            <h4 className="text-success fw-bold">${totalIngresos.toLocaleString()}</h4>
          </div>
        </div>
      </section>

      {/* Productos críticos */}
      <section className="card shadow-sm border-0 p-4 mb-4">
        <h4 className="mb-3 text-secondary">⚠️ Productos con stock bajo (≤ 5)</h4>

        {productosCriticos.length === 0 ? (
          <p className="text-center text-success">✅ No hay productos críticos en este momento.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle">
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
                    <td className="fw-bold text-danger">{p.stock}</td>
                    <td>${p.precio}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* (Opcional) Gráfico simple con barras */}
      <section className="card shadow-sm border-0 p-4">
        <h4 className="mb-3 text-secondary">📈 Distribución de productos por categoría</h4>
        <CategoriaChart />
      </section>
    </main>
  );
}

/* 🔹 Pequeño gráfico inline sin librerías externas */
function CategoriaChart() {
  const productos: Producto[] = JSON.parse(localStorage.getItem("productosCliente") || "[]");
  const categorias: Record<string, number> = {};

  productos.forEach((p) => {
    categorias[p.categoria] = (categorias[p.categoria] || 0) + 1;
  });

  const total = Object.values(categorias).reduce((a, b) => a + b, 0);

  if (total === 0) {
    return <p className="text-center text-muted">No hay productos registrados aún.</p>;
  }

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
                  background: "#198754", // 🔹 Verde Bootstrap (éxito)
                  textAlign: "right",
                  color: "white",
                  fontSize: "12px",
                  paddingRight: "5px",
                  borderRadius: "5px",
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
