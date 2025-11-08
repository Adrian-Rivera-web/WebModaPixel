import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../assets/css/styles.css";

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
}
interface Usuario {
  run: string;
  nombre: string;
  correo: string;
  tipo: string;
}
interface Compra {
  id: number;
  total: number;
}

export default function AdminHome() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [compras, setCompras] = useState<Compra[]>([]);

  useEffect(() => {
    const prod = JSON.parse(localStorage.getItem("productosCliente") || "[]");
    const user = JSON.parse(localStorage.getItem("usuarios") || "[]");
    const buy = JSON.parse(localStorage.getItem("compras") || "[]");

    setProductos(prod);
    setUsuarios(user);
    setCompras(buy);
  }, []);

  const totalProductos = productos.length;
  const totalUsuarios = usuarios.length;
  const totalCompras = compras.length;

  return (
    <main className="container-fluid mt-4">
      {/* 🔹 Tarjetas superiores (sin textos extra) */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card shadow-sm border-0 bg-primary text-white p-4 text-center h-100">
            <i className="bi bi-cart-check display-5 mb-2"></i>
            <h5>Compras</h5>
            <h2>{totalCompras}</h2>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0 bg-success text-white p-4 text-center h-100">
            <i className="bi bi-box-seam display-5 mb-2"></i>
            <h5>Productos</h5>
            <h2>{totalProductos}</h2>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0 bg-warning text-dark p-4 text-center h-100">
            <i className="bi bi-people-fill display-5 mb-2"></i>
            <h5>Usuarios</h5>
            <h2>{totalUsuarios}</h2>
          </div>
        </div>
      </div>

      {/* 🔹 Tarjetas inferiores con accesos rápidos clickeables */}
      <div className="row g-3">
        {[
          { icon: "bi-tag", title: "Ofertas", desc: "Gestión de promociones y descuentos activos.", link: "/admin/ofertas" },
          { icon: "bi-bag-check", title: "Órdenes", desc: "Gestión de todas las órdenes de compra realizadas.", link: "/admin/ordenes" },
          { icon: "bi-box", title: "Productos", desc: "Administrar inventario y detalles de productos.", link: "/admin/productos" },
          { icon: "bi-tags", title: "Categorías", desc: "Organizar productos en categorías para su navegación.", link: "/admin/categorias" },
          { icon: "bi-people", title: "Usuarios", desc: "Gestión de cuentas de usuario y roles del sistema.", link: "/admin/usuarios" },
          { icon: "bi-bar-chart", title: "Reportes", desc: "Informes detallados de las operaciones del sistema.", link: "/admin/reportes" },
          { icon: "bi-person-gear", title: "Perfil", desc: "Información personal y configuración de cuenta.", link: "/admin/perfil" },
          { icon: "bi-shop", title: "Tienda", desc: "Visualiza la tienda y los reportes de los usuarios.", link: "/" },
        ].map((item, i) => (
          <div className="col-md-3" key={i}>
            <Link to={item.link} className="text-decoration-none text-dark">
              <div className="card border-0 shadow-sm text-center p-3 h-100 card-hover">
                <i className={`bi ${item.icon} display-5 text-primary mb-3`}></i>
                <h5 className="fw-bold">{item.title}</h5>
                <p className="text-muted small">{item.desc}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}
