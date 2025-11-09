import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Producto } from "../data/productos";
import "../assets/css/carrito.css";

interface ProductoConCantidad extends Producto {
  cantidad: number;
}

export default function Carrito() {
  const [carrito, setCarrito] = useState<ProductoConCantidad[]>([]);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  // 🔹 Cargar carrito desde localStorage
  useEffect(() => {
    const carritoGuardado = JSON.parse(localStorage.getItem("carrito") || "[]");
    setCarrito(carritoGuardado);
    calcularTotal(carritoGuardado);
  }, []);

  // 💰 Calcular total (considera ofertas)
  const calcularTotal = (carritoActual: ProductoConCantidad[]) => {
    const totalCalculado = carritoActual.reduce((sum, item) => {
      const tieneOferta = item.oferta && (item.descuento ?? 0) > 0;
      const precioFinal = tieneOferta
        ? Math.round(item.precio * (1 - (item.descuento ?? 0) / 100))
        : item.precio;
      return sum + precioFinal * item.cantidad;
    }, 0);

    setTotal(totalCalculado);
  };

  // 🗑️ Eliminar un producto
  const eliminarDelCarrito = (id: number) => {
    const nuevoCarrito = carrito.filter((item) => item.id !== id);
    setCarrito(nuevoCarrito);
    localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
    calcularTotal(nuevoCarrito);
  };

  // ➕➖ Cambiar cantidad (con control de stock)
  const actualizarCantidad = (id: number, nuevaCantidad: number) => {
    if (nuevaCantidad <= 0) {
      eliminarDelCarrito(id);
      return;
    }

    const productosCliente = JSON.parse(localStorage.getItem("productosCliente") || "[]");
    const productoOriginal = productosCliente.find((p: any) => p.id === id);
    const stockDisponible = productoOriginal?.stock ?? 0;

    const productoCarrito = carrito.find((p) => p.id === id);
    if (productoCarrito && nuevaCantidad > stockDisponible) {
      alert(`No puedes agregar más unidades. Solo hay ${stockDisponible} disponibles en stock.`);
      return;
    }

    const nuevoCarrito = carrito.map((item) =>
      item.id === id ? { ...item, cantidad: nuevaCantidad } : item
    );
    setCarrito(nuevoCarrito);
    localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
    calcularTotal(nuevoCarrito);
  };

  // 🧹 Vaciar carrito
  const vaciarCarrito = () => {
    localStorage.removeItem("carrito");
    setCarrito([]);
    setTotal(0);
  };

  return (
    <main className="carrito-container">
      <h2>🛒 Carrito de Compras</h2>

      {carrito.length === 0 ? (
        <p style={{ textAlign: "center" }}>Tu carrito está vacío</p>
      ) : (
        <>
          <table className="carrito-tabla">
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Nombre</th>
                <th>Precio Unitario</th>
                <th>Descuento</th>
                <th>Cantidad</th>
                <th>Subtotal</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {carrito.map((item) => {
                const tieneOferta = item.oferta && (item.descuento ?? 0) > 0;
                const precioFinal = tieneOferta
                  ? Math.round(item.precio * (1 - (item.descuento ?? 0) / 100))
                  : item.precio;
                const subtotal = precioFinal * item.cantidad;

                return (
                  <tr key={item.id}>
                    <td>
                      <img src={item.imagen} alt={item.nombre} />
                    </td>
                    <td>{item.nombre}</td>

                    {/* 💸 Precio original */}
                    <td>
                      {tieneOferta ? (
                        <>
                          <span style={{ textDecoration: "line-through", color: "#888" }}>
                            ${item.precio}
                          </span>
                          <br />
                          <span style={{ color: "#e63946", fontWeight: "bold" }}>
                            ${precioFinal}
                          </span>
                        </>
                      ) : (
                        <>${item.precio}</>
                      )}
                    </td>

                    {/* 🏷️ Nueva columna de descuento */}
                    <td>
                      {tieneOferta ? (
                        <span style={{ color: "#2a9d8f", fontWeight: "bold" }}>
                          -{item.descuento}%
                        </span>
                      ) : (
                        <span>—</span>
                      )}
                    </td>

                    {/* ➕➖ Cantidad */}
                    <td>
                      <div className="cantidad-controls">
                        <button onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}>
                          -
                        </button>
                        <span>{item.cantidad}</span>
                        <button onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}>
                          +
                        </button>
                      </div>
                    </td>

                    {/* 💰 Subtotal */}
                    <td>${subtotal}</td>

                    {/* 🗑️ Eliminar */}
                    <td>
                      <button className="btn-eliminar" onClick={() => eliminarDelCarrito(item.id)}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <section className="carrito-total">
            <h3>Total: ${total}</h3>
            <button onClick={vaciarCarrito}>Vaciar carrito</button>
            <button onClick={() => navigate("/productos")}>Seguir comprando</button>
            <button onClick={() => navigate("/checkout")}>Proceder al pago</button>
          </section>
        </>
      )}
    </main>
  );
}
