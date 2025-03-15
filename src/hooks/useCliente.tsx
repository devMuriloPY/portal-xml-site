import { useEffect, useState, useCallback } from "react";
import { api } from "../services/api";
import { Client } from "../types/index";

export const useCliente = (id: string | undefined, fallbackCliente?: Client | null) => {
  const [cliente, setCliente] = useState<Client | null>(fallbackCliente || null);
  const [isOnline, setIsOnline] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [erro, setErro] = useState<string | null>(null); // opcional: para mensagens de erro

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
      setIsOnline(idsConectados.includes(Number(id)));
    } catch (error) {
      console.error("Erro ao verificar status do cliente:", error);
      setIsOnline(null);
    }
  }, [id]);

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

  // Verifica status online apenas quando cliente estiver carregado
  useEffect(() => {
    if (cliente) verificarConexao();
  }, [cliente, verificarConexao]);

  const refetch = async () => {
    setLoading(true);
    await Promise.all([buscarCliente(), verificarConexao()]);
    setLoading(false);
  };

  return { cliente, isOnline, loading, erro, refetch };
};
