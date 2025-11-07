import { useEffect, useState } from "react";

// Tipos para mantener el código ordenado
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

export default function AdminCompras() {
  const [compras, setCompras] = useState<Compra[]>([]);
  const [compraSeleccionada, setCompraSeleccionada] = useState<Compra | null>(null);

  // 🔹 Cargar todas las compras desde localStorage al montar el componente
  useEffect(() => {
    const datos = JSON.parse(localStorage.getItem("compras") || "[]");
    setCompras(datos);
  }, []);

  // 🔹 Mostrar el modal con los detalles de una compra
  const verDetalles = (compra: Compra) => {
    setCompraSeleccionada(compra);
    const modal = document.getElementById("modalCompra");
    if (modal) {
      // Bootstrap 5 modal básico (manual)
      modal.style.display = "block";
      modal.classList.add("show");
      modal.removeAttribute("aria-hidden");
    }
  };

  // 🔹 Cerrar el modal
  const cerrarModal = () => {
    const modal = document.getElementById("modalCompra");
    if (modal) {
      modal.style.display = "none";
      modal.classList.remove("show");
      modal.setAttribute("aria-hidden", "true");
    }
    setCompraSeleccionada(null);
  };

  if (compras.length === 0) {
    return (
      <main className="container mt-4 text-center">
        <h2>🧾 Gestión de Compras</h2>
        <p>No hay compras registradas aún.</p>
      </main>
    );
  }

  return (
    <main className="container mt-4">
      <h2 className="text-center mb-3">🧾 Historial de Compras</h2>

      <table className="table table-striped table-bordered shadow-sm">
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
                <button className="btn btn-sm btn-info" onClick={() => verDetalles(c)}>
                  Ver detalles
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal visual con los detalles de la compra */}
      {compraSeleccionada && (
        <div
          className="modal fade show"
          id="modalCompra"
          style={{
            display: "block",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
          }}
          aria-modal="true"
          role="dialog"
        >
          <div
            className="modal-dialog modal-lg modal-dialog-centered"
            style={{ color: "black" }}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  🧾 Detalle de la compra #{compraSeleccionada.id}
                </h5>
                <button type="button" className="btn-close" onClick={cerrarModal}></button>
              </div>

              <div className="modal-body">
                <p>
                  <strong>Cliente:</strong> {compraSeleccionada.comprador}
                </p>
                <p>
                  <strong>Correo:</strong> {compraSeleccionada.correo}
                </p>
                <p>
                  <strong>Fecha:</strong> {compraSeleccionada.fecha}
                </p>

                <h6 className="mt-3">🛍️ Productos Comprados</h6>
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Cantidad</th>
                      <th>Precio unitario</th>
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

                <h5 className="text-end mt-3">
                  💰 <strong>Total:</strong> ${compraSeleccionada.total}
                </h5>
              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={cerrarModal}>
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
