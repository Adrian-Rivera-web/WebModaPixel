import { useNavigate } from "react-router-dom";
import "../assets/css/carrito.css";
import { useCarrito } from "../context/CarritoContext";

export default function Carrito() {
  const {
    carrito,
    eliminarProducto,
    vaciarCarrito,
    actualizarCantidad,
    total,
  } = useCarrito();
  const navigate = useNavigate();

  // 🔍 Obtener stock desde productosCliente (para respetar stock del admin)
  const getStockDisponible = (id: number) => {
    const productosCliente = JSON.parse(
      localStorage.getItem("productosCliente") || "[]"
    );
    const productoOriginal = productosCliente.find((p: any) => p.id === id);
    return productoOriginal?.stock ?? 0;
  };

  const cambiarCantidadConStock = (id: number, nuevaCantidad: number) => {
    if (nuevaCantidad <= 0) {
      eliminarProducto(id);
      return;
    }

    const stockDisponible = getStockDisponible(id);
    if (nuevaCantidad > stockDisponible) {
      alert(
        `No puedes agregar más unidades. Solo hay ${stockDisponible} disponibles en stock.`
      );
      return;
    }

    actualizarCantidad(id, nuevaCantidad);
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
                  ? Math.round(
                      item.precio * (1 - (item.descuento ?? 0) / 100)
                    )
                  : item.precio;
                const subtotal = precioFinal * item.cantidad;

                return (
                  <tr key={item.id}>
                    <td>
                      <img src={item.imagen} alt={item.nombre} />
                    </td>
                    <td>{item.nombre}</td>

                    <td>
                      {tieneOferta ? (
                        <>
                          <span
                            style={{
                              textDecoration: "line-through",
                              color: "#888",
                            }}
                          >
                            ${item.precio}
                          </span>
                          <br />
                          <span
                            style={{
                              color: "#e63946",
                              fontWeight: "bold",
                            }}
                          >
                            ${precioFinal}
                          </span>
                        </>
                      ) : (
                        <>${item.precio}</>
                      )}
                    </td>

                    <td>
                      {tieneOferta ? (
                        <span
                          style={{ color: "#2a9d8f", fontWeight: "bold" }}
                        >
                          -{item.descuento}%
                        </span>
                      ) : (
                        <span>—</span>
                      )}
                    </td>

                    <td>
                      <div className="cantidad-controls">
                        <button
                          onClick={() =>
                            cambiarCantidadConStock(
                              item.id,
                              item.cantidad - 1
                            )
                          }
                        >
                          -
                        </button>
                        <span>{item.cantidad}</span>
                        <button
                          onClick={() =>
                            cambiarCantidadConStock(
                              item.id,
                              item.cantidad + 1
                            )
                          }
                        >
                          +
                        </button>
                      </div>
                    </td>

                    <td>${subtotal}</td>

                    <td>
                      <button
                        className="btn-eliminar"
                        onClick={() => eliminarProducto(item.id)}
                      >
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
            <button onClick={() => navigate("/productos")}>
              Seguir comprando
            </button>
            <button onClick={() => navigate("/checkout")}>
              Proceder al pago
            </button>
          </section>
        </>
      )}
    </main>
  );
}
