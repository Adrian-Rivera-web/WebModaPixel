import { useEffect, useState } from "react";
import type { Producto } from "../../data/productos";

export default function AdminOfertas() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [mensaje, setMensaje] = useState("");

  // 🔹 Cargar productos del localStorage o iniciales
  useEffect(() => {
    const guardados = JSON.parse(localStorage.getItem("productosCliente") || "[]");
    setProductos(guardados);
  }, []);

  // Guardar cambios
  const guardarCambios = (lista: Producto[]) => {
    setProductos(lista);
    localStorage.setItem("productosCliente", JSON.stringify(lista));
    setMensaje("Ofertas actualizadas correctamente");
    setTimeout(() => setMensaje(""), 2000);
  };

  // 🟡 Activar/desactivar oferta con validación de stock
  const toggleOferta = (id: number) => {
    const producto = productos.find((p) => p.id === id);
    if (!producto) return;

    // 🚫 Evita activar oferta si no hay stock
    if (!producto.oferta && (producto.stock ?? 0) <= 0) {
      alert(`⚠️ No puedes activar una oferta para "${producto.nombre}" porque no hay stock disponible.`);
      return;
    }

    const actualizados = productos.map((p) =>
      p.id === id
        ? { ...p, oferta: !p.oferta, descuento: p.oferta ? 0 : (p.descuento ?? 10) }
        : p
    );

    guardarCambios(actualizados);
  };

  // Cambiar descuento
  const cambiarDescuento = (id: number) => {
    const nuevoDescuento = parseInt(
      prompt("Ingrese nuevo descuento (%)", "20") || "0"
    );

    if (isNaN(nuevoDescuento) || nuevoDescuento < 1 || nuevoDescuento > 90) {
      alert("Ingrese un valor entre 1 y 90");
      return;
    }

    const actualizados = productos.map((p) =>
      p.id === id ? { ...p, descuento: nuevoDescuento, oferta: true } : p
    );
    guardarCambios(actualizados);
  };

  // 📋 Lista filtrada de productos con y sin oferta
  const productosConOferta = productos.filter((p) => p.oferta);
  const productosSinOferta = productos.filter((p) => !p.oferta);

  return (
    <main className="container mt-4">
      <h2 className="text-center mb-4 fw-bold text-primary">Gestión de Ofertas</h2>

      {mensaje && (
        <div className="alert alert-success text-center">{mensaje}</div>
      )}

      {/* 🔸 Productos en oferta */}
      <section className="card shadow-sm p-3 mb-4 border-0">
        <h4 className="text-secondary mb-3">Productos con oferta activa</h4>
        {productosConOferta.length === 0 ? (
          <p>No hay productos en oferta actualmente.</p>
        ) : (
          <table className="table table-hover align-middle">
            <thead className="table-warning">
              <tr>
                <th>ID</th>
                <th>Imagen</th>
                <th>Nombre</th>
                <th>Precio original</th>
                <th>Descuento</th>
                <th>Precio final</th>
                <th>Stock</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productosConOferta.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>
                    <img
                      src={p.imagen}
                      alt={p.nombre}
                      style={{ width: "60px", borderRadius: "8px" }}
                    />
                  </td>
                  <td>{p.nombre}</td>
                  <td>${p.precio}</td>
                  <td>{p.descuento ?? 0}%</td>
                  <td>
                    ${Math.round(p.precio * (1 - (p.descuento ?? 0) / 100))}
                  </td>
                  <td>{p.stock ?? 0}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-warning me-2"
                      onClick={() => cambiarDescuento(p.id)}
                    >
                      Editar descuento
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => toggleOferta(p.id)}
                    >
                      Quitar oferta
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* 🔹 Productos sin oferta */}
      <section className="card shadow-sm p-3 border-0">
        <h4 className="text-secondary mb-3">Productos sin oferta</h4>
        {productosSinOferta.length === 0 ? (
          <p>Todos los productos tienen una oferta activa.</p>
        ) : (
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Imagen</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productosSinOferta.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>
                    <img
                      src={p.imagen}
                      alt={p.nombre}
                      style={{ width: "60px", borderRadius: "8px" }}
                    />
                  </td>
                  <td>{p.nombre}</td>
                  <td>${p.precio}</td>
                  <td>{p.stock ?? 0}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-success"
                      onClick={() => toggleOferta(p.id)}
                    >
                      Activar oferta (10%)
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}
