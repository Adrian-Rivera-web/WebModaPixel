import { useEffect, useState } from "react";
import { productos as productosBase } from "../data/productos";
import type { Producto } from "../data/productos";
import ProductoCard from "../components/ProductoCard";

interface ProductoConCantidad extends Producto {
  cantidad: number;
}

export default function Productos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [carrito, setCarrito] = useState<ProductoConCantidad[]>(
    JSON.parse(localStorage.getItem("carrito") || "[]")
  );
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("todos");

  // 🔹 Cargar productos desde localStorage o base por defecto
  useEffect(() => {
    const guardados = JSON.parse(localStorage.getItem("productosCliente") || "null");
    if (guardados && guardados.length > 0) {
      setProductos(guardados);
    } else {
      setProductos(productosBase);
    }
  }, []);

  // 🔁 Sincroniza productos si el admin los cambia
  useEffect(() => {
    const syncProductos = () => {
      const guardados = JSON.parse(localStorage.getItem("productosCliente") || "null");
      if (guardados && guardados.length > 0) setProductos(guardados);
    };
    window.addEventListener("storage", syncProductos);
    return () => window.removeEventListener("storage", syncProductos);
  }, []);

  // 🛒 Agregar producto al carrito con control de stock
  const agregarAlCarrito = (producto: Producto) => {
    const existente = carrito.find((p) => p.id === producto.id);

    if (existente) {
      // 🚫 Si ya alcanzó el stock máximo, no deja agregar más
      if (existente.cantidad >= (producto.stock ?? 0)) {
        alert(`⚠️ Solo puedes comprar hasta ${producto.stock} unidades de este producto.`);
        return;
      }

      const nuevoCarrito = carrito.map((p) =>
        p.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p
      );
      setCarrito(nuevoCarrito);
      localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
    } else {
      // Si el stock es 0, no permite agregar
      if ((producto.stock ?? 0) <= 0) {
        alert(`❌ No hay stock disponible para ${producto.nombre}.`);
        return;
      }

      const nuevoCarrito = [...carrito, { ...producto, cantidad: 1 }];
      setCarrito(nuevoCarrito);
      localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
    }

    alert(`${producto.nombre} se añadió al carrito 🛒`);
  };

  // 🔍 Filtrado por nombre y categoría
  const productosFiltrados = productos.filter((p) => {
    const coincideNombre = p.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria = categoria === "todos" || p.categoria === categoria;
    return coincideNombre && coincideCategoria;
  });

  return (
    <main>
      <h2>🛍️ Productos disponibles</h2>

      {/* Barra de búsqueda y filtro */}
      <div
        style={{
          margin: "20px 0",
          display: "flex",
          justifyContent: "center",
          gap: "15px",
        }}
      >
        <input
          type="text"
          placeholder="Buscar producto..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            width: "250px",
          }}
        />

        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        >
          <option value="todos">Todas las categorías</option>
          <option value="Ropa">Ropa</option>
          <option value="Calzado">Calzado</option>
          <option value="Accesorios">Accesorios</option>
        </select>
      </div>

      {/* Lista de productos */}
      <section
        id="productos"
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "20px",
        }}
      >
        {productosFiltrados.length > 0 ? (
          productosFiltrados.map((p) => (
            <ProductoCard key={p.id} producto={p} onAgregar={agregarAlCarrito} />
          ))
        ) : (
          <p>No se encontraron productos 😢</p>
        )}
      </section>
    </main>
  );
}
