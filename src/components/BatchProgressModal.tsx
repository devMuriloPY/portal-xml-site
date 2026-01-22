import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Copy, CheckCircle, Clock, AlertCircle, XCircle, RefreshCw } from 'lucide-react';
import type { BatchRequest, BatchRequestItem } from '../types';
import { useBatchMonitor } from '../hooks/useBatchRequests';
import { api } from '../services/api';
import toast from 'react-hot-toast';

interface BatchProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMinimize: () => void;
  batchId: string;
}

const BatchProgressModal: React.FC<BatchProgressModalProps> = ({
  isOpen,
  onClose,
  onMinimize,
  batchId
}) => {
  const { batch, isLoading, refetch } = useBatchMonitor(batchId, 5000); // Polling a cada 5 segundos
  const [copiedItems, setCopiedItems] = useState<Set<string>>(new Set());
  const [clientStatuses, setClientStatuses] = useState<Map<string, any>>(new Map());

  // Função para verificar status de um cliente específico
  const checkClientStatus = async (clientId: string) => {
    try {
      const response = await api.get(`//${clientId}`);
      const solicitacoes = response.data;
      
      // Pegar a solicitação mais recente
      if (solicitacoes && solicitacoes.length > 0) {
        const ultimaSolicitacao = solicitacoes[0];
        setClientStatuses(prev => {
          const newMap = new Map(prev);
          newMap.set(clientId, ultimaSolicitacao);
          return newMap;
        });
        
        // XML gerado - sem notificação toast
      }
    } catch (error) {
      console.error(`Erro ao verificar status do cliente ${clientId}:`, error);
    }
  };

  // Polling para verificar status dos clientes
  useEffect(() => {
    if (!batch || !batch.requests || !isOpen) return;

    const clientIds = batch.requests.map(item => item.client_id);
    
    // Verificar status inicial
    clientIds.forEach(clientId => {
      checkClientStatus(clientId);
    });

    // Polling a cada 2 segundos
    const interval = setInterval(() => {
      clientIds.forEach(clientId => {
        checkClientStatus(clientId);
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [batch, isOpen]);

  // Função para copiar URL
  const copyUrl = async (url: string, itemId: string) => {
    // Verificar se a URL existe
    if (!url) {
      toast.error('URL não disponível para cópia');
      return;
    }

    try {
      // Tentar usar a API moderna do clipboard
      if (navigator.clipboard && window.isSecureContext) {
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
      } else {
        // Fallback para navegadores mais antigos ou contextos não seguros
        const textArea = document.createElement('textarea');
        textArea.value = url;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
          document.execCommand('copy');
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
        } catch (fallbackError) {
          console.error('Erro no fallback de cópia:', fallbackError);
          toast.error('Erro ao copiar URL. Tente selecionar e copiar manualmente.');
        } finally {
          document.body.removeChild(textArea);
        }
      }
    } catch (error) {
      console.error('Erro ao copiar URL:', error);
      toast.error('Erro ao copiar URL. Verifique as permissões do navegador.');
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

  // Função para obter ícone do status (sempre concluído)
  const getStatusIcon = () => {
    return <CheckCircle className="h-4 w-4 text-green-600" />;
  };

  // Função para obter cor do status (sempre verde)
  const getStatusColor = () => {
    return 'text-green-600 bg-green-50 border-green-200';
  };

  // Função para obter texto do status (sempre concluído)
  const getStatusText = () => {
    return 'Concluído';
  };

  // Calcular progresso baseado nos clientes com XML pronto
  const getProgress = () => {
    if (!batch || !batch.requests) return 0;
    
    const totalClients = batch.requests.length;
    const completedClients = batch.requests.filter(item => {
      const clientStatus = clientStatuses.get(item.client_id);
      return clientStatus && clientStatus.xml_url;
    }).length;
    
    return Math.round((completedClients / totalClients) * 100);
  };

  // Verificar se o lote está completo
  const isBatchComplete = () => {
    if (!batch || !batch.requests) return false;
    return batch.requests.every(item => {
      const clientStatus = clientStatuses.get(item.client_id);
      return clientStatus && clientStatus.xml_url;
    });
  };

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
                  <div className={`p-2 rounded-lg ${isBatchComplete() ? 'bg-green-100' : 'bg-blue-100'}`}>
                    {isBatchComplete() ? (
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    ) : (
                      <RefreshCw className="h-6 w-6 text-blue-600 animate-spin" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">
                      {isBatchComplete() ? 'Lote Concluído' : 'Processando Lote'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {batch ? `${getProgress()}% concluído` : 'Carregando...'}
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
                {/* Status do Lote */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Progresso Geral</span>
                    <span className="text-sm text-gray-600">{getProgress()}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${isBatchComplete() ? 'bg-green-600' : 'bg-blue-600'}`}
                      style={{ width: `${getProgress()}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                    <span>Status: {isBatchComplete() ? 'Concluído' : 'Processando'}</span>
                    <span>Criado em: {new Date(batch.created_at).toLocaleString()}</span>
                  </div>
                </div>

                {/* Lista de Solicitações */}
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="space-y-3">
                    {batch.requests.map((item: BatchRequestItem) => {
                      const clientStatus = clientStatuses.get(item.client_id);
                      const hasXml = clientStatus && clientStatus.xml_url;
                      const isCompleted = hasXml;
                      
                      return (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`border rounded-lg p-4 ${isCompleted ? 'text-green-600 bg-green-50 border-green-200' : 'text-blue-600 bg-blue-50 border-blue-200'}`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {isCompleted ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />
                              )}
                              <div>
                                <h4 className="font-medium">{item.client_name}</h4>
                                <p className="text-xs opacity-75">
                                  {isCompleted ? 'Concluído' : 'Processando'}
                                  {clientStatus?.data_solicitacao && (
                                    <span className="ml-2">
                                      • {new Date(clientStatus.data_solicitacao).toLocaleTimeString()}
                                    </span>
                                  )}
                                </p>
                                {clientStatus?.error_message && (
                                  <p className="text-xs text-red-600 mt-1">
                                    Erro: {clientStatus.error_message}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Ações - mostrar apenas se há XML */}
                            {hasXml && (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => copyUrl(clientStatus.xml_url, item.id)}
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
                                  onClick={() => downloadXml(clientStatus.xml_url, item.client_name)}
                                  className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs"
                                >
                                  <Download className="h-3 w-3" />
                                  Baixar
                                </button>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      {batch.requests?.filter(item => {
                        const clientStatus = clientStatuses.get(item.client_id);
                        return clientStatus && clientStatus.xml_url;
                      }).length || 0} de {batch.requests?.length || 0} XML(s) gerado(s)
                    </div>
                    <button
                      onClick={isBatchComplete() ? onClose : onMinimize}
                      className={`px-4 py-2 text-white rounded-lg transition-colors font-medium ${isBatchComplete() ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                    >
                      {isBatchComplete() ? 'Fechar' : 'Minimizar'}
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
