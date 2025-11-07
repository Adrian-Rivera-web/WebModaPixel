export default function AdminReportes() {
  return (
    <div className="admin-compras">
      <h2>Gestión de Compras</h2>
      <p>Desde aquí el administrador puede ver, registrar y actualizar las compras realizadas.</p>

      {/* Ejemplo: podrías agregar una tabla más adelante */}
      <table>
        <thead>
          <tr>
            <th>ID Compra</th>
            <th>Cliente</th>
            <th>Producto</th>
            <th>Monto</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>001</td>
            <td>Juan Pérez</td>
            <td>Notebook Asus</td>
            <td>$850.000</td>
            <td>03/11/2025</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
