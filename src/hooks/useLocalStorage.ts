import { useState, useEffect } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [valor, setValor] = useState<T>(() => {
    const guardado = localStorage.getItem(key);
    return guardado ? JSON.parse(guardado) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(valor));
  }, [key, valor]);

  return [valor, setValor] as const;
}
