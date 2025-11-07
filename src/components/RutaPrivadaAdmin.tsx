import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

export default function RutaPrivadaAdmin({ children }: { children: ReactNode }) {
  const sesion = JSON.parse(localStorage.getItem("sesionActiva") || "null");

  if (!sesion) {
    alert("Debes iniciar sesión para acceder.");
    return <Navigate to="/login" />;
  }

  if (sesion.tipo !== "admin") {
    alert("Acceso denegado ❌. Solo administradores.");
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}
