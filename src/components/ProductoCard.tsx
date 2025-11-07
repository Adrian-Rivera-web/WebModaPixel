import { useState } from "react";
import type { Producto } from "../data/productos";

interface Props {
  producto: Producto;
  onAgregar: (producto: Producto) => void;
}

export default function ProductoCard({ producto, onAgregar }: Props) {
  const [mensaje, setMensaje] = useState<string>("");

  const handleAgregar = () => {
    onAgregar(producto);
    setMensaje("✅ Producto añadido al carrito");

    // El mensaje desaparece después de 2 segundos
    setTimeout(() => setMensaje(""), 2000);
  };

  return (
    <div className="producto-card">
      <img src={producto.imagen} alt={producto.nombre} width="100%" />
      <h3>{producto.nombre}</h3>
      <p>Precio: ${producto.precio}</p>
      <button onClick={handleAgregar}>Añadir al carrito</button>

      {/* Mensaje de confirmación */}
      {mensaje && <p className="mensaje-exito">{mensaje}</p>}
    </div>
  );
}
