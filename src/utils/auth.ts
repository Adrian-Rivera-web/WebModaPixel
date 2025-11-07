export type Usuario = {
  run: string;
  nombre: string;
  correo: string;
  clave: string;
  tipo: "admin" | "cliente";
};

const LS_USUARIOS = "usuarios";
const LS_SESION = "usuarioActual";

export function getUsuarios(): Usuario[] {
  return JSON.parse(localStorage.getItem(LS_USUARIOS) || "[]");
}

export function saveUsuarios(lista: Usuario[]) {
  localStorage.setItem(LS_USUARIOS, JSON.stringify(lista));
}

export function getSesion(): Usuario | null {
  return JSON.parse(localStorage.getItem(LS_SESION) || "null");
}

export function setSesion(u: Usuario | null) {
  if (u) localStorage.setItem(LS_SESION, JSON.stringify(u));
  else localStorage.removeItem(LS_SESION);
}
