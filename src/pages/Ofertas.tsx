import { productos } from "../data/productos";
import "../assets/css/styles.css";

interface ProductoEnOferta {
  id: number;
  nombre: string;
  imagen: string;
  precio: number;
  precioAnterior: number;
  descuento: number;
  categoria?: string;
}

export default function Ofertas() {
  // 🔸 Simulamos productos en oferta (25% descuento si valen menos de $20000)
  const productosEnOferta: ProductoEnOferta[] = productos
    .filter((p) => p.precio < 20000)
    .map((p) => ({
      id: p.id,
      nombre: p.nombre,
      imagen: p.imagen,
      precio: p.precio,
      precioAnterior: Math.round(p.precio * 1.25),
      descuento: 25,
      categoria: p.categoria,
    }));

  return (
    <main className="ofertas-container">
      <h2>🔥 Ofertas Especiales 🔥</h2>
      <p>Descubre los productos con precios rebajados por tiempo limitado.</p>

      {productosEnOferta.length > 0 ? (
        <section className="ofertas-grid">
          {productosEnOferta.map((p) => (
            <div key={p.id} className="producto-oferta">
              <img src={p.imagen} alt={p.nombre} />
              <h3>{p.nombre}</h3>
              <p className="categoria">{p.categoria}</p>
              <p className="precio-anterior">Antes: ${p.precioAnterior}</p>
              <p className="precio-oferta">Ahora: ${p.precio}</p>
              <p className="descuento">Descuento: -{p.descuento}%</p>
            </div>
          ))}
        </section>
      ) : (
        <p>No hay ofertas disponibles actualmente 😢</p>
      )}
    </main>
  );
}
