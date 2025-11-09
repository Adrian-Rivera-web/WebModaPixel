import { useEffect, useState } from "react";
import { useLocation, Routes, Route, Link } from "react-router-dom";
import MostrarBoletas from "./MostrarBoletas";
import "../../assets/css/styles.css";

interface Compra {
  id: number;
  comprador: string;
  correo: string;
  fecha: string;
  total: number;
  productos: {
    id: number;
    nombre: string;
    precio: number;
    cantidad: number;
  }[];
}

export default function AdminOrdenes() {
  const [boletas, setBoletas] = useState<Compra[]>([]);
  const location = useLocation();

  // 🔹 Carga las boletas desde localStorage
  useEffect(() => {
    const guardadas = JSON.parse(localStorage.getItem("compras") || "[]");
    setBoletas(guardadas);
  }, []);

  // 📊 Totales
  const totalBoletas = boletas.length;
  const totalVentas = boletas.reduce((sum, b) => sum + b.total, 0);
  const clientesUnicos = new Set(boletas.map((b) => b.comprador)).size;

  // 🕓 Últimas 3 boletas
  const ultimasBoletas = boletas.slice(-3).reverse();

  return (
    <main className="container mt-4">
      <h2 className="fw-bold text-primary mb-3">Gestión de Órdenes</h2>
      <p className="mb-4">
        Desde esta sección puedes visualizar las órdenes generadas y las boletas de venta emitidas.
      </p>

      {/* 📊 Resumen general */}
      <section className="card p-4 shadow-sm mb-4">
        <h5 className="text-secondary mb-3">Resumen general</h5>
        <div className="d-flex flex-wrap gap-4">
          <div className="card p-3 bg-light flex-fill text-center">
            <h6>Total de Boletas</h6>
            <h4>{totalBoletas}</h4>
          </div>
          <div className="card p-3 bg-light flex-fill text-center">
            <h6>Total de Ventas</h6>
            <h4>${totalVentas.toLocaleString()}</h4>
          </div>
          <div className="card p-3 bg-light flex-fill text-center">
            <h6>Clientes Atendidos</h6>
            <h4>{clientesUnicos}</h4>
          </div>
        </div>
      </section>

      {/* 🕓 Últimas boletas */}
      <section className="card p-4 shadow-sm mb-4">
        <h5 className="text-secondary mb-3">Últimas Boletas Emitidas</h5>

        {ultimasBoletas.length === 0 ? (
          <p>No hay boletas registradas todavía.</p>
        ) : (
          <table className="table table-hover align-middle">
            <thead className="table-primary">
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {ultimasBoletas.map((b) => (
                <tr key={b.id}>
                  <td>{b.id}</td>
                  <td>{b.comprador}</td>
                  <td>{b.fecha}</td>
                  <td>${b.total.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Botón de navegación */}
      <div className="text-end">
        {!location.pathname.endsWith("/boletas") && (
          <Link to="/admin/ordenes/boletas" className="btn btn-outline-primary">
            Mostrar Boletas
          </Link>
        )}
      </div>

      {/* Subruta interna */}
      <Routes>
        <Route path="boletas" element={<MostrarBoletas />} />
      </Routes>
    </main>
  );
}
