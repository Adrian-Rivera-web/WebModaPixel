import { useEffect, useState } from "react";
import type { Producto } from "../../data/productos";

// 👇 Bandera para usar backend o solo localStorage
const USE_API = String(import.meta.env.VITE_USE_API).toLowerCase() === "true";
// admin:admin123 en Base64
const ADMIN_AUTH_HEADER = "Basic YWRtaW46YWRtaW4xMjM=";

export default function ProductosNuevo() {
  const [mensaje, setMensaje] = useState("");
  const [imagenPreview, setImagenPreview] = useState<string | null>(null);
  const [imagenBase64, setImagenBase64] = useState<string>("");
  const [categorias, setCategorias] = useState<string[]>([]);

  // 🧩 Cargar categorías desde localStorage dinámicamente
  useEffect(() => {
    const guardadas = JSON.parse(localStorage.getItem("categorias") || "[]");
    setCategorias(guardadas.map((c: any) => c.nombre));
  }, []);

  // 🧩 Convierte la imagen a base64
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

  const agregarProducto = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const nombre = (form.elements.namedItem("nombre") as HTMLInputElement).value.trim();
    const precio = parseFloat(
      (form.elements.namedItem("precio") as HTMLInputElement).value
    );
    const stock = parseInt(
      (form.elements.namedItem("stock") as HTMLInputElement).value
    );
    const categoria = (form.elements.namedItem("categoria") as HTMLSelectElement)
      .value;

    if (!nombre || isNaN(precio) || isNaN(stock) || !categoria) {
      setMensaje("⚠️ Completa todos los campos correctamente");
      return;
    }

    // ✅ MODO BACKEND (Spring Boot + MySQL)
    if (USE_API) {
      try {
        const baseUrl =
          (import.meta.env.VITE_API_BASE_URL as string) || "http://localhost:8080";

        const resp = await fetch(`${baseUrl}/api/v1/products`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: ADMIN_AUTH_HEADER, // admin:admin123
          },
          body: JSON.stringify({
            name: nombre,
            description: "Nuevo producto agregado por administrador",
            price: precio,
            stock: stock,
            category: categoria, // 👈 AHORA también enviamos la categoría
          }),
        });

        if (!resp.ok) {
          throw new Error("Error al crear producto en el backend");
        }

        await resp.json();

        setMensaje("✅ Producto agregado correctamente en el backend");
        form.reset();
        setImagenPreview(null);
      } catch (err) {
        console.error(err);
        setMensaje("❌ No se pudo crear el producto en el backend");
      }
      return; // no seguimos al modo local
    }

    // ✅ MODO LOCAL (como lo tenías antes)
    const productosGuardados = JSON.parse(
      localStorage.getItem("productosCliente") || "[]"
    );

    const nuevo: Producto = {
      id: productosGuardados.length + 1,
      nombre,
      precio,
      categoria,
      descripcion: "Nuevo producto agregado por administrador",
      imagen: imagenBase64 || "/src/assets/img/default.jpg",
      stock,
      oferta: false,
      descuento: 0,
      fechaAgregado: new Date().toISOString(), // ✅ Fecha actual
    };

    localStorage.setItem(
      "productosCliente",
      JSON.stringify([...productosGuardados, nuevo])
    );
    form.reset();
    setImagenPreview(null);
    setMensaje("✅ Producto agregado correctamente (modo local)");
  };

  return (
    <section className="container-fluid">
      <h4 className="text-center text-secondary mb-4">Agregar nuevo producto</h4>

      {mensaje && (
        <div
          className={`alert ${
            mensaje.includes("⚠️") ? "alert-warning" : "alert-success"
          } text-center`}
        >
          {mensaje}
        </div>
      )}

      {/* 📦 Formulario con textos de ayuda */}
      <form
        onSubmit={agregarProducto}
        className="shadow-sm p-4 bg-light rounded mx-auto"
        style={{ maxWidth: "900px" }}
      >
        <div className="row g-4">
          <div className="col-md-6">
            <label className="form-label fw-semibold">Nombre del producto</label>
            <input
              name="nombre"
              placeholder="Ej: Zapatillas Urbanas"
              className="form-control"
            />
            <div className="form-text text-muted">
              Ingresa el nombre del producto
            </div>
          </div>

          <div className="col-md-3">
            <label className="form-label fw-semibold">Precio ($)</label>
            <input
              name="precio"
              type="number"
              placeholder="Ej: 35000"
              className="form-control"
            />
            <div className="form-text text-muted">
              Precio de venta del producto
            </div>
          </div>

          <div className="col-md-3">
            <label className="form-label fw-semibold">Stock disponible</label>
            <input
              name="stock"
              type="number"
              placeholder="Ej: 10"
              className="form-control"
            />
            <div className="form-text text-muted">
              Define el stock del producto
            </div>
          </div>

          <div className="col-md-6">
            <label className="form-label fw-semibold">Categoría</label>
            <select name="categoria" className="form-select">
              <option value="">Selecciona...</option>
              {categorias.length > 0 ? (
                categorias.map((cat, i) => (
                  <option key={i} value={cat}>
                    {cat}
                  </option>
                ))
              ) : (
                <option disabled>No hay categorías disponibles</option>
              )}
            </select>
            <div className="form-text text-muted">
              Selecciona la categoría del producto
            </div>
          </div>

          <div className="col-md-6">
            <label className="form-label fw-semibold">Imagen del producto</label>
            <input
              type="file"
              accept="image/*"
              onChange={manejarImagen}
              className="form-control"
            />
            <div className="form-text text-muted">
              Sube una imagen del producto (formato JPG o PNG)
            </div>
          </div>
        </div>

        {/* Vista previa */}
        {imagenPreview && (
          <div className="text-center mt-3">
            <img
              src={imagenPreview}
              alt="Vista previa"
              style={{ width: "180px", borderRadius: "10px" }}
            />
          </div>
        )}

        <div className="text-center mt-4">
          <button type="submit" className="btn btn-primary px-4 fw-semibold">
            Agregar producto
          </button>
        </div>
      </form>
    </section>
  );
}
