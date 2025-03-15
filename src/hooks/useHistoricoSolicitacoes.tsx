import { useEffect, useRef, useState } from "react";
import { api } from "../services/api";
import { toast } from "react-hot-toast";
import { Solicitacao } from "../types/index";

export const useHistoricoSolicitacoes = (id: string | undefined) => {
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const solicitacoesAnteriores = useRef<Solicitacao[]>([]);

  const carregar = async (): Promise<Solicitacao[]> => {
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
  };

  // Primeira carga
  useEffect(() => {
    if (!id) return;
    carregar().then((dados) => {
      setSolicitacoes(dados);
      solicitacoesAnteriores.current = dados;
    });
  }, [id]);

  // Verifica alterações de status pendente para concluído
  useEffect(() => {
    if (!id) return;
    const temPendentes = solicitacoes.some((s) => !s.xml_url);
    if (!temPendentes) return;

    const intervalo = setInterval(async () => {
      const atualizadas = await carregar();
      
      atualizadas.forEach((nova: Solicitacao) => {
        const antiga = solicitacoesAnteriores.current.find(
          (a) => a.id_solicitacao === nova.id_solicitacao
        );
        if (antiga && !antiga.xml_url && nova.xml_url) {
          toast.success("✅ XML gerado com sucesso!");
        }
      });

      setSolicitacoes(atualizadas);
      solicitacoesAnteriores.current = atualizadas;
    }, 1000);

    return () => clearInterval(intervalo);
  }, [id, solicitacoes]);

  return { solicitacoes, setSolicitacoes, carregar };
};
