import { useEffect, useState } from "react";
import type { Producto } from "../../data/productos";

export default function ProductosReportes() {
  const [productos, setProductos] = useState<Producto[]>([]);

  useEffect(() => {
    const guardados = JSON.parse(localStorage.getItem("productosCliente") || "[]");
    setProductos(guardados);
  }, []);

  const totalProductos = productos.length;
  const totalStock = productos.reduce((sum, p) => sum + (p.stock ?? 0), 0);
  const valorTotal = productos.reduce((sum, p) => sum + p.precio * (p.stock ?? 0), 0);

  return (
    <section>
      <h4 className="text-secondary mb-3">📊 Reporte general de productos</h4>

      <ul>
        <li><strong>Total de productos:</strong> {totalProductos}</li>
        <li><strong>Stock total acumulado:</strong> {totalStock}</li>
        <li><strong>Valor total en inventario:</strong> ${valorTotal.toLocaleString()}</li>
      </ul>
    </section>
  );
}
