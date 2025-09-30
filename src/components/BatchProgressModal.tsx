import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Copy, CheckCircle, Clock, AlertCircle, XCircle, RefreshCw } from 'lucide-react';
import type { BatchRequest, BatchRequestItem } from '../types';
import { useBatchMonitor } from '../hooks/useBatchRequests';
import toast from 'react-hot-toast';

interface BatchProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  batchId: string;
}

const BatchProgressModal: React.FC<BatchProgressModalProps> = ({
  isOpen,
  onClose,
  batchId
}) => {
  const { batch, isLoading, refetch } = useBatchMonitor(batchId, 3000); // Polling a cada 3 segundos
  const [copiedItems, setCopiedItems] = useState<Set<string>>(new Set());

  // Função para copiar URL
  const copyUrl = async (url: string, itemId: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedItems(prev => new Set(prev).add(itemId));
      toast.success('URL copiada para a área de transferência!');
      
      // Remover da lista de copiados após 2 segundos
      setTimeout(() => {
        setCopiedItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(itemId);
          return newSet;
        });
      }, 2000);
    } catch (error) {
      toast.error('Erro ao copiar URL');
    }
  };

  // Função para baixar XML
  const downloadXml = (url: string, clientName: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `${clientName}_xml.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Download iniciado!');
  };

  // Função para obter ícone do status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'processing':
        return <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  // Função para obter cor do status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'processing':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  // Função para obter texto do status
  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Concluído';
      case 'processing':
        return 'Processando';
      case 'error':
        return 'Erro';
      default:
        return 'Pendente';
    }
  };

  // Calcular progresso
  const getProgress = () => {
    if (!batch) return 0;
    return Math.round((batch.completed_requests / batch.total_requests) * 100);
  };

  // Verificar se o lote está completo
  const isBatchComplete = batch && ['completed', 'error'].includes(batch.status);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-blue-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <RefreshCw className={`h-6 w-6 text-blue-600 ${!isBatchComplete ? 'animate-spin' : ''}`} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Progresso do Lote</h3>
                  <p className="text-sm text-gray-600">
                    {batch ? `${batch.completed_requests}/${batch.total_requests} concluídos` : 'Carregando...'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={refetch}
                  className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                  title="Atualizar"
                >
                  <RefreshCw className="h-4 w-4 text-gray-500" />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col h-full max-h-[calc(90vh-80px)]">
            {isLoading && !batch ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <RefreshCw className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-4" />
                  <p className="text-gray-600">Carregando informações do lote...</p>
                </div>
              </div>
            ) : batch ? (
              <>
                {/* Progress Bar */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Progresso Geral</span>
                    <span className="text-sm text-gray-600">{getProgress()}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${getProgress()}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                    <span>Status: {getStatusText(batch.status)}</span>
                    <span>Criado em: {new Date(batch.created_at).toLocaleString()}</span>
                  </div>
                </div>

                {/* Lista de Solicitações */}
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="space-y-3">
                    {batch.requests.map((item: BatchRequestItem) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`border rounded-lg p-4 ${getStatusColor(item.status)}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {getStatusIcon(item.status)}
                            <div>
                              <h4 className="font-medium">{item.client_name}</h4>
                              <p className="text-xs opacity-75">
                                {getStatusText(item.status)}
                                {item.completed_at && (
                                  <span className="ml-2">
                                    • {new Date(item.completed_at).toLocaleTimeString()}
                                  </span>
                                )}
                              </p>
                              {item.error_message && (
                                <p className="text-xs text-red-600 mt-1">
                                  Erro: {item.error_message}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Ações */}
                          {item.status === 'completed' && item.xml_url && (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => copyUrl(item.xml_url!, item.id)}
                                className="flex items-center gap-1 px-3 py-1 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-xs"
                              >
                                {copiedItems.has(item.id) ? (
                                  <CheckCircle className="h-3 w-3 text-green-600" />
                                ) : (
                                  <Copy className="h-3 w-3" />
                                )}
                                {copiedItems.has(item.id) ? 'Copiado' : 'Copiar URL'}
                              </button>
                              <button
                                onClick={() => downloadXml(item.xml_url!, item.client_name)}
                                className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs"
                              >
                                <Download className="h-3 w-3" />
                                Baixar
                              </button>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      {batch.completed_requests} de {batch.total_requests} solicitações concluídas
                      {batch.failed_requests > 0 && (
                        <span className="text-red-600 ml-2">
                          • {batch.failed_requests} com erro
                        </span>
                      )}
                    </div>
                    <button
                      onClick={onClose}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      {isBatchComplete ? 'Fechar' : 'Minimizar'}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <AlertCircle className="h-8 w-8 text-red-600 mx-auto mb-4" />
                  <p className="text-gray-600">Erro ao carregar informações do lote</p>
                  <button
                    onClick={refetch}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    Tentar Novamente
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default BatchProgressModal;
