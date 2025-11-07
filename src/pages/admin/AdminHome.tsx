import { Link } from "react-router-dom";
import "../../assets/css/styles.css";

export default function AdminHome() {
  return (
    <div className="admin-home">
      <h2 className="text-center mb-4">Bienvenido al Panel de Administración</h2>
      <p className="text-center mb-4">
        Selecciona una opción para gestionar tu tienda.
      </p>

      <div className="admin-cards-container">
        {/* 🟦 Productos */}
        <div className="admin-card productos">
          <img
            src="/src/assets/img/productos.jpg"
            alt="Productos"
            className="admin-card-img"
          />
          <h3>📦 Productos</h3>
          <p>Gestiona los productos disponibles en tu tienda.</p>
          <Link to="/admin/productos" className="btn-admin">
            Ir a Productos
          </Link>
        </div>

        {/* 🟩 Usuarios */}
        <div className="admin-card usuarios">
          <img
            src="/src/assets/img/usuarios.jpg"
            alt="Usuarios"
            className="admin-card-img"
          />
          <h3>👤 Usuarios</h3>
          <p>Administra los usuarios registrados y sus roles.</p>
          <Link to="/admin/usuarios" className="btn-admin">
            Ir a Usuarios
          </Link>
        </div>

        {/* 🟨 Ofertas */}
        <div className="admin-card ofertas">
          <img
            src="/src/assets/img/ofertas.jpg"
            alt="Ofertas"
            className="admin-card-img"
          />
          <h3>💸 Ofertas</h3>
          <p>Configura descuentos y promociones especiales.</p>
          <Link to="/admin/ofertas" className="btn-admin">
            Ir a Ofertas
          </Link>
        </div>

        {/* 🟧 Configuración */}
        <div className="admin-card configuracion">
          <img
            src="/src/assets/img/config.jpg"
            alt="Configuración"
            className="admin-card-img"
          />
          <h3>⚙️ Configuración</h3>
          <p>Personaliza opciones del sistema y del panel.</p>
          <Link to="/admin/configuracion" className="btn-admin">
            Ir a Configuración
          </Link>
        </div>
      </div>
    </div>
  );
}
