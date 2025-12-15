export function getToken() {
  return localStorage.getItem("token") || "";
}

export async function authFetch(input: RequestInfo, init: RequestInit = {}) {
  const token = getToken();

  const headers = new Headers(init.headers || {});
  headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(input, { ...init, headers });
  return res;
}
