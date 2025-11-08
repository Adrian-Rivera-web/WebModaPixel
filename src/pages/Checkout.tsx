import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/styles.css";

export default function Checkout() {
  const navigate = useNavigate();

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (Object.values(formData).some((v) => v === "")) {
      setError("⚠️ Todos los campos son obligatorios");
      return;
    }

    setError("");
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      const exito = Math.random() > 0.3; // 70% éxito

      if (exito) {
        // 1) Leer carrito y usuario actual
        const carrito = JSON.parse(localStorage.getItem("carrito") || "[]");
        const usuarioActual = JSON.parse(localStorage.getItem("usuarioActual") || "null");

        // 2) Guardar la compra (histórico)
        const nuevaCompra = {
          id: Date.now(),
          comprador: usuarioActual ? usuarioActual.nombre : formData.nombre,
          correo: usuarioActual ? usuarioActual.correo : formData.correo,
          fecha: new Date().toLocaleString(),
          total: carrito.reduce((sum: number, item: any) => {
            const tieneOferta = item.oferta && (item.descuento ?? 0) > 0;
            const precioFinal = tieneOferta
              ? Math.round(item.precio * (1 - (item.descuento ?? 0) / 100))
              : item.precio;
            return sum + precioFinal * item.cantidad;
          }, 0),
          productos: carrito.map((p: any) => ({
            id: p.id,
            nombre: p.nombre,
            precio: p.precio,
            descuento: p.descuento ?? 0,
            oferta: !!p.oferta,
            cantidad: p.cantidad,
          })),
        };

        const compras = JSON.parse(localStorage.getItem("compras") || "[]");
        compras.push(nuevaCompra);
        localStorage.setItem("compras", JSON.stringify(compras));

        // 3) RESTAR STOCK a productosCliente
        const productosCliente = JSON.parse(localStorage.getItem("productosCliente") || "[]");
        const actualizados = productosCliente.map((prod: any) => {
          const enCarrito = carrito.find((c: any) => c.id === prod.id);
          if (!enCarrito) return prod;

          const nuevoStock = Math.max((prod.stock ?? 0) - enCarrito.cantidad, 0);
          const sinStock = nuevoStock <= 0;

          return {
            ...prod,
            stock: nuevoStock,
            // si quedó sin stock, quita oferta
            oferta: sinStock ? false : prod.oferta,
            descuento: sinStock ? 0 : (prod.descuento ?? 0),
          };
        });

        localStorage.setItem("productosCliente", JSON.stringify(actualizados));

        // 4) Limpiar carrito
        localStorage.removeItem("carrito");

        // 5) Notificar a otras vistas (admin) que hubo actualización de productos
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
      <h2 className="text-center mb-3">💳 Confirmar Compra</h2>
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
