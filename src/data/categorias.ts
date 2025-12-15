// src/data/categorias.ts
export interface Categoria {
  id: number;
  nombre: string;
  descripcion: string;
}

const STORAGE_KEY = "categorias";

// 🌱 Categorías base (se usan solo la primera vez)
export const categoriasBase: Categoria[] = [
  {
    id: 1,
    nombre: "Ropa",
    descripcion: "Prendas de vestir para todas las temporadas.",
  },
  {
    id: 2,
    nombre: "Calzado",
    descripcion: "Zapatillas, zapatos y más.",
  },
  {
    id: 3,
    nombre: "Accesorios",
    descripcion: "Gorros, cinturones, bolsos y otros complementos.",
  },
];

// 🔹 Cargar categorías (primero localStorage, si no hay, usar base)
export function cargarCategorias(): Categoria[] {
  if (typeof window === "undefined") return categoriasBase;

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    // Primera vez: inicializamos con las categorías base
    localStorage.setItem(STORAGE_KEY, JSON.stringify(categoriasBase));
    return categoriasBase;
  }

  try {
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) return categoriasBase;
    return data;
  } catch {
    return categoriasBase;
  }
}

// 🔹 Guardar categorías (y avisar al resto de la app)
export function guardarCategorias(lista: Categoria[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
  // Evento opcional por si quieres escuchar cambios
  try {
    window.dispatchEvent(new Event("categorias-actualizadas"));
  } catch {}
}
