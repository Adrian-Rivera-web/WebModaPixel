import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/styles.css";
import { useCarrito } from "../context/CarritoContext";

export default function Checkout() {
  const navigate = useNavigate();
  const { carrito, vaciarCarrito } = useCarrito();

  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    direccion: "",
    comuna: "",
    region: "",
    metodoPago: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (Object.values(formData).some((v) => v === "")) {
      setError("Todos los campos son obligatorios");
      return;
    }

    setError("");
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      const exito = Math.random() > 0.3; // 70% éxito

      if (exito) {
        // 1️⃣ Leer usuario actual
        const usuarioActual = JSON.parse(
          localStorage.getItem("usuarioActual") || "null"
        );

        // 2️⃣ Crear la compra con todos los datos necesarios
        const nuevaCompra = {
          id: Date.now(),
          comprador: usuarioActual ? usuarioActual.nombre : formData.nombre,
          correo: usuarioActual ? usuarioActual.correo : formData.correo,
          usuario: usuarioActual ? usuarioActual.nombre : "Invitado",
          fecha: new Date().toISOString(),
          total: carrito.reduce((sum, item) => {
            const tieneOferta = item.oferta && (item.descuento ?? 0) > 0;
            const precioFinal = tieneOferta
              ? Math.round(
                  item.precio * (1 - (item.descuento ?? 0) / 100)
                )
              : item.precio;
            return sum + precioFinal * item.cantidad;
          }, 0),
          productos: carrito.map((p) => ({
            id: p.id,
            nombre: p.nombre,
            categoria: p.categoria || "Sin categoría",
            precio: p.precio,
            descuento: p.descuento ?? 0,
            oferta: !!p.oferta,
            cantidad: p.cantidad,
          })),
        };

        // 3️⃣ Guardar la compra
        const compras = JSON.parse(
          localStorage.getItem("compras") || "[]"
        );
        compras.push(nuevaCompra);
        localStorage.setItem("compras", JSON.stringify(compras));

        // 4️⃣ Restar stock en productosCliente
        const productosCliente = JSON.parse(
          localStorage.getItem("productosCliente") || "[]"
        );
        const actualizados = productosCliente.map((prod: any) => {
          const enCarrito = carrito.find((c) => c.id === prod.id);
          if (!enCarrito) return prod;

          const nuevoStock = Math.max(
            (prod.stock ?? 0) - enCarrito.cantidad,
            0
          );

          if (nuevoStock === 0) {
            return {
              ...prod,
              stock: 0,
              oferta: false,
              descuento: 0,
            };
          }

          return {
            ...prod,
            stock: nuevoStock,
          };
        });

        localStorage.setItem(
          "productosCliente",
          JSON.stringify(actualizados)
        );

        // 5️⃣ Limpiar carrito y actualizar vistas
        vaciarCarrito(); // ✅ limpia contexto + localStorage
        try {
          window.dispatchEvent(new Event("productos-actualizados"));
        } catch {}

        navigate("/compra-exitosa");
      } else {
        navigate("/compra-fallida");
      }
    }, 2000);
  };

  return (
    <main className="checkout-container container mt-4">
      <h2 className="text-center mb-3">Confirmar Compra</h2>
      <form onSubmit={handleSubmit} className="shadow p-4 rounded bg-white">
        {error && <p className="text-danger">{error}</p>}

        <div className="mb-3">
          <label>Nombre completo</label>
          <input
            type="text"
            name="nombre"
            className="form-control"
            value={formData.nombre}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label>Correo electrónico</label>
          <input
            type="email"
            name="correo"
            className="form-control"
            value={formData.correo}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label>Dirección</label>
          <input
            type="text"
            name="direccion"
            className="form-control"
            value={formData.direccion}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label>Comuna</label>
          <input
            type="text"
            name="comuna"
            className="form-control"
            value={formData.comuna}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label>Región</label>
          <input
            type="text"
            name="region"
            className="form-control"
            value={formData.region}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label>Método de pago</label>
          <select
            name="metodoPago"
            className="form-select"
            value={formData.metodoPago}
            onChange={handleChange}
          >
            <option value="">Seleccione...</option>
            <option value="tarjeta">Tarjeta de crédito/débito</option>
            <option value="transferencia">Transferencia bancaria</option>
            <option value="efectivo">Pago en efectivo</option>
          </select>
        </div>

        <div className="text-center">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Procesando pago..." : "Finalizar Compra"}
          </button>
        </div>
      </form>
    </main>
  );
}
