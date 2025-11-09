import { createContext, useContext, type ReactNode } from "react";
import type { Producto } from "../data/productos";
import { useLocalStorage } from "../hooks/useLocalStorage"; // ✅ usamos el nuevo hook

interface ItemCarrito extends Producto {
  cantidad: number;
}

interface CarritoContextType {
  carrito: ItemCarrito[];
  agregarProducto: (producto: Producto) => void;
  eliminarProducto: (id: number) => void;
  vaciarCarrito: () => void;
  total: number;
}

const CarritoContext = createContext<CarritoContextType | undefined>(undefined);

export function CarritoProvider({ children }: { children: ReactNode }) {
  // ✅ reemplazamos useState + useEffect por useLocalStorage
  const [carrito, setCarrito] = useLocalStorage<ItemCarrito[]>("carrito", []);

  // 🛒 Agregar producto (si existe, suma cantidad)
  const agregarProducto = (producto: Producto) => {
    setCarrito((prev) => {
      const existe = prev.find((p) => p.id === producto.id);
      if (existe) {
        return prev.map((p) =>
          p.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p
        );
      } else {
        return [...prev, { ...producto, cantidad: 1 }];
      }
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

  // 💰 Calcular total del carrito
  const total = carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);

  return (
    <CarritoContext.Provider
      value={{ carrito, agregarProducto, eliminarProducto, vaciarCarrito, total }}
    >
      {children}
    </CarritoContext.Provider>
  );
}

// 🔁 Hook personalizado para usar el contexto en cualquier componente
export function useCarrito() {
  const context = useContext(CarritoContext);
  if (!context)
    throw new Error("useCarrito debe usarse dentro de un CarritoProvider");
  return context;
}
