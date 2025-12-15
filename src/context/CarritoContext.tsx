import { createContext, useContext, type ReactNode } from "react";
import type { Producto } from "../data/productos";
import { useLocalStorage } from "../hooks/useLocalStorage";

interface ItemCarrito extends Producto {
  cantidad: number;
}

interface CarritoContextType {
  carrito: ItemCarrito[];
  agregarProducto: (producto: Producto) => void;
  eliminarProducto: (id: number) => void;
  vaciarCarrito: () => void;
  actualizarCantidad: (id: number, cantidad: number) => void;
  total: number;
}

const CarritoContext = createContext<CarritoContextType | undefined>(undefined);

export function CarritoProvider({ children }: { children: ReactNode }) {
  const [carrito, setCarrito] = useLocalStorage<ItemCarrito[]>("carrito", []);

  // 🛒 Agregar producto con control de stock
  const agregarProducto = (producto: Producto) => {
    setCarrito((prev) => {
      const existe = prev.find((p) => p.id === producto.id);
      const stockDisponible = producto.stock ?? 0;

      // Si ya existe en el carrito
      if (existe) {
        if (existe.cantidad >= stockDisponible) {
          alert(
            `⚠️ Solo hay ${stockDisponible} unidades disponibles de "${producto.nombre}".`
          );
          return prev; // no cambiamos el carrito
        }
        return prev.map((p) =>
          p.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p
        );
      }

      // Si no existe aún en el carrito
      if (stockDisponible <= 0) {
        alert(`⚠️ "${producto.nombre}" no tiene stock disponible.`);
        return prev;
      }

      return [...prev, { ...producto, cantidad: 1 }];
    });
  };

  // 🗑️ Eliminar producto por id
  const eliminarProducto = (id: number) => {
    setCarrito((prev) => prev.filter((p) => p.id !== id));
  };

  // 💥 Vaciar todo el carrito
  const vaciarCarrito = () => {
    setCarrito([]);
  };

  // ➕➖ Cambiar cantidad (el control de stock extra ya lo haces en la página Carrito)
  const actualizarCantidad = (id: number, cantidad: number) => {
    if (cantidad <= 0) {
      return setCarrito((prev) => prev.filter((p) => p.id !== id));
    }
    setCarrito((prev) =>
      prev.map((p) => (p.id === id ? { ...p, cantidad } : p))
    );
  };

  // 💰 Total del carrito (considerando ofertas)
  const total = carrito.reduce((acc, p) => {
    const tieneOferta = p.oferta && (p.descuento ?? 0) > 0;
    const precioFinal = tieneOferta
      ? Math.round(p.precio * (1 - (p.descuento ?? 0) / 100))
      : p.precio;
    return acc + precioFinal * p.cantidad;
  }, 0);

  return (
    <CarritoContext.Provider
      value={{
        carrito,
        agregarProducto,
        eliminarProducto,
        vaciarCarrito,
        actualizarCantidad,
        total,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
}

export function useCarrito() {
  const context = useContext(CarritoContext);
  if (!context)
    throw new Error("useCarrito debe usarse dentro de un CarritoProvider");
  return context;
}
