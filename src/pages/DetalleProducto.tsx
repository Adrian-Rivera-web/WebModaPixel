import { useParams } from "react-router-dom";
import { productos } from "../data/productos";
import type { Producto } from "../data/productos";
import "../assets/css/styles.css";

export default function DetalleProducto() {
  const { id } = useParams<{ id: string }>();
  const producto = productos.find((p) => p.id === Number(id));

  const agregarAlCarrito = (p: Producto) => {
    const carrito = JSON.parse(localStorage.getItem("carrito") || "[]");
    carrito.push(p);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    alert(`${p.nombre} fue añadido al carrito 🛒`);
  };

  if (!producto) {
    return <p>❌ Producto no encontrado</p>;
  }

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
            <strong>Precio:</strong> ${producto.precio}
          </p>
          <p>
            <strong>Descripción:</strong> {producto.descripcion}
          </p>
          <button onClick={() => agregarAlCarrito(producto)}>Añadir al carrito</button>
        </div>
      </div>
    </main>
  );
}
