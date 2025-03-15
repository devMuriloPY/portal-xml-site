import { useEffect, useState } from "react";
import { api } from "../services/api";

export const useClienteInfo = (id: string | undefined, stateClient: any) => {
  const [clienteInfo, setClienteInfo] = useState(stateClient || null);
  const [isOnline, setIsOnline] = useState<boolean | null>(null);

  useEffect(() => {
    if (!stateClient && id) {
      api.get(`/auth/clientes/${id}`)
        .then(res => setClienteInfo(res.data))
        .catch(() => setClienteInfo(null));
    }
  }, [id, stateClient]);

  useEffect(() => {
    if (!id) return;
    api.get("/ws/clientes-conectados")
      .then(res => {
        const onlineIds = res.data.clientes_conectados || [];
        setIsOnline(onlineIds.includes(Number(id)));
      })
      .catch(() => setIsOnline(null));
  }, [id]);

  return { clienteInfo, isOnline };
};
