import { useState } from "react";
import { productos } from "../data/productos";
import type { Producto } from "../data/productos";
import ProductoCard from "../components/ProductoCard";

export default function Categorias() {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>("");

  // Obtener todas las categorías únicas (basado en los productos)
  const categorias = Array.from(new Set(productos.map(p => p.categoria))).filter(c => c);

  // Filtrar productos según la categoría seleccionada
  const productosFiltrados = categoriaSeleccionada
    ? productos.filter(p => p.categoria === categoriaSeleccionada)
    : productos;

  return (
    <main>
      <h2>Filtrar por Categoría</h2>

      {/* Selector de categorías */}
      <div style={{ margin: "20px auto", maxWidth: "300px" }}>
        <select
          value={categoriaSeleccionada}
          onChange={(e) => setCategoriaSeleccionada(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "6px",
            fontSize: "16px",
          }}
        >
          <option value="">Todas las categorías</option>
          {categorias.map((cat, index) => (
            <option key={index} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Lista de productos */}
      <section id="productos" style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center" }}>
        {productosFiltrados.length > 0 ? (
          productosFiltrados.map((p: Producto) => (
            <ProductoCard key={p.id} producto={p} onAgregar={() => {}} />
          ))
        ) : (
          <p>No hay productos disponibles en esta categoría.</p>
        )}
      </section>
    </main>
  );
}
