import type { Producto } from "../data/productos";

interface Props {
  producto: Producto;
  onAgregar: (producto: Producto) => void;
}

export default function ProductoCard({ producto, onAgregar }: Props) {
  const tieneOferta = producto.oferta && (producto.descuento ?? 0) > 0;
  const precioFinal = tieneOferta
    ? Math.round(producto.precio * (1 - (producto.descuento ?? 0) / 100))
    : producto.precio;

  const sinStock = (producto.stock ?? 0) <= 0; // 🔹 Detecta si no hay unidades

  return (
    <div className="producto-card" style={{ position: "relative" }}>
      <img src={producto.imagen} alt={producto.nombre} />

      {/* 🔥 Etiqueta de oferta */}
      {tieneOferta && <span className="badge-oferta">🔥 En oferta</span>}

      {/* 🚫 Etiqueta si no hay stock */}
      {sinStock && (
        <span className="badge-sin-stock">🔴 Stock no disponible</span>
      )}

      <h3>{producto.nombre}</h3>
      <p className="categoria">{producto.categoria}</p>

      {/* 💸 Precios */}
      {tieneOferta ? (
        <p className="precio">
          <span className="precio-anterior">${producto.precio}</span>{" "}
          <span className="precio-oferta">${precioFinal}</span>
          <span className="descuento"> (-{producto.descuento}%)</span>
        </p>
      ) : (
        <p className="precio-normal">${producto.precio}</p>
      )}

      {/* 🛒 Botón (bloqueado si no hay stock) */}
      <button
        onClick={() => onAgregar(producto)}
        disabled={sinStock}
        className={sinStock ? "btn-disabled" : ""}
      >
        {sinStock ? "Agotado" : "🛒 Añadir al carrito"}
      </button>
    </div>
  );
}
