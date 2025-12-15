import { useEffect, useState } from "react";
import { Link, Routes, Route } from "react-router-dom";
import type { Producto } from "../../data/productos";
import { productos as productosBase } from "../../data/productos";
import ProductosEditar from "./ProductosEditar";

type ApiProduct = {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  category?: string;
};

const USE_API = String(import.meta.env.VITE_USE_API).toLowerCase() === "true";
const ADMIN_AUTH_HEADER = "Basic YWRtaW46YWRtaW4xMjM=";

export default function ProductosMostrar() {
  const [productos, setProductos] = useState<Producto[]>([]);

  // 🔹 Cargar productos al inicio
  useEffect(() => {
    if (USE_API) {
      const baseUrl =
        (import.meta.env.VITE_API_BASE_URL as string) || "http://localhost:8080";

      fetch(`${baseUrl}/api/v1/products`)
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
            descripcion: p.description ?? "",
            precio: p.price,
            stock: p.stock,
            categoria: p.category ?? "General",
            imagen: "/src/assets/img/zapatillas.jpg",
            oferta: false,
            descuento: 0,
            fechaAgregado: new Date().toISOString().slice(0, 10),
          }));
          setProductos(mapeados);
        })
        .catch((err) => {
          console.error(err);
          // ⚠️ Si falla la API, volvemos al modo local para no dejar vacío
          const raw = localStorage.getItem("productosCliente");
          let guardados: Producto[] = [];

          if (raw) {
            try {
              const parsed = JSON.parse(raw);
              if (Array.isArray(parsed) && parsed.length > 0) {
                guardados = parsed;
              }
            } catch {
              // ignoramos error
            }
          }

          if (guardados.length === 0) {
            setProductos(productosBase);
            localStorage.setItem(
              "productosCliente",
              JSON.stringify(productosBase)
            );
          } else {
            setProductos(guardados);
          }
        });
    } else {
      // 🔹 Modo local (sin backend)
      const raw = localStorage.getItem("productosCliente");
      let guardados: Producto[] = [];

      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            guardados = parsed;
          }
        } catch {
          // ignoramos error
        }
      }

      if (guardados.length === 0) {
        setProductos(productosBase);
        localStorage.setItem(
          "productosCliente",
          JSON.stringify(productosBase)
        );
      } else {
        setProductos(guardados);
      }
    }
  }, []);

  // 🗑️ Eliminar producto
  const eliminarProducto = async (id: number, nombre: string) => {
    const confirmar = window.confirm(
      `¿Estás seguro de eliminar el producto "${nombre}"?`
    );
    if (!confirmar) return;

    if (USE_API) {
      try {
        const baseUrl =
          (import.meta.env.VITE_API_BASE_URL as string) || "http://localhost:8080";

        const resp = await fetch(`${baseUrl}/api/v1/products/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: ADMIN_AUTH_HEADER,
          },
        });

        if (!resp.ok && resp.status !== 204) {
          throw new Error("Error al eliminar producto en backend");
        }

        setProductos((prev) => prev.filter((p) => p.id !== id));
        alert(`El producto "${nombre}" fue eliminado en el backend.`);
      } catch (err) {
        console.error(err);
        alert("❌ No se pudo eliminar el producto en el backend.");
      }
    } else {
      const actualizados = productos.filter((p) => p.id !== id);
      localStorage.setItem("productosCliente", JSON.stringify(actualizados));
      setProductos(actualizados);
      alert(`El producto "${nombre}" fue eliminado correctamente.`);
    }
  };

  return (
    <section>
      <h4 className="text-secondary mb-3">Lista de productos</h4>

      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-primary text-center">
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Oferta</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center text-muted py-4">
                  No hay productos registrados.
                </td>
              </tr>
            ) : (
              productos.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.nombre}</td>
                  <td>{p.categoria}</td>
                  <td>${p.precio.toLocaleString()}</td>
                  <td
                    className={
                      (p.stock ?? 0) <= 5
                        ? "fw-bold text-danger"
                        : "fw-semibold text-success"
                    }
                  >
                    {p.stock ?? 0}
                  </td>
                  <td className="text-center">
                    {p.oferta ? (
                      <span className="badge bg-success">Sí</span>
                    ) : (
                      <span className="badge bg-secondary">No</span>
                    )}
                  </td>
                  <td className="text-center">
                    {/* 👇 AHORA EL LINK ES ABSOLUTO, NO RELATIVO */}
                    <Link
                      to={`/admin/productos/mostrar/editar/${p.id}`}
                      className="btn btn-sm btn-outline-warning me-2"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => eliminarProducto(p.id, p.nombre)}
                      className="btn btn-sm btn-outline-danger"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Subruta para edición */}
      <Routes>
        <Route path="editar/:id" element={<ProductosEditar />} />
      </Routes>
    </section>
  );
}
