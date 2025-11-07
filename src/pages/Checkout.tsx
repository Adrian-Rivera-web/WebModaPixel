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

  // 🔹 Maneja los cambios en los campos del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔹 Envío del formulario (simulación de pago)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 🧩 Validaciones de campos vacíos
    if (Object.values(formData).some((v) => v === "")) {
      setError("⚠️ Todos los campos son obligatorios");
      return;
    }

    setError("");
    setLoading(true);

    // Simulación del proceso de pago (2 segundos)
    setTimeout(() => {
      setLoading(false);
      const exito = Math.random() > 0.3; // 70% de probabilidad de éxito

      if (exito) {
        // ✅ GUARDAR LA COMPRA EN LOCALSTORAGE

        // 1️⃣ Leer carrito y usuario actual
        const carrito = JSON.parse(localStorage.getItem("carrito") || "[]");
        const usuarioActual = JSON.parse(localStorage.getItem("usuarioActual") || "null");

        // 2️⃣ Armar objeto de compra
        const nuevaCompra = {
          id: Date.now(), // ID único basado en timestamp
          comprador: usuarioActual ? usuarioActual.nombre : formData.nombre,
          correo: usuarioActual ? usuarioActual.correo : formData.correo,
          fecha: new Date().toLocaleString(), // Fecha y hora legible
          total: carrito.reduce(
            (sum: number, item: any) => sum + item.precio * item.cantidad,
            0
          ),
          productos: carrito.map((p: any) => ({
            id: p.id,
            nombre: p.nombre,
            precio: p.precio,
            cantidad: p.cantidad,
          })),
        };

        // 3️⃣ Guardar la compra en el historial
        const compras = JSON.parse(localStorage.getItem("compras") || "[]");
        compras.push(nuevaCompra);
        localStorage.setItem("compras", JSON.stringify(compras));

        // 4️⃣ 🔹 Actualizar el stock de productos luego de la compra
        const productosGuardados = JSON.parse(
          localStorage.getItem("productosCliente") || "[]"
        );

        const productosActualizados = productosGuardados.map((p: any) => {
          const comprado = carrito.find((c: any) => c.id === p.id);
          if (comprado) {
            // Resta del stock la cantidad comprada, sin bajar de 0
            const nuevoStock = Math.max((p.stock ?? 0) - comprado.cantidad, 0);
            return { ...p, stock: nuevoStock };
          }
          return p;
        });

        localStorage.setItem(
          "productosCliente",
          JSON.stringify(productosActualizados)
        );

        // 5️⃣ Limpiar carrito y redirigir a página de éxito
        localStorage.removeItem("carrito");
        navigate("/compra-exitosa");
      } else {
        navigate("/compra-fallida");
      }
    }, 2000);
  };

  // 🧾 Render del formulario
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
