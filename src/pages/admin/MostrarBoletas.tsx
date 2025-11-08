import { useEffect, useState } from "react";
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

export default function MostrarBoletas() {
  const [boletas, setBoletas] = useState<Compra[]>([]);

  useEffect(() => {
    const guardadas = JSON.parse(localStorage.getItem("compras") || "[]");
    setBoletas(guardadas);
  }, []);

  return (
    <section>
      <h3 className="text-secondary mb-3">📑 Boletas Emitidas</h3>

      {boletas.length === 0 ? (
        <p>No hay boletas registradas.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-primary">
              <tr>
                <th>ID Boleta</th>
                <th>Cliente</th>
                <th>Correo</th>
                <th>Fecha</th>
                <th>Total</th>
                <th>Productos</th>
              </tr>
            </thead>
            <tbody>
              {boletas.map((b) => (
                <tr key={b.id}>
                  <td>{b.id}</td>
                  <td>{b.comprador}</td>
                  <td>{b.correo}</td>
                  <td>{b.fecha}</td>
                  <td>${b.total}</td>
                  <td>
                    <ul style={{ margin: 0, paddingLeft: "1.2rem" }}>
                      {b.productos.map((p) => (
                        <li key={p.id}>
                          {p.nombre} (x{p.cantidad}) - ${p.precio * p.cantidad}
                        </li>
                      ))}
                    </ul>
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
