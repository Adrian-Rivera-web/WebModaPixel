import { useState, useEffect } from "react";
import { productos as productosBase } from "../data/productos";
import type { Producto } from "../data/productos";

/**
 * Hook personalizado que gestiona los productos del sistema.
 * - Carga inicial desde localStorage ("productosCliente") o desde productosBase
 * - Escucha actualizaciones desde el panel admin (evento "productos-actualizados")
 * - Sincroniza cambios con localStorage automáticamente
 */
export function useProductos() {
  const [productos, setProductos] = useState<Producto[]>(productosBase);

  // 1️⃣ Cargar productos desde localStorage al iniciar
  useEffect(() => {
    const guardados = JSON.parse(
      localStorage.getItem("productosCliente") || "[]"
    );
    if (guardados.length > 0) {
      setProductos(guardados);
    }

    // Escucha global de actualizaciones (cuando admin modifica productos)
    const actualizar = () => {
      const nuevos = JSON.parse(
        localStorage.getItem("productosCliente") || "[]"
      );
      if (nuevos.length > 0) {
        setProductos(nuevos);
      }
    };

    window.addEventListener("productos-actualizados", actualizar);
    return () =>
      window.removeEventListener("productos-actualizados", actualizar);
  }, []);

  // 2️⃣ Guardar automáticamente los cambios en localStorage
  useEffect(() => {
    localStorage.setItem("productosCliente", JSON.stringify(productos));
  }, [productos]);

  // 3️⃣ Retornar productos y función actualizadora
  return { productos, setProductos };
}
