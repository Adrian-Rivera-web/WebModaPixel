import { authFetch } from "./http";

const API = "http://localhost:8080/api/v1";

export type UserType = "ADMIN" | "CLIENTE";

export type UserResponse = {
  id: number;
  run: string;
  nombre: string;
  correo: string;
  tipo: UserType;
};

export async function getMe(): Promise<UserResponse> {
  const res = await authFetch(`${API}/users/me`, { method: "GET" });
  if (!res.ok) throw new Error("No autorizado");
  return res.json();
}

export async function listarUsuarios(): Promise<UserResponse[]> {
  const res = await authFetch(`${API}/users`, { method: "GET" });
  if (!res.ok) throw new Error("No autorizado");
  return res.json();
}

export async function crearUsuario(data: {
  run: string;
  nombre: string;
  correo: string;
  password: string;
  tipo: UserType;
}): Promise<UserResponse> {
  const res = await authFetch(`${API}/users`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("No se pudo crear usuario");
  return res.json();
}
