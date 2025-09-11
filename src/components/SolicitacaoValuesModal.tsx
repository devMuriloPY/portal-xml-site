import { X, FileText, TrendingUp, TrendingDown, DollarSign, Hash } from "lucide-react";
import { Solicitacao } from "../types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  solicitacao: Solicitacao;
}

export const SolicitacaoValuesModal = ({ isOpen, onClose, solicitacao }: Props) => {
  if (!isOpen) return null;

  const formatCurrency = (value: number | undefined) => {
    if (value === undefined || value === null) return "R$ 0,00";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatNumber = (value: number | undefined) => {
    if (value === undefined || value === null) return "0";
    return new Intl.NumberFormat("pt-BR").format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const formatDateTime = (dateTimeString: string) => {
    const [date, time] = dateTimeString.split("T");
    const [year, month, day] = date.split("-");
    const timeFormatted = time.slice(0, 5);
    return `${day}/${month}/${year} às ${timeFormatted}`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Valores da Solicitação</h2>
                <p className="text-blue-100 text-sm">
                  Período: {formatDate(solicitacao.data_inicio)} até {formatDate(solicitacao.data_fim)}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-3 sm:p-6 overflow-y-auto flex-1">
          {/* Informações da Solicitação */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-2">Informações da Solicitação</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Solicitado em:</span>
                <span className="ml-2 font-medium">{formatDateTime(solicitacao.data_solicitacao)}</span>
              </div>
              <div>
                <span className="text-gray-500">Status:</span>
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                  solicitacao.status === "concluido" 
                    ? "bg-green-100 text-green-800" 
                    : "bg-yellow-100 text-yellow-800"
                }`}>
                  {solicitacao.status === "concluido" ? "Concluído" : "Pendente"}
                </span>
              </div>
            </div>
          </div>

          {/* NFE */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Nota Fiscal Eletrônica (NFE)</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* NFE Autorizadas */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <h4 className="font-semibold text-green-800">Autorizadas</h4>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-gray-600">Valor Total:</span>
                    </div>
                    <span className="font-bold text-green-700">
                      {formatCurrency(solicitacao.valor_nfe_autorizadas)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Hash className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-gray-600">Quantidade:</span>
                    </div>
                    <span className="font-bold text-green-700">
                      {formatNumber(solicitacao.quantidade_nfe_autorizadas)}
                    </span>
                  </div>
                </div>
              </div>

              {/* NFE Canceladas */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingDown className="w-5 h-5 text-red-600" />
                  <h4 className="font-semibold text-red-800">Canceladas</h4>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-red-600" />
                      <span className="text-sm text-gray-600">Valor Total:</span>
                    </div>
                    <span className="font-bold text-red-700">
                      {formatCurrency(solicitacao.valor_nfe_canceladas)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Hash className="w-4 h-4 text-red-600" />
                      <span className="text-sm text-gray-600">Quantidade:</span>
                    </div>
                    <span className="font-bold text-red-700">
                      {formatNumber(solicitacao.quantidade_nfe_canceladas)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* NFCe */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FileText className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Nota Fiscal do Consumidor Eletrônica (NFCe)</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* NFCe Autorizadas */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <h4 className="font-semibold text-green-800">Autorizadas</h4>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-gray-600">Valor Total:</span>
                    </div>
                    <span className="font-bold text-green-700">
                      {formatCurrency(solicitacao.valor_nfc_autorizadas)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Hash className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-gray-600">Quantidade:</span>
                    </div>
                    <span className="font-bold text-green-700">
                      {formatNumber(solicitacao.quantidade_nfc_autorizadas)}
                    </span>
                  </div>
                </div>
              </div>

              {/* NFCe Canceladas */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingDown className="w-5 h-5 text-red-600" />
                  <h4 className="font-semibold text-red-800">Canceladas</h4>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-red-600" />
                      <span className="text-sm text-gray-600">Valor Total:</span>
                    </div>
                    <span className="font-bold text-red-700">
                      {formatCurrency(solicitacao.valor_nfc_canceladas)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Hash className="w-4 h-4 text-red-600" />
                      <span className="text-sm text-gray-600">Quantidade:</span>
                    </div>
                    <span className="font-bold text-red-700">
                      {formatNumber(solicitacao.quantidade_nfc_canceladas)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Resumo Total */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Resumo Total
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-700">
                  {formatCurrency(
                    (solicitacao.valor_nfe_autorizadas || 0) + 
                    (solicitacao.valor_nfc_autorizadas || 0)
                  )}
                </div>
                <div className="text-sm text-gray-600">Valor Total Autorizado</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-700">
                  {formatNumber(
                    (solicitacao.quantidade_nfe_autorizadas || 0) + 
                    (solicitacao.quantidade_nfc_autorizadas || 0)
                  )}
                </div>
                <div className="text-sm text-gray-600">Total de Notas Autorizadas</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-3 sm:px-6 py-3 sm:py-4 border-t flex-shrink-0">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
