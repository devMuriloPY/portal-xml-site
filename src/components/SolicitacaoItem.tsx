import { Calendar, Link as LinkIcon, Trash2, Copy, Check, BarChart3 } from "lucide-react";
import { Solicitacao } from "../types/index";
import { useState } from "react";
import { SolicitacaoValuesModal } from "./SolicitacaoValuesModal";
import { ConfirmacaoModal } from "./ConfirmacaoModal";

interface Props {
  item: Solicitacao;
  onDelete: (id: number) => void;
}

export const SolicitacaoItem = ({ item, onDelete }: Props) => {
  const [copied, setCopied] = useState(false);
  const [isValuesModalOpen, setIsValuesModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(item.xml_url!);
      setCopied(true);
      
      // Reset do estado após 2 segundos
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Erro ao copiar link:", error);
      // Fallback para navegadores mais antigos
      const textArea = document.createElement("textarea");
      textArea.value = item.xml_url!;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <li className="border p-4 rounded-xl bg-gray-50 hover:bg-white transition">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Informações da Solicitação */}
        <div className="flex flex-col text-gray-700">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="font-medium">
            {(() => {
              const [data, hora] = item.data_solicitacao.split("T"); // "2025-03-15", "09:30:03"
              const [ano, mes, dia] = data.split("-");
              const horaFormatada = hora.slice(0, 5); // "09:30"
              return `${dia}/${mes}/${ano}, ${horaFormatada}`;
            })()}
          </span>
          </div>
          <div className="ml-6 text-sm text-gray-500">
            <span>{item.status === "concluido" ? "Concluído" : "Pendente"}</span><br />
            <span>
              Período: {new Date(item.data_inicio).toLocaleDateString()} até {new Date(item.data_fim).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Resumo dos Valores */}
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex flex-wrap items-center gap-3 lg:gap-4">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">Autorizadas:</span>
              <span className="font-semibold text-green-700">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format((item.valor_nfe_autorizadas || 0) + (item.valor_nfc_autorizadas || 0))}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-gray-600">Canceladas:</span>
              <span className="font-semibold text-red-700">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format((item.valor_nfe_canceladas || 0) + (item.valor_nfc_canceladas || 0))}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 lg:gap-4">
            <div className="flex items-center gap-1">
              <span className="text-gray-600">Total Emitido:</span>
              <span className="font-semibold text-blue-700">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(
                  (item.valor_nfe_autorizadas || 0) + 
                  (item.valor_nfc_autorizadas || 0) + 
                  (item.valor_nfe_canceladas || 0) + 
                  (item.valor_nfc_canceladas || 0)
                )}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-gray-600">Qtd. Autorizadas:</span>
              <span className="font-semibold text-green-700">
                {new Intl.NumberFormat("pt-BR").format(
                  (item.quantidade_nfe_autorizadas || 0) + 
                  (item.quantidade_nfc_autorizadas || 0)
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Ações */}
      <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-gray-200">
        {/* Botão Visualizar Valores */}
        <button
          onClick={() => setIsValuesModalOpen(true)}
          className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-800 hover:underline transition-colors"
          title="Visualizar valores da solicitação"
        >
          <BarChart3 className="w-4 h-4" />
          Valores
        </button>

        {item.xml_url ? (
          <>
            {/* Botão de Download */}
            <a
              href={item.xml_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
              title="Baixar XML"
            >
              <LinkIcon className="w-4 h-4" />
              Baixar XML
            </a>
            
            {/* Botão de Copiar Link */}
            <button
              onClick={handleCopyLink}
              className={`flex items-center gap-2 text-sm transition-all duration-200 ${
                copied 
                  ? "text-green-600 hover:text-green-700" 
                  : "text-gray-600 hover:text-gray-800"
              }`}
              title={copied ? "Link copiado!" : "Copiar link do XML"}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copiar</span>
                </>
              )}
            </button>
          </>
        ) : (
          <span className="text-gray-400 text-sm">Aguardando geração</span>
        )}
        
        <button onClick={() => setIsDeleteModalOpen(true)} title="Excluir">
          <Trash2 className="w-5 h-5 text-red-500 hover:text-red-700 transition" />
        </button>
      </div>

      {/* Modal de Valores */}
      <SolicitacaoValuesModal
        isOpen={isValuesModalOpen}
        onClose={() => setIsValuesModalOpen(false)}
        solicitacao={item}
      />

      {/* Modal de Confirmação de Exclusão */}
      <ConfirmacaoModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => onDelete(item.id_solicitacao)}
        mensagem="Tem certeza que deseja excluir esta solicitação? Esta ação não pode ser desfeita."
        titulo="Excluir Solicitação"
      />
    </li>
  );
};
