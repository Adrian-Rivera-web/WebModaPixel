import { useEffect, useState } from "react";
import type { Producto } from "../data/productos";
import "../assets/css/styles.css";

export default function Ofertas() {
  const [productos, setProductos] = useState<Producto[]>([]);

  useEffect(() => {
    // 🧩 Cargar desde localStorage (productos actualizados por admin)
    const guardados = JSON.parse(localStorage.getItem("productosCliente") || "[]");
    setProductos(guardados);
  }, []);

  // 🔍 Filtrar solo productos con oferta activa
  const productosEnOferta = productos.filter((p) => p.oferta && (p.descuento ?? 0) > 0);

  return (
    <main className="ofertas-container">
      <h2>🔥 Ofertas Especiales 🔥</h2>
      <p>Descubre los productos con precios rebajados por tiempo limitado.</p>

      {productosEnOferta.length > 0 ? (
        <section className="ofertas-grid">
          {productosEnOferta.map((p) => {
            const precioFinal = Math.round(p.precio * (1 - (p.descuento ?? 0) / 100));
            return (
              <div key={p.id} className="producto-oferta">
                <img src={p.imagen} alt={p.nombre} />
                <h3>{p.nombre}</h3>
                <p className="categoria">{p.categoria}</p>
                <p className="precio-anterior">Antes: ${p.precio}</p>
                <p className="precio-oferta">Ahora: ${precioFinal}</p>
                <p className="descuento">Descuento: -{p.descuento}%</p>
              </div>
            );
          })}
        </section>
      ) : (
        <p>No hay ofertas disponibles actualmente </p>
      )}
    </main>
  );
}
