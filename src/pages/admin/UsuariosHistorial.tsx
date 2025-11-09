import { useState, useEffect } from "react";

interface ProductoCompra {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
}

interface Compra {
  id: number;
  comprador: string;
  correo: string;
  fecha: string;
  total: number;
  productos: ProductoCompra[];
}

export default function UsuariosHistorial() {
  const [compras, setCompras] = useState<Compra[]>([]);
  const [compraSeleccionada, setCompraSeleccionada] = useState<Compra | null>(
    null
  );

  // 🔹 Cargar compras desde localStorage
  useEffect(() => {
    const datos = JSON.parse(localStorage.getItem("compras") || "[]");
    setCompras(datos);
  }, []);

  // 📋 Mostrar detalles de compra
  const verDetalles = (compra: Compra) => {
    setCompraSeleccionada(compra);
  };

  // ❌ Cerrar detalles
  const cerrarDetalles = () => {
    setCompraSeleccionada(null);
  };

  return (
    <section>
      <h5 className="text-secondary mb-3">Historial de Compras</h5>

      {compras.length === 0 ? (
        <p className="text-center text-muted">No hay compras registradas.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-bordered shadow-sm align-middle">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Correo</th>
                <th>Fecha</th>
                <th>Total</th>
                <th>Detalles</th>
              </tr>
            </thead>
            <tbody>
              {compras.map((c) => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.comprador}</td>
                  <td>{c.correo}</td>
                  <td>{c.fecha}</td>
                  <td>${c.total}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-info"
                      onClick={() => verDetalles(c)}
                    >
                      Ver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 📦 Detalle de compra */}
      {compraSeleccionada && (
        <div className="card mt-4 shadow-sm p-4 bg-white">
          <h5 className="text-primary mb-3">
            Detalle de compra #{compraSeleccionada.id}
          </h5>
          <p>
            <strong>Cliente:</strong> {compraSeleccionada.comprador}
          </p>
          <p>
            <strong>Correo:</strong> {compraSeleccionada.correo}
          </p>
          <p>
            <strong>Fecha:</strong> {compraSeleccionada.fecha}
          </p>

          <table className="table table-bordered mt-3">
            <thead className="table-secondary">
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio Unitario</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {compraSeleccionada.productos.map((p) => (
                <tr key={p.id}>
                  <td>{p.nombre}</td>
                  <td>{p.cantidad}</td>
                  <td>${p.precio}</td>
                  <td>${p.precio * p.cantidad}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h5 className="text-end mt-3 text-success">
            Total: ${compraSeleccionada.total}
          </h5>

          <div className="text-center mt-3">
            <button className="btn btn-secondary" onClick={cerrarDetalles}>
              Cerrar detalle
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
