const API = "http://localhost:8080/api/v1";

export type LoginResponse = { token: string };

export async function login(correo: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // tu backend espera username/password
    body: JSON.stringify({ username: correo, password }),
  });

  if (!res.ok) {
    throw new Error("Credenciales inválidas");
  }

  return res.json();
}

export async function registerCliente(data: {
  run: string;
  nombre: string;
  correo: string;
  password: string;
}) {
  const res = await fetch(`${API}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("No se pudo registrar (¿correo repetido?)");
  }

  return res.json();
}
