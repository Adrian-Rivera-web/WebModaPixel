import { useEffect, useState } from "react";
import "../assets/css/styles.css";
import type { Producto } from "../data/productos";
import { productos as productosBase } from "../data/productos";
import ProductoCard from "../components/ProductoCard";
import { useCarrito } from "../context/CarritoContext";
import { cargarCategorias } from "../data/categorias";

type ApiProduct = {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  category?: string; // 👈 NUEVO
};

const USE_API = String(import.meta.env.VITE_USE_API).toLowerCase() === "true";

export default function Productos() {
  const { agregarProducto } = useCarrito();

  // Productos base + los que haya en productosCliente (modo local)
  const productosCliente = JSON.parse(
    localStorage.getItem("productosCliente") || "[]"
  );

  const productosIniciales: Producto[] =
    Array.isArray(productosCliente) && productosCliente.length > 0
      ? productosCliente
      : productosBase;

  const [productos, setProductos] = useState<Producto[]>(productosIniciales);
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("todos");

  // Si USE_API=true → cargamos desde Spring Boot
  useEffect(() => {
    if (!USE_API) return;

    fetch("/api/v1/products") // usa proxy de Vite
      .then((r) => {
        if (!r.ok) {
          throw new Error("Error al cargar productos desde API");
        }
        return r.json();
      })
      .then((data: ApiProduct[]) => {
        const mapeados: Producto[] = data.map((p) => ({
          id: p.id,
          codigo: String(p.id),
          nombre: p.name,
          precio: p.price,
          descripcion: p.description ?? "",
          stock: p.stock,
          imagen: "/src/assets/img/zapatillas.jpg",
          // 👇 USAMOS category de la BD, si no viene ponemos General
          categoria: p.category ?? "General",
          oferta: false,
          descuento: 0,
          fechaAgregado: new Date().toISOString().slice(0, 10),
        }));
        setProductos(mapeados);
      })
      .catch((err) => console.error("Error cargando productos API:", err));
  }, []);

  // Categorías derivadas de los productos
  const categoriasDeProductos = Array.from(
    new Set(productos.map((p) => p.categoria).filter(Boolean))
  ) as string[];

  // Categorías creadas en el panel admin
  const categoriasAdmin = cargarCategorias().map((c) => c.nombre);

  const categorias: string[] =
    categoriasAdmin.length > 0 ? categoriasAdmin : categoriasDeProductos;

  // Filtro por nombre + categoría
  const filtrados = productos.filter((p) => {
    const coincideNombre = p.nombre
      .toLowerCase()
      .includes(busqueda.toLowerCase());
    const coincideCategoria =
      categoria === "todos" || p.categoria === categoria;
    return coincideNombre && coincideCategoria;
  });

  return (
    <main className="productos-page">
      <h2 className="text-center my-3">Nuestros Productos</h2>

      {/* Filtros */}
      <section className="filtros-productos">
        <input
          type="text"
          placeholder="Buscar producto..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
        >
          <option value="todos">Todas las categorías</option>
          {categorias.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </section>

      {/* Grid de productos */}
      <section
        id="productos"
        className="productos-grid"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          justifyContent: "center",
        }}
      >
        {filtrados.length > 0 ? (
          filtrados.map((p: Producto) => (
            <ProductoCard
              key={p.id}
              producto={p}
              onAgregar={agregarProducto}
            />
          ))
        ) : (
          <p>No se encontraron productos.</p>
        )}
      </section>
    </main>
  );
}
