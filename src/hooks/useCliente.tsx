import { useEffect, useState, useCallback, useRef } from "react";
import { api } from "../services/api";
import { Client } from "../types/index";

export const useCliente = (id: string | undefined, fallbackCliente?: Client | null) => {
  const [cliente, setCliente] = useState<Client | null>(fallbackCliente || null);
  const [isOnline, setIsOnline] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [erro, setErro] = useState<string | null>(null);
  
  // Refs para controlar o polling
  const pollingRef = useRef<number | null>(null);
  const lastStatusRef = useRef<boolean | null>(null);
  const isPageVisibleRef = useRef(true);

  const normalizarCliente = (data: any): Client => ({
    id: String(data.id_cliente),
    name: data.nome,
    cnpj: data.cnpj,
    email: data.email,
    phone: data.telefone,
  });

  const buscarCliente = useCallback(async () => {
    if (!id || isNaN(Number(id))) return;

    try {
      const res = await api.get(`/auth/clientes/${id}`);
      const data = res.data;
      setCliente(normalizarCliente(data));
      setErro(null);
    } catch (err) {
      console.error("Erro ao buscar cliente:", err);
      setCliente(null);
      setErro("Não foi possível carregar os dados do cliente.");
    }
  }, [id]);

  const verificarConexao = useCallback(async () => {
    if (!id || isNaN(Number(id))) return;

    try {
      const res = await api.get("/ws/clientes-conectados");
      const idsConectados = res.data.clientes_conectados || [];
      const novoStatus = idsConectados.includes(Number(id));
      
      // Só atualiza se o status mudou
      if (novoStatus !== lastStatusRef.current) {
        setIsOnline(novoStatus);
        lastStatusRef.current = novoStatus;
      }
    } catch (error) {
      console.error("Erro ao verificar status do cliente:", error);
      setIsOnline(null);
    }
  }, [id]);

  // Função para iniciar o polling
  const iniciarPolling = useCallback(() => {
    if (pollingRef.current) return; // Evita múltiplos intervalos
    
    const verificarStatus = async () => {
      if (isPageVisibleRef.current && cliente) {
        await verificarConexao();
      }
    };

    // Primeira verificação imediata
    verificarStatus();
    
    // Polling a cada 3 segundos (ajuste conforme necessário)
    pollingRef.current = setInterval(verificarStatus, 3000);
  }, [cliente, verificarConexao]);

  // Função para parar o polling
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
        // Página ficou visível, verifica status imediatamente
        if (cliente) {
          verificarConexao();
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
  }, [cliente, verificarConexao, iniciarPolling, pararPolling]);

  // Atualiza cliente se o fallback mudar (mobile fix)
  useEffect(() => {
    if (fallbackCliente) {
      setCliente(fallbackCliente);
    }
  }, [fallbackCliente]);

  // Busca cliente apenas se não tiver fallback
  useEffect(() => {
    if (!id || fallbackCliente) return;
    buscarCliente();
  }, [id, buscarCliente, fallbackCliente]);

  // Inicia polling quando cliente estiver carregado
  useEffect(() => {
    if (cliente) {
      iniciarPolling();
    } else {
      pararPolling();
    }
    
    return () => pararPolling();
  }, [cliente, iniciarPolling, pararPolling]);

  const refetch = async () => {
    setLoading(true);
    await Promise.all([buscarCliente(), verificarConexao()]);
    setLoading(false);
  };

  return { cliente, isOnline, loading, erro, refetch };
};
