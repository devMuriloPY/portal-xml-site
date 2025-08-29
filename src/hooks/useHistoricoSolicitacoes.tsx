import { useEffect, useRef, useState, useCallback } from "react";
import { api } from "../services/api";
import { toast } from "react-hot-toast";
import { Solicitacao } from "../types/index";

export const useHistoricoSolicitacoes = (id: string | undefined) => {
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const solicitacoesAnteriores = useRef<Solicitacao[]>([]);
  const pollingRef = useRef<number | null>(null);
  const isPageVisibleRef = useRef(true);

  const carregar = useCallback(async (): Promise<Solicitacao[]> => {
    try {
      const res = await api.get(`/auth/solicitacoes/${id}`);
      const ordenado: Solicitacao[] = res.data.sort(
        (a: Solicitacao, b: Solicitacao) =>
          new Date(b.data_solicitacao).getTime() -
          new Date(a.data_solicitacao).getTime()
      );
      return ordenado;
    } catch {
      return [];
    }
  }, [id]);

  // Função para verificar mudanças nas solicitações
  const verificarMudancas = useCallback(async () => {
    if (!id || !isPageVisibleRef.current) return;
    
    try {
      const atualizadas = await carregar();
      
      // Verifica se há mudanças de status pendente para concluído
      atualizadas.forEach((nova: Solicitacao) => {
        const antiga = solicitacoesAnteriores.current.find(
          (a) => a.id_solicitacao === nova.id_solicitacao
        );
        
        if (antiga && !antiga.xml_url && nova.xml_url) {
          toast.success("✅ XML gerado com sucesso!");
        }
      });

      // Só atualiza se houve mudanças reais
      const houveMudancas = JSON.stringify(atualizadas) !== JSON.stringify(solicitacoesAnteriores.current);
      
      if (houveMudancas) {
        setSolicitacoes(atualizadas);
        solicitacoesAnteriores.current = atualizadas;
        console.log("🔄 Solicitações atualizadas");
      }
    } catch (error) {
      console.error("Erro ao verificar mudanças:", error);
    }
  }, [id, carregar]);

  // Função para iniciar polling
  const iniciarPolling = useCallback(() => {
    if (pollingRef.current) return;
    
    // Primeira verificação imediata
    verificarMudancas();
    
    // Polling a cada 2 segundos para solicitações (mais frequente que status online)
    pollingRef.current = setInterval(verificarMudancas, 2000);
  }, [verificarMudancas]);

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
        if (id) {
          verificarMudancas();
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
  }, [id, verificarMudancas, iniciarPolling, pararPolling]);

  // Primeira carga e início do polling
  useEffect(() => {
    if (!id) return;
    
    carregar().then((dados) => {
      setSolicitacoes(dados);
      solicitacoesAnteriores.current = dados;
      iniciarPolling();
    });
    
    return () => pararPolling();
  }, [id, carregar, iniciarPolling, pararPolling]);

  return { solicitacoes, setSolicitacoes, carregar };
};
