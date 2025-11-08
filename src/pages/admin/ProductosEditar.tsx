import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Producto } from "../../data/productos";

export default function ProductosEditar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState<Producto | null>(null);

  useEffect(() => {
    const guardados = JSON.parse(localStorage.getItem("productosCliente") || "[]");
    const encontrado = guardados.find((p: Producto) => p.id === Number(id));
    setProducto(encontrado || null);
  }, [id]);

  const guardarCambios = () => {
    if (!producto) return;
    const guardados = JSON.parse(localStorage.getItem("productosCliente") || "[]");
    const actualizados = guardados.map((p: Producto) =>
      p.id === producto.id ? producto : p
    );
    localStorage.setItem("productosCliente", JSON.stringify(actualizados));
    alert("✅ Producto actualizado correctamente");
    navigate("/admin/productos/mostrar");
  };

  if (!producto) return <p>❌ Producto no encontrado</p>;

  return (
    <section className="mt-4">
      <h4 className="text-secondary mb-3">✏️ Editar producto #{producto.id}</h4>
      <div className="card p-4 shadow-sm">
        <label className="form-label">Nombre:</label>
        <input
          type="text"
          className="form-control mb-2"
          value={producto.nombre}
          onChange={(e) => setProducto({ ...producto, nombre: e.target.value })}
        />

        <label className="form-label">Precio:</label>
        <input
          type="number"
          className="form-control mb-2"
          value={producto.precio}
          onChange={(e) => setProducto({ ...producto, precio: Number(e.target.value) })}
        />

        <label className="form-label">Stock:</label>
        <input
          type="number"
          className="form-control mb-3"
          value={producto.stock ?? 0}
          onChange={(e) => setProducto({ ...producto, stock: Number(e.target.value) })}
        />

        <button onClick={guardarCambios} className="btn btn-primary">
          💾 Guardar cambios
        </button>
      </div>
    </section>
  );
}
