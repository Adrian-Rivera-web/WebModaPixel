import { useEffect, useState } from "react";
import { productos as productosBase } from "../../data/productos";
import type { Producto } from "../../data/productos";

export default function AdminProductos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [mensaje, setMensaje] = useState("");
  const [imagenPreview, setImagenPreview] = useState<string | null>(null);
  const [imagenBase64, setImagenBase64] = useState<string>("");
  const [mostrarCriticos, setMostrarCriticos] = useState(false); // 👈 NUEVO estado

  // 🔹 Cargar productos desde localStorage o base inicial
  useEffect(() => {
    const guardados = JSON.parse(localStorage.getItem("productosCliente") || "null");
    if (guardados && guardados.length > 0) {
      setProductos(guardados);
    } else {
      setProductos(productosBase);
      localStorage.setItem("productosCliente", JSON.stringify(productosBase));
    }
  }, []);

  // 🔁 Sincronizar productos automáticamente si cambian (por compra o edición)
  useEffect(() => {
    const syncProductos = () => {
      const actualizados = JSON.parse(localStorage.getItem("productosCliente") || "[]");
      setProductos(actualizados);
    };
    window.addEventListener("storage", syncProductos);
    return () => window.removeEventListener("storage", syncProductos);
  }, []);

  const guardarCambios = (lista: Producto[]) => {
    setProductos(lista);
    localStorage.setItem("productosCliente", JSON.stringify(lista));
  };

  // ✏️ Editar producto
  const editarProducto = (id: number) => {
    const producto = productos.find((p) => p.id === id);
    if (!producto) return;

    const nuevoPrecio = parseFloat(
      prompt("💲 Nuevo precio:", producto.precio.toString()) || ""
    );
    const nuevoStock = parseInt(
      prompt("📦 Nuevo stock:", producto.stock?.toString() || "0") || ""
    );

    if (isNaN(nuevoPrecio) || isNaN(nuevoStock)) {
      alert("⚠️ Ingresa valores válidos");
      return;
    }

    const actualizados = productos.map((p) =>
      p.id === id ? { ...p, precio: nuevoPrecio, stock: nuevoStock } : p
    );
    guardarCambios(actualizados);
    setMensaje("✅ Producto actualizado correctamente");
  };

  // 🗑️ Eliminar producto
  const eliminarProducto = (id: number) => {
    if (!confirm("¿Seguro que deseas eliminar este producto?")) return;
    const actualizados = productos.filter((p) => p.id !== id);
    guardarCambios(actualizados);
    setMensaje("🗑️ Producto eliminado correctamente");
  };

  // 📸 Convertir imagen a base64
  const manejarImagen = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagenBase64(reader.result as string);
      setImagenPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // ➕ Agregar nuevo producto
  const agregarProducto = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const nombre = (form.elements.namedItem("nombre") as HTMLInputElement).value.trim();
    const precio = parseFloat((form.elements.namedItem("precio") as HTMLInputElement).value);
    const categoria = (form.elements.namedItem("categoria") as HTMLSelectElement).value;
    const stock = parseInt((form.elements.namedItem("stock") as HTMLInputElement).value);

    if (!nombre || isNaN(precio) || !categoria) {
      setMensaje("⚠️ Completa todos los campos correctamente");
      return;
    }

    const nuevo: Producto = {
      id: productos.length + 1,
      nombre,
      precio,
      categoria,
      descripcion: "Nuevo producto agregado por administrador",
      imagen: imagenBase64 || "/src/assets/img/default.jpg",
      stock,
    };

    const actualizados = [...productos, nuevo];
    guardarCambios(actualizados);
    form.reset();
    setImagenPreview(null);
    setImagenBase64("");
    setMensaje("✅ Producto agregado correctamente");
  };

  // 📉 Filtrar productos críticos
  const productosCriticos = productos.filter((p) => (p.stock ?? 0) < 5);

  // 🔄 Seleccionar qué lista mostrar
  const listaFinal = mostrarCriticos ? productosCriticos : productos;

  return (
    <main className="container mt-4">
      <h2 className="text-center mb-4 fw-bold text-primary">
        🛍️ Administración de Productos
      </h2>

      {mensaje && (
        <div
          className={`alert ${
            mensaje.includes("⚠️") ? "alert-warning" : "alert-success"
          } text-center`}
        >
          {mensaje}
        </div>
      )}

      {/* Formulario */}
      <section className="card shadow-lg p-4 mb-4 border-0">
        <h4 className="mb-3 text-secondary">➕ Agregar nuevo producto</h4>
        <form onSubmit={agregarProducto}>
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label fw-semibold">Nombre</label>
              <input
                name="nombre"
                placeholder="Ej: Zapatillas Urbanas"
                className="form-control"
              />
            </div>
            <div className="col-md-2">
              <label className="form-label fw-semibold">Precio</label>
              <input
                name="precio"
                type="number"
                placeholder="Ej: 35000"
                className="form-control"
              />
            </div>
            <div className="col-md-2">
              <label className="form-label fw-semibold">Stock</label>
              <input
                name="stock"
                type="number"
                placeholder="Ej: 10"
                className="form-control"
              />
            </div>
            <div className="col-md-3">
              <label className="form-label fw-semibold">Categoría</label>
              <select name="categoria" className="form-select">
                <option value="">Selecciona...</option>
                <option value="Ropa">Ropa</option>
                <option value="Calzado">Calzado</option>
                <option value="Accesorios">Accesorios</option>
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label fw-semibold">Imagen</label>
              <input
                type="file"
                accept="image/*"
                onChange={manejarImagen}
                className="form-control"
              />
            </div>
          </div>

          {imagenPreview && (
            <div className="text-center mt-3">
              <img
                src={imagenPreview}
                alt="Vista previa"
                style={{ width: "120px", borderRadius: "8px" }}
              />
            </div>
          )}

          <div className="text-end mt-3">
            <button type="submit" className="btn btn-primary fw-semibold">
              Agregar producto
            </button>
          </div>
        </form>
      </section>

      {/* Tabla de productos */}
      <section className="card shadow-sm p-3 border-0">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0 text-secondary">
            {mostrarCriticos ? "⚠️ Productos Críticos (stock < 5)" : "📦 Productos actuales"}
          </h5>

          <div className="d-flex align-items-center gap-3">
            {/* 🔘 Botón de cambio de vista */}
            <button
              className={`btn ${mostrarCriticos ? "btn-outline-secondary" : "btn-outline-danger"}`}
              onClick={() => setMostrarCriticos(!mostrarCriticos)}
            >
              {mostrarCriticos ? "👀 Mostrar todos" : "⚠️ Ver productos críticos"}
            </button>

            <span className="badge bg-info text-dark fs-6">
              Total: {listaFinal.length}
            </span>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className={mostrarCriticos ? "table-danger" : "table-primary"}>
              <tr>
                <th>ID</th>
                <th>Imagen</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {listaFinal.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center">
                    {mostrarCriticos
                      ? "✅ No hay productos críticos actualmente"
                      : "No hay productos registrados"}
                  </td>
                </tr>
              ) : (
                listaFinal.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>
                      <img
                        src={p.imagen}
                        alt={p.nombre}
                        style={{ width: "60px", borderRadius: "8px" }}
                      />
                    </td>
                    <td className="fw-semibold">{p.nombre}</td>
                    <td>{p.categoria}</td>
                    <td>${p.precio}</td>
                    <td className={p.stock! < 5 ? "text-danger fw-bold" : ""}>
                      {p.stock ?? 0}
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-warning me-2"
                        onClick={() => editarProducto(p.id)}
                      >
                        ✏️ Editar
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => eliminarProducto(p.id)}
                      >
                        🗑️ Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
