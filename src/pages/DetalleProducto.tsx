import { useParams } from "react-router-dom";
import "../assets/css/styles.css";
import type { Producto } from "../data/productos";
import { useProductos } from "../hooks/useProductos";
import { useCarrito } from "../context/CarritoContext";

export default function DetalleProducto() {
  const { id } = useParams<{ id: string }>();
  const { productos } = useProductos();
  const { agregarProducto } = useCarrito();

  const producto: Producto | undefined = productos.find(
    (p) => p.id === Number(id)
  );

  if (!producto) {
    return <p>❌ Producto no encontrado</p>;
  }

  const tieneOferta = producto.oferta && (producto.descuento ?? 0) > 0;
  const precioFinal = tieneOferta
    ? Math.round(producto.precio * (1 - (producto.descuento ?? 0) / 100))
    : producto.precio;

  return (
    <main className="detalle-container">
      <h2>{producto.nombre}</h2>
      <div className="detalle-content">
        <img
          src={producto.imagen}
          alt={producto.nombre}
          className="detalle-imagen"
          style={{ maxWidth: "300px", borderRadius: "10px" }}
        />
        <div className="detalle-info">
          <p>
            <strong>Precio:</strong>{" "}
            {tieneOferta ? (
              <>
                <span
                  style={{
                    textDecoration: "line-through",
                    color: "#888",
                    marginRight: "8px",
                  }}
                >
                  ${producto.precio}
                </span>
                <span style={{ fontWeight: "bold", color: "#e63946" }}>
                  ${precioFinal}
                </span>
                <span style={{ marginLeft: 4 }}>(-{producto.descuento}%)</span>
              </>
            ) : (
              <>${producto.precio}</>
            )}
          </p>
          <p>
            <strong>Descripción:</strong> {producto.descripcion}
          </p>
          <button onClick={() => agregarProducto(producto)}>
            Añadir al carrito
          </button>
        </div>
      </div>
    </main>
  );
}
