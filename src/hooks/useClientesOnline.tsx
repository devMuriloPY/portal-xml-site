import { useEffect, useState, useCallback, useRef } from "react";
import { api } from "../services/api";

export const useClientesOnline = (clients: any[]) => {
  const [clientesOnline, setClientesOnline] = useState<Set<number>>(new Set());
  const pollingRef = useRef<number | null>(null);
  const isPageVisibleRef = useRef(true);

  const verificarClientesOnline = useCallback(async () => {
    if (!clients.length || !isPageVisibleRef.current) return;

    try {
      const res = await api.get("/ws/clientes-conectados");
      const idsConectados = res.data.clientes_conectados || [];
      setClientesOnline(new Set(idsConectados));
    } catch (error) {
      console.error("Erro ao verificar clientes online:", error);
    }
  }, [clients.length]);

  // Função para iniciar polling
  const iniciarPolling = useCallback(() => {
    if (pollingRef.current) return;
    
    // Primeira verificação imediata
    verificarClientesOnline();
    
    // Polling a cada 5 segundos para dashboard (menos frequente)
    pollingRef.current = setInterval(verificarClientesOnline, 5000);
  }, [verificarClientesOnline]);

  // Função para parar polling
  const pararPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  }, []);

  // Detecta mudanças de visibilidade da página
  useEffect(() => {
    const handleVisibilityChange = () => {
      isPageVisibleRef.current = !document.hidden;
      
      if (isPageVisibleRef.current) {
        // Página ficou visível, verifica imediatamente
        if (clients.length) {
          verificarClientesOnline();
          iniciarPolling();
        }
      } else {
        // Página ficou oculta, para o polling
        pararPolling();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      pararPolling();
    };
  }, [clients.length, verificarClientesOnline, iniciarPolling, pararPolling]);

  // Inicia polling quando clientes estiverem carregados
  useEffect(() => {
    if (clients.length) {
      iniciarPolling();
    } else {
      pararPolling();
    }
    
    return () => pararPolling();
  }, [clients.length, iniciarPolling, pararPolling]);

  // Função para verificar se um cliente específico está online
  const isClienteOnline = useCallback((clientId: string) => {
    return clientesOnline.has(Number(clientId));
  }, [clientesOnline]);

  return { clientesOnline, isClienteOnline };
};
