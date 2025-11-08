export interface Producto {
  id: number;
  codigo?: string;
  nombre: string;
  precio: number;
  imagen: string;
  descripcion: string;
  stock?: number;
  categoria?: string;
  oferta?: boolean;     // 👈 nuevo
  descuento?: number; // 👈 Importante para el filtrado
}

export const productos: Producto[] = [
  {
    id: 1,
    nombre: "Polera Roja",
    precio: 12000,
    imagen: "/src/assets/img/polera-roja.jpg",
    descripcion: "Polera roja clásica de algodón, cómoda y versátil para uso diario.",
    categoria: "Ropa",
    stock: 15,
  },
  {
    id: 2,
    nombre: "Pantalón Negro",
    precio: 18000,
    imagen: "/src/assets/img/pantalones.jpg",
    descripcion: "Pantalón negro elegante y resistente, ideal para ocasiones casuales o formales.",
    categoria: "Ropa",
    stock: 10,
  },
  {
    id: 3,
    nombre: "Zapatillas Urbanas",
    precio: 35000,
    imagen: "/src/assets/img/zapatillas.jpg",
    descripcion: "Zapatillas urbanas de diseño moderno, perfectas para el día a día.",
    categoria: "Calzado",
    stock: 20,
  },
  {
    id: 4,
    nombre: "Bolso de Cuero",
    precio: 10000,
    imagen: "/src/assets/img/bolso.jpg",
    descripcion: "El mejor bolso que existe en el mundo, disponible solo en ModaPixel.",
    categoria: "Accesorios",
    stock: 8,
  },
  {
    id: 5,
    nombre: "Zapatillas Deportivas",
    precio: 42000,
    imagen: "/src/assets/img/zapatillas.jpg",
    descripcion: "Zapatillas deportivas ligeras y cómodas, ideales para entrenamiento.",
    categoria: "Calzado",
    stock: 25,
  },
  {
    id: 6,
    nombre: "Chaqueta Jeans",
    precio: 32000,
    imagen: "/src/assets/img/chaqueta.jpg",
    descripcion: "Chaqueta de mezclilla moderna, ideal para un look casual.",
    categoria: "Ropa",
    stock: 12,
  },
  {
    id: 7,
    nombre: "Gorro Invierno",
    precio: 8000,
    imagen: "/src/assets/img/gorro.jpg",
    descripcion: "Gorro de lana suave y abrigado, disponible en varios colores.",
    categoria: "Accesorios",
    stock: 30,
  },
  {
    id: 8,
    nombre: "Cinturón Cuero",
    precio: 9500,
    imagen: "/src/assets/img/cinturon.jpg",
    descripcion: "Cinturón de cuero genuino con hebilla metálica resistente.",
    categoria: "Accesorios",
    stock: 18,
  },
];
