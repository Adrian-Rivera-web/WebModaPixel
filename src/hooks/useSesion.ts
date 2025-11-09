import { useState, useEffect } from "react";
import { getSesion, setSesion } from "../utils/auth";

export function useSesion() {
  const [usuario, setUsuario] = useState(getSesion());

  useEffect(() => {
    const actualizarSesion = () => setUsuario(getSesion());
    window.addEventListener("storage", actualizarSesion);
    return () => window.removeEventListener("storage", actualizarSesion);
  }, []);

  const cerrarSesion = () => {
    setSesion(null);
    setUsuario(null);
  };

  return { usuario, cerrarSesion };
}
