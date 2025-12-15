import { useState } from "react";
import type { Producto } from "../data/productos";
import { productos as productosBase } from "../data/productos";
import ProductoCard from "../components/ProductoCard";
import { useCarrito } from "../context/CarritoContext";
import { cargarCategorias } from "../data/categorias";

export default function Categorias() {
  const { agregarProducto } = useCarrito();
  const [categoriaSeleccionada, setCategoriaSeleccionada] =
    useState<string>("");

  const productosCliente = JSON.parse(
    localStorage.getItem("productosCliente") || "[]"
  );
  const productos: Producto[] =
    Array.isArray(productosCliente) && productosCliente.length > 0
      ? productosCliente
      : productosBase;

  // Categorías derivadas de los productos (backup)
  const categoriasDeProductos = Array.from(
    new Set(productos.map((p) => p.categoria).filter(Boolean))
  ) as string[];

  // Categorías que vienen del admin (módulo categorias.ts)
  const categoriasAdmin = cargarCategorias().map((c) => c.nombre);

  const categorias: string[] =
    categoriasAdmin.length > 0 ? categoriasAdmin : categoriasDeProductos;

  const productosFiltrados = categoriaSeleccionada
    ? productos.filter((p) => p.categoria === categoriaSeleccionada)
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
      <section
        id="productos"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          justifyContent: "center",
        }}
      >
        {productosFiltrados.length > 0 ? (
          productosFiltrados.map((p: Producto) => (
            <ProductoCard
              key={p.id}
              producto={p}
              onAgregar={agregarProducto}
            />
          ))
        ) : (
          <p>No hay productos disponibles en esta categoría.</p>
        )}
      </section>
    </main>
  );
}
